import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ROUTES, exitAnalysisFlow, safeBack } from "@/utils/navigation";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
  ActivityIndicator,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { GaugeChart } from "@/components/charts/gaugechart";
import { Background } from "@/components/ui/background";
import { useAuth } from "@/contexts/AuthContext";
import { getUsuarioDetails } from "@/repositories/profileRepository";
import { useProperty } from "@/contexts/PropertyContext";
import { getTalhoesByProperty } from "@/repositories/talhaoRepository";
import { getPesByTalhao } from "@/repositories/peRepository";
import { persistAnalysisResult } from "@/services/persistAnalysis";
import type { Talhao } from "@/types/talhao";
import type { Pe } from "@/types/pe";
import {
  normalizeDeficiencyType,
  getDeficiencyAccentColor,
  getDeficiencyTitle,
  getDeficiencyExplanation,
  type DeficiencyType,
} from "@/utils/deficiencyInfo";
import { Palette, FontSizes, FontWeights } from "@/constants/theme";

type TreeStatus = "Não informado" | "Não tratado" | "Em tratamento" | "Tratado";

const STATUS_OPTIONS: {
  id: TreeStatus;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  backgroundColor: string;
  textColor: string;
  iconColor: string;
}[] = [
  {
    id: "Não informado",
    label: "Não informado",
    icon: "remove-outline",
    backgroundColor: "#EEEEEE",
    textColor: "#1A1A1A",
    iconColor: "#555555",
  },
  {
    id: "Não tratado",
    label: "Não tratado",
    icon: "remove-circle-outline",
    backgroundColor: "#E04842",
    textColor: Palette.white,
    iconColor: Palette.white,
  },
  {
    id: "Em tratamento",
    label: "Em tratamento",
    icon: "time-outline",
    backgroundColor: "#EAB032",
    textColor: "#1F2937",
    iconColor: "#1F2937",
  },
  {
    id: "Tratado",
    label: "Tratado",
    icon: "checkmark",
    backgroundColor: "#83C570",
    textColor: Palette.white,
    iconColor: Palette.white,
  },
];

export default function AnalysisSummaryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { selectedProperty } = useProperty();
  const params = useLocalSearchParams();

  const analysisId = (params.analysisId as string) || Date.now().toString();
  const returnTo = params.returnTo as string | undefined;
  const imageUri = params.imageUri as string | undefined;
  const probability = Math.min(
    100,
    Math.max(0, Number(params.probability) || 0)
  );
  const deficiencyType = normalizeDeficiencyType(
    params.deficiencyType as string
  );

  const [view, setView] = useState<"result" | "summary">("result");
  const [loadingContext, setLoadingContext] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [authorAvatar, setAuthorAvatar] = useState<string | undefined>();
  const [talhoes, setTalhoes] = useState<Talhao[]>([]);
  const [pes, setPes] = useState<Pe[]>([]);
  const [selectedTalhaoId, setSelectedTalhaoId] = useState<string>("");
  const [selectedPeId, setSelectedPeId] = useState<string>("");
  const [savedToDb, setSavedToDb] = useState(false);
  const [savedRelatorioId, setSavedRelatorioId] = useState<string | undefined>();
  const [status, setStatus] = useState<TreeStatus>("Não informado");
  const [observacoes, setObservacoes] = useState<string>("");

  // Modais de Seleção Personalizados
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [talhaoModalVisible, setTalhaoModalVisible] = useState(false);
  const [peModalVisible, setPeModalVisible] = useState(false);

  // Mapa ref para animar para a posição do pé selecionado
  const mapViewRef = useRef<MapView | null>(null);

  const accentColor = getDeficiencyAccentColor(deficiencyType);
  const explanation = useMemo(
    () => getDeficiencyExplanation(deficiencyType),
    [deficiencyType]
  );

  const selectedTalhao = talhoes.find((t) => t.id === selectedTalhaoId);
  const selectedPe = pes.find((p) => p.id === selectedPeId);

  // Espelha dinamicamente as cores e ícone do status selecionado
  const currentStatusConfig = useMemo(() => {
    return STATUS_OPTIONS.find((opt) => opt.id === status) || STATUS_OPTIONS[0];
  }, [status]);

  const formattedId = useMemo(() => {
    // Prefer the real DB relatorio ID after saving
    const idToUse = savedRelatorioId || analysisId;
    if (!idToUse) return "001";
    const num = parseInt(idToUse, 10);
    if (!isNaN(num)) {
      return String(num).padStart(3, "0");
    }
    return idToUse.slice(-3);
  }, [analysisId, savedRelatorioId]);

  const formattedDate = useMemo(() => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const monthNames = [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out", "Nov", "Dez",
    ];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    return `${day} ${month}, ${year}`;
  }, []);

  useEffect(() => {
    async function loadContext() {
      if (!user?.id) {
        setLoadingContext(false);
        return;
      }
      try {
        const details = await getUsuarioDetails(user.id);
        setAuthorName(details?.fullName || user.name || "Usuário");
        setAuthorAvatar(details?.avatarUrl);

        if (selectedProperty?.id) {
          const list = await getTalhoesByProperty(selectedProperty.id);
          setTalhoes(list);
          if (list.length === 1) {
            setSelectedTalhaoId(list[0].id);
            const peList = await getPesByTalhao(list[0].id);
            setPes(peList);
            if (peList.length === 1) setSelectedPeId(peList[0].id);
          }
        } else {
          setTalhoes([]);
          setPes([]);
        }
      } catch (e) {
        console.error("Erro ao carregar contexto da análise:", e);
      } finally {
        setLoadingContext(false);
      }
    }
    void loadContext();
  }, [user?.id, user?.name, selectedProperty?.id]);

  const loadPesForTalhao = useCallback(async (talhaoId: string) => {
    const peList = await getPesByTalhao(talhaoId);
    setPes(peList);
    setSelectedPeId(peList.length === 1 ? peList[0].id : "");
  }, []);

  const handleBack = () => {
    if (view === "summary") {
      setView("result");
      return;
    }
    if (returnTo && String(returnTo).startsWith("/")) {
      router.replace(returnTo as typeof ROUTES.home);
      return;
    }
    safeBack(router, ROUTES.scan);
  };

  const handleInfoPress = () => {
    Alert.alert(
      explanation.title,
      [
        explanation.meaning,
        "",
        "O que pode ser feito:",
        ...explanation.recommendations.map((r, i) => `${i + 1}. ${r}`),
        "",
        explanation.footer,
      ].join("\n"),
      [{ text: "Entendi" }]
    );
  };

  const openTalhaoPicker = () => {
    if (talhoes.length === 0) {
      Alert.alert(
        "Sem talhões",
        "Cadastre um talhão em Histórico para vincular esta análise."
      );
      return;
    }
    setTalhaoModalVisible(true);
  };

  const openPePicker = () => {
    if (!selectedTalhaoId) {
      Alert.alert("Talhão", "Selecione o talhão antes do pé.");
      return;
    }
    if (pes.length === 0) {
      Alert.alert(
        "Sem árvores",
        "Cadastre uma árvore neste talhão para salvar a análise no histórico."
      );
      return;
    }
    setPeModalVisible(true);
  };

  const handleFinish = async () => {
    if (!selectedPeId) {
      Alert.alert(
        "Vincular amostra",
        "Selecione o talhão e o pé analisados para salvar no banco e atualizar os gráficos da home."
      );
      return;
    }
    if (!imageUri) {
      Alert.alert(
        "Imagem",
        "URI da imagem não encontrada. Refaça a análise pela câmera."
      );
      return;
    }
    if (savedToDb) {
      exitAnalysisFlow(router);
      return;
    }

    setSaving(true);
    try {
      const result = await persistAnalysisResult({
        peId: selectedPeId,
        imageUri,
        deficiencyType,
        probability,
      });
      setSavedToDb(true);
      // Salva o ID real do banco para exibir no cabeçalho
      setSavedRelatorioId(result.relatorioId);
      Alert.alert(
        "Salvo",
        "Análise registrada. Os gráficos da home serão atualizados.",
        [{ text: "OK", onPress: () => exitAnalysisFlow(router) }]
      );
    } catch (e) {
      console.error(e);
      const msg =
        e instanceof Error ? e.message : "Não foi possível salvar a análise.";
      Alert.alert("Erro ao salvar", msg);
    } finally {
      setSaving(false);
    }
  };

  const handleExportPdf = () => {
    Alert.alert("Exportar PDF", "O relatório em PDF da análise foi gerado com sucesso.");
  };

  const gaugeType: DeficiencyType =
    deficiencyType === "Indefinido" ? "Saudável" : deficiencyType;

  // TELA 1: RESULTADO DA ANÁLISE
  if (view === "result") {
    return (
      <Background>
        <SafeAreaView style={styles.safeArea} edges={["top", "bottom", "left", "right"]}>
          <StatusBar barStyle="dark-content" backgroundColor="#FAF1E5" />

          <TouchableOpacity
            style={[styles.floatingBackBtn, { top: insets.top + 8 }]}
            onPress={handleBack}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="chevron-back" size={26} color="#1A2C3E" />
          </TouchableOpacity>

          <ScrollView
            contentContainerStyle={styles.resultScrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.resultCard}>
              <Text style={styles.resultCardTitle}>Resultado da análise</Text>
              <Text style={styles.resultCardSubtitle}>Análise #{formattedId}</Text>

              <View style={styles.cardDivider} />

              <Text style={styles.detectedLabel}>DEFICIÊNCIA DETECTADA</Text>
              <Text style={[styles.deficiencyLargeTitle, { color: accentColor }]}>
                {getDeficiencyTitle(deficiencyType)}
              </Text>
              <Text style={styles.probEstimateSubtitle}>Probabilidade estimada</Text>

              <View style={styles.gaugeWrapper}>
                <GaugeChart
                  percentage={probability}
                  size={210}
                  showPercentage
                  deficiencyType={gaugeType}
                />
              </View>

              <TouchableOpacity
                style={styles.primaryPillButton}
                activeOpacity={0.85}
                onPress={() => setView("summary")}
              >
                <View style={styles.buttonIconSpacer} />
                <Text style={styles.primaryPillButtonText}>Ver resumo técnico</Text>
                <Ionicons name="chevron-forward" size={18} color={Palette.white} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.outlinePillButton}
                activeOpacity={0.85}
                onPress={handleInfoPress}
              >
                <View style={styles.buttonIconSpacer} />
                <Text style={styles.outlinePillButtonText}>Entenda o resultado</Text>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color={Palette.primary}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Background>
    );
  }

  // TELA 2: RESUMO DA ANÁLISE (STATUS REFLETE COR E ÍCONE)
  return (
    <View style={styles.summaryScreenContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={Palette.white} />

      <SafeAreaView style={styles.safeArea} edges={["top", "bottom", "left", "right"]}>
        {/* Cabeçalho Branco */}
        <View style={styles.summaryTopHeader}>
          <TouchableOpacity
            style={styles.summaryBackBtn}
            onPress={handleBack}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="chevron-back" size={26} color="#1A2C3E" />
          </TouchableOpacity>
          <Text style={styles.summaryHeaderTitle}>Resumo da análise</Text>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.summaryScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* BLOCO 1: Informações Gerais da Análise */}
          <View style={styles.blockContainer}>
            <View style={styles.rowSpaced}>
              <Text style={styles.summaryAnalysisId}>Análise #{formattedId}</Text>
              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={14} color="#888" />
                <Text style={styles.dateText}>{formattedDate}</Text>
              </View>
            </View>

            <View style={styles.cardDivider} />

            <Text style={styles.fieldLabel}>Resultado</Text>
            <View style={styles.resultStatusRow}>
              <Ionicons
                name="warning"
                size={20}
                color={accentColor}
                style={{ marginRight: 8 }}
              />
              <Text style={[styles.resultDeficiencyText, { color: accentColor }]}>
                {deficiencyType === "Indefinido"
                  ? "Sem deficiência identificada"
                  : `Deficiência de ${getDeficiencyTitle(deficiencyType)}`}
              </Text>
            </View>

            <Text style={[styles.fieldLabel, { marginTop: 18 }]}>Confiança da IA</Text>
            <Text style={[styles.confidenceValueText, { color: accentColor }]}>
              {probability}%
            </Text>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${probability}%`, backgroundColor: accentColor },
                ]}
              />
            </View>
          </View>

          <View style={styles.sectionSeparator} />

          {/* BLOCO 2: Localização da Amostra */}
          <View style={styles.blockContainer}>
            <Text style={styles.sectionHeading}>Localização da amostra</Text>

            <View style={styles.mapThumbnailContainer}>
              <MapView
                ref={mapViewRef}
                style={styles.mapView}
                initialRegion={{
                  latitude: selectedPe?.latitude || selectedProperty?.latitude || -24.71852,
                  longitude: selectedPe?.longitude || selectedProperty?.longitude || -47.88349,
                  latitudeDelta: selectedPe?.latitude ? 0.001 : 0.003,
                  longitudeDelta: selectedPe?.longitude ? 0.001 : 0.003,
                }}
                region={
                  selectedPe?.latitude && selectedPe?.longitude
                    ? {
                        latitude: selectedPe.latitude,
                        longitude: selectedPe.longitude,
                        latitudeDelta: 0.001,
                        longitudeDelta: 0.001,
                      }
                    : undefined
                }
                mapType="satellite"
                provider={PROVIDER_GOOGLE}
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
              >
                {selectedPe?.latitude && selectedPe?.longitude ? (
                  <Marker
                    coordinate={{
                      latitude: selectedPe.latitude,
                      longitude: selectedPe.longitude,
                    }}
                    pinColor="#16A34A"
                    title={selectedPe.nome}
                  />
                ) : selectedProperty?.latitude ? (
                  <Marker
                    coordinate={{
                      latitude: selectedProperty.latitude,
                      longitude: selectedProperty.longitude,
                    }}
                    pinColor="#F59E0B"
                  />
                ) : null}
              </MapView>

              <TouchableOpacity
                style={styles.mapExpandButton}
                activeOpacity={0.8}
                onPress={() => router.push("/(tabs)/Maps/maps-location")}
              >
                <Ionicons name="scan-outline" size={18} color={Palette.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.locationControlsRow}>
              <View style={styles.chipsGroup}>
                <TouchableOpacity
                  style={styles.selectionChip}
                  onPress={openTalhaoPicker}
                  activeOpacity={0.7}
                >
                  <Ionicons name="map-outline" size={14} color={Palette.primary} />
                  <Text style={styles.selectionChipText} numberOfLines={1}>
                    {selectedTalhao?.name || "Talhão"}
                  </Text>
                  <Ionicons name="chevron-down" size={13} color="#888" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.selectionChip}
                  onPress={openPePicker}
                  activeOpacity={0.7}
                >
                  <Ionicons name="leaf-outline" size={14} color={Palette.primary} />
                  <Text style={styles.selectionChipText} numberOfLines={1}>
                    {selectedPe?.nome || "Pé"}
                  </Text>
                  <Ionicons name="chevron-down" size={13} color="#888" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => router.push("/(tabs)/Maps/maps-location")}
                activeOpacity={0.7}
              >
                <Text style={styles.viewFullMapLink}>Ver mapa completo &gt;</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.sectionSeparator} />

          {/* BLOCO 3: Informações Técnicas */}
          <View style={styles.blockContainer}>
            <Text style={styles.sectionHeading}>Informações</Text>

            <View style={styles.infoTableRow}>
              <Text style={styles.infoRowTitle}>Autor :</Text>
              <View style={styles.authorBadge}>
                {authorAvatar ? (
                  <Image source={{ uri: authorAvatar }} style={styles.authorImg} />
                ) : (
                  <View style={styles.authorPlaceholder}>
                    <Ionicons name="person" size={14} color="#9CA3AF" />
                  </View>
                )}
                <Text style={styles.authorNameText}>
                  {loadingContext ? "Carregando..." : authorName}
                </Text>
              </View>
            </View>

            {/* STATUS DINÂMICO COM COR E ÍCONE ESPELHADOS */}
            <View style={styles.infoTableRow}>
              <Text style={styles.infoRowTitle}>Status:</Text>
              <TouchableOpacity
                style={[
                  styles.statusPillPicker,
                  { backgroundColor: currentStatusConfig.backgroundColor },
                ]}
                onPress={() => setStatusModalVisible(true)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={currentStatusConfig.icon}
                  size={14}
                  color={currentStatusConfig.iconColor}
                />
                <Text
                  style={[
                    styles.statusPillText,
                    { color: currentStatusConfig.textColor },
                  ]}
                >
                  {currentStatusConfig.label}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={13}
                  color={currentStatusConfig.iconColor}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.infoTableRow}>
              <Text style={styles.infoRowTitle}>ID da análise:</Text>
              <Text style={styles.analysisIdText}>#{formattedId}</Text>
            </View>
          </View>

          <View style={styles.sectionSeparator} />

          {/* BLOCO 4: Relatório / Observações */}
          <View style={styles.blockContainer}>
            <Text style={styles.sectionHeading}>Relatório</Text>
            <TextInput
              style={styles.reportTextInput}
              placeholder="Adicione suas observações..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              value={observacoes}
              onChangeText={setObservacoes}
            />
          </View>

          <View style={styles.sectionSeparator} />

          {/* BLOCO 5: Botões de Ação */}
          <View style={styles.buttonsBlock}>
            <TouchableOpacity
              style={styles.saveHistoryPillBtn}
              activeOpacity={0.85}
              onPress={() => void handleFinish()}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color={Palette.white} />
              ) : (
                <>
                  <Ionicons name="save-outline" size={18} color={Palette.white} />
                  <Text style={styles.saveHistoryPillText}>
                    {savedToDb ? "Salvo no histórico" : "Salvar no histórico"}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.exportPdfPillBtn}
              activeOpacity={0.85}
              onPress={handleExportPdf}
            >
              <Ionicons
                name="document-text-outline"
                size={18}
                color={Palette.primary}
              />
              <Text style={styles.exportPdfPillText}>Exportar como PDF</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* MODAL PERSONALIZADO DE STATUS */}
        <Modal
          visible={statusModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setStatusModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setStatusModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalCard}>
                  <TouchableOpacity
                    style={styles.modalCloseBtn}
                    onPress={() => setStatusModalVisible(false)}
                    hitSlop={12}
                    activeOpacity={0.6}
                  >
                    <Ionicons name="close" size={18} color={Palette.textSecondary} />
                  </TouchableOpacity>

                  <View style={styles.modalIconCircle}>
                    <Ionicons name="swap-horizontal" size={22} color={Palette.primary} />
                  </View>

                  <Text style={styles.modalTitle}>Alterar Status</Text>
                  <Text style={styles.modalSubtitle}>
                    Selecione a situação atual da amostra analisada:
                  </Text>

                  <View style={styles.statusOptionsList}>
                    {STATUS_OPTIONS.map((item) => {
                      const isSelected = status === item.id;

                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={[
                            styles.statusButton,
                            { backgroundColor: item.backgroundColor },
                            isSelected && styles.statusButtonSelected,
                          ]}
                          activeOpacity={0.85}
                          onPress={() => {
                            setStatus(item.id);
                            setStatusModalVisible(false);
                          }}
                        >
                          <Ionicons
                            name={item.icon}
                            size={20}
                            color={item.iconColor}
                            style={styles.statusIcon}
                          />
                          <Text
                            style={[
                              styles.statusText,
                              { color: item.textColor },
                            ]}
                          >
                            {item.label}
                          </Text>
                          {isSelected && (
                            <View style={styles.statusCheckIndicator}>
                              <Ionicons
                                name="checkmark-circle"
                                size={18}
                                color={item.textColor}
                              />
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* MODAL PERSONALIZADO DE SELEÇÃO DE TALHÃO */}
        <Modal
          visible={talhaoModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setTalhaoModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setTalhaoModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalCard}>
                  <TouchableOpacity
                    style={styles.modalCloseBtn}
                    onPress={() => setTalhaoModalVisible(false)}
                    hitSlop={12}
                    activeOpacity={0.6}
                  >
                    <Ionicons name="close" size={18} color={Palette.textSecondary} />
                  </TouchableOpacity>

                  <View style={styles.modalIconCircle}>
                    <Ionicons name="map-outline" size={22} color={Palette.primary} />
                  </View>

                  <Text style={styles.modalTitle}>Selecionar Talhão</Text>
                  <Text style={styles.modalSubtitle}>
                    Escolha o talhão da amostra analisada:
                  </Text>

                  <ScrollView
                    style={styles.modalScrollView}
                    contentContainerStyle={styles.modalScrollList}
                    showsVerticalScrollIndicator={false}
                  >
                    {talhoes.map((item) => {
                      const isSelected = selectedTalhaoId === item.id;

                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={[
                            styles.itemSelectRow,
                            isSelected && styles.itemSelectRowSelected,
                          ]}
                          activeOpacity={0.7}
                          onPress={() => {
                            setSelectedTalhaoId(item.id);
                            void loadPesForTalhao(item.id);
                            setTalhaoModalVisible(false);
                          }}
                        >
                          <View style={styles.itemSelectInfo}>
                            <Ionicons
                              name="grid-outline"
                              size={18}
                              color={isSelected ? Palette.primary : Palette.textSecondary}
                            />
                            <Text
                              style={[
                                styles.itemSelectName,
                                isSelected && styles.itemSelectNameSelected,
                              ]}
                              numberOfLines={1}
                            >
                              {item.name}
                            </Text>
                          </View>

                          <Ionicons
                            name={isSelected ? "radio-button-on" : "radio-button-off"}
                            size={18}
                            color={isSelected ? Palette.primary : Palette.borderDisabled}
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* MODAL PERSONALIZADO DE SELEÇÃO DE PÉ / ÁRVORE */}
        <Modal
          visible={peModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setPeModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setPeModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalCard}>
                  <TouchableOpacity
                    style={styles.modalCloseBtn}
                    onPress={() => setPeModalVisible(false)}
                    hitSlop={12}
                    activeOpacity={0.6}
                  >
                    <Ionicons name="close" size={18} color={Palette.textSecondary} />
                  </TouchableOpacity>

                  <View style={styles.modalIconCircle}>
                    <Ionicons name="leaf-outline" size={22} color={Palette.primary} />
                  </View>

                  <Text style={styles.modalTitle}>Selecionar Árvore (Pé)</Text>
                  <Text style={styles.modalSubtitle}>
                    Escolha a árvore que foi analisada:
                  </Text>

                  <ScrollView
                    style={styles.modalScrollView}
                    contentContainerStyle={styles.modalScrollList}
                    showsVerticalScrollIndicator={false}
                  >
                    {pes.map((item) => {
                      const isSelected = selectedPeId === item.id;

                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={[
                            styles.itemSelectRow,
                            isSelected && styles.itemSelectRowSelected,
                          ]}
                          activeOpacity={0.7}
                          onPress={() => {
                            setSelectedPeId(item.id);
                            setPeModalVisible(false);
                          }}
                        >
                          <View style={styles.itemSelectInfo}>
                            <Ionicons
                              name="leaf"
                              size={18}
                              color={isSelected ? Palette.primary : Palette.textSecondary}
                            />
                            <Text
                              style={[
                                styles.itemSelectName,
                                isSelected && styles.itemSelectNameSelected,
                              ]}
                              numberOfLines={1}
                            >
                              {item.nome}
                            </Text>
                          </View>

                          <Ionicons
                            name={isSelected ? "radio-button-on" : "radio-button-off"}
                            size={18}
                            color={isSelected ? Palette.primary : Palette.borderDisabled}
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  summaryScreenContainer: {
    flex: 1,
    backgroundColor: Palette.white,
  },

  /* TELA 1 (RESULTADO CENTRALIZADO) */
  floatingBackBtn: {
    position: "absolute",
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  resultScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  resultCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: Palette.white,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 22,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: Palette.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  resultCardTitle: {
    fontSize: 16,
    fontWeight: FontWeights.bold,
    color: "#1A2C3E",
  },
  resultCardSubtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 2,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 14,
  },
  detectedLabel: {
    fontSize: 12,
    fontWeight: FontWeights.semiBold,
    letterSpacing: 1,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 4,
  },
  deficiencyLargeTitle: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 4,
  },
  probEstimateSubtitle: {
    fontSize: 12,
    color: "#888888",
    textAlign: "center",
    marginTop: 2,
    marginBottom: 8,
  },
  gaugeWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginVertical: 8,
  },
  primaryPillButton: {
    height: 48,
    backgroundColor: Palette.primary,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  primaryPillButtonText: {
    color: Palette.white,
    fontSize: 14,
    fontWeight: FontWeights.bold,
    textAlign: "center",
    flex: 1,
  },
  outlinePillButton: {
    height: 48,
    backgroundColor: Palette.white,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: Palette.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
  },
  outlinePillButtonText: {
    color: Palette.primary,
    fontSize: 14,
    fontWeight: FontWeights.semiBold,
    textAlign: "center",
    flex: 1,
  },
  buttonIconSpacer: {
    width: 18,
  },

  /* TELA 2 (HEADER E ESPAÇAMENTOS MOBILE EXPANDIDOS) */
  summaryTopHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: Palette.white,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  summaryBackBtn: {
    padding: 6,
  },
  summaryHeaderTitle: {
    fontSize: 18,
    fontWeight: FontWeights.bold,
    color: "#1A2C3E",
  },
  summaryScrollContent: {
    paddingHorizontal: 22,
    paddingTop: 32,
    paddingBottom: 54,
  },
  blockContainer: {
    width: "100%",
  },
  sectionSeparator: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 28,
  },
  rowSpaced: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryAnalysisId: {
    fontSize: 16,
    fontWeight: FontWeights.bold,
    color: "#1A2C3E",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  dateText: {
    fontSize: 12,
    color: "#888888",
  },
  fieldLabel: {
    fontSize: 12,
    color: "#888888",
    marginBottom: 6,
  },
  resultStatusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  resultDeficiencyText: {
    fontSize: 16,
    fontWeight: FontWeights.bold,
  },
  confidenceValueText: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 6,
  },
  progressBarTrack: {
    height: 9,
    backgroundColor: "#E5E7EB",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 5,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: FontWeights.bold,
    color: "#1A2C3E",
    marginBottom: 14,
  },
  mapThumbnailContainer: {
    height: 148,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  mapView: {
    flex: 1,
  },
  mapExpandButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: Palette.white,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: Palette.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  locationControlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  chipsGroup: {
    flexDirection: "row",
    gap: 8,
    flex: 1,
  },
  selectionChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 5,
    maxWidth: 125,
  },
  selectionChipText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: FontWeights.medium,
  },
  viewFullMapLink: {
    fontSize: 12,
    color: Palette.primary,
    fontWeight: FontWeights.semiBold,
  },
  infoTableRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  infoRowTitle: {
    fontSize: 13,
    color: "#374151",
  },
  authorBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  authorImg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  authorPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  authorNameText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: FontWeights.medium,
  },

  /* PÍLULA DE STATUS DINÂMICA */
  statusPillPicker: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
    shadowColor: Palette.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: FontWeights.semiBold,
  },

  analysisIdText: {
    fontSize: 13,
    fontWeight: FontWeights.bold,
    color: "#1A2C3E",
  },
  reportTextInput: {
    height: 90,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 12,
    textAlignVertical: "top",
    fontSize: 13,
    color: Palette.textPrimary,
    backgroundColor: Palette.white,
  },
  buttonsBlock: {
    width: "100%",
    paddingTop: 6,
  },
  saveHistoryPillBtn: {
    height: 50,
    backgroundColor: Palette.primary,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 14,
  },
  saveHistoryPillText: {
    color: Palette.white,
    fontSize: 14,
    fontWeight: FontWeights.bold,
  },
  exportPdfPillBtn: {
    height: 50,
    backgroundColor: Palette.white,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: Palette.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  exportPdfPillText: {
    color: Palette.primary,
    fontSize: 14,
    fontWeight: FontWeights.bold,
  },

  /* ESTILOS DOS MODAIS CUSTOMIZADOS */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  modalCard: {
    position: "relative",
    width: "100%",
    maxWidth: 320,
    backgroundColor: Palette.white,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Palette.surfaceGray,
    shadowColor: Palette.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  modalCloseBtn: {
    position: "absolute",
    top: 14,
    right: 14,
    padding: 4,
    zIndex: 1,
  },
  modalIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${Palette.primary}18`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    textAlign: "center",
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 12,
    color: Palette.textSecondary,
    textAlign: "center",
    lineHeight: 16,
    marginBottom: 16,
  },
  statusOptionsList: {
    width: "100%",
    gap: 10,
  },
  statusButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 46,
    borderRadius: 8,
    paddingHorizontal: 16,
    position: "relative",
  },
  statusButtonSelected: {
    borderWidth: 2,
    borderColor: "#1A1A1A",
  },
  statusIcon: {
    marginRight: 8,
  },
  statusText: {
    fontSize: 15,
    fontWeight: FontWeights.bold,
  },
  statusCheckIndicator: {
    position: "absolute",
    right: 14,
  },
  modalScrollView: {
    width: "100%",
    maxHeight: 220,
  },
  modalScrollList: {
    gap: 8,
  },
  itemSelectRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  itemSelectRowSelected: {
    borderColor: Palette.primary,
    backgroundColor: `${Palette.primary}0D`,
  },
  itemSelectInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  itemSelectName: {
    fontSize: 14,
    fontWeight: FontWeights.medium,
    color: Palette.textPrimary,
    flex: 1,
  },
  itemSelectNameSelected: {
    fontWeight: FontWeights.bold,
    color: Palette.primary,
  },
});