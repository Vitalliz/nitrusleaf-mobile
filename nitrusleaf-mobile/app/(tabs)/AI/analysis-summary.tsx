import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ROUTES, exitAnalysisFlow, safeBack } from "@/utils/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";

import { GaugeChart } from "@/components/charts/gaugechart";
import { Background } from "@/components/ui/background";
import { Button } from "@/components/ui/button";
import { DEFAULT_AVATAR } from "@/constants/profile";
import { useAuth } from "@/contexts/AuthContext";
import { getUsuarioDetails } from "@/repositories/profileRepository";
import { getPropertiesByUser } from "@/repositories/propertyRepository";
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

export default function AnalysisSummaryScreen() {
  const router = useRouter();
  const { user } = useAuth();
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

  const accentColor = getDeficiencyAccentColor(deficiencyType);
  const explanation = useMemo(
    () => getDeficiencyExplanation(deficiencyType),
    [deficiencyType]
  );

  const selectedTalhao = talhoes.find((t) => t.id === selectedTalhaoId);
  const selectedPe = pes.find((p) => p.id === selectedPeId);

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

        const props = await getPropertiesByUser(user.id);
        if (props?.length) {
          const list = await getTalhoesByProperty(props[0].id);
          setTalhoes(list);
          if (list.length === 1) {
            setSelectedTalhaoId(list[0].id);
            const peList = await getPesByTalhao(list[0].id);
            setPes(peList);
            if (peList.length === 1) setSelectedPeId(peList[0].id);
          }
        }
      } catch (e) {
        console.error("Erro ao carregar contexto da análise:", e);
      } finally {
        setLoadingContext(false);
      }
    }
    void loadContext();
  }, [user?.id, user?.name]);

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

  const pickTalhao = () => {
    if (talhoes.length === 0) {
      Alert.alert(
        "Sem talhões",
        "Cadastre um talhão em Histórico para vincular esta análise."
      );
      return;
    }
    Alert.alert(
      "Selecionar talhão",
      "Escolha o talhão da amostra analisada",
      [
        ...talhoes.map((t) => ({
          text: t.name,
          onPress: () => {
            setSelectedTalhaoId(t.id);
            void loadPesForTalhao(t.id);
          },
        })),
        { text: "Cancelar", style: "cancel" },
      ]
    );
  };

  const pickPe = () => {
    if (!selectedTalhaoId) {
      Alert.alert("Talhão", "Selecione o talhão antes do pé.");
      return;
    }
    if (pes.length === 0) {
      Alert.alert(
        "Sem pés",
        "Cadastre um pé neste talhão para salvar a análise no histórico."
      );
      return;
    }
    Alert.alert(
      "Selecionar pé",
      "Escolha o pé (árvore) analisado",
      [
        ...pes.map((p) => ({
          text: p.nome,
          onPress: () => setSelectedPeId(p.id),
        })),
        { text: "Cancelar", style: "cancel" },
      ]
    );
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
      await persistAnalysisResult({
        peId: selectedPeId,
        imageUri,
        deficiencyType,
        probability,
      });
      setSavedToDb(true);
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

  const gaugeType: DeficiencyType =
    deficiencyType === "Indefinido" ? "Saudável" : deficiencyType;

  if (view === "result") {
    return (
      <Background>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="dark-content" backgroundColor="#FAF1E5" />

          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
              <View style={styles.backCircle}>
                <Ionicons name="chevron-back" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Resultado da análise</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.card, { borderTopColor: accentColor }]}>
              <Text style={styles.analysisId}>Análise #{analysisId}</Text>
              <View style={styles.divider} />

              <View style={styles.gaugeContainer}>
                <GaugeChart
                  percentage={probability}
                  size={260}
                  showPercentage
                  deficiencyType={gaugeType}
                />
              </View>

              <Text style={styles.probabilityLabel}>
                Probabilidade estimada
              </Text>
              <Text style={[styles.deficiencyTitle, { color: accentColor }]}>
                {getDeficiencyTitle(deficiencyType)}
              </Text>

              <Button
                title="Ver resumo técnico"
                variant="primary"
                size="full"
                onPress={() => setView("summary")}
              />
            </View>

            <Text style={styles.note}>{explanation.footer}</Text>
            <TouchableOpacity
              style={styles.infoCard}
              onPress={handleInfoPress}
              activeOpacity={0.85}
            >
              <View style={styles.infoContent}>
                <Ionicons
                  name="information-circle-outline"
                  size={22}
                  color="#FFF"
                  style={{ marginBottom: 6 }}
                />
                <Text style={styles.infoTitle}>O que significa?</Text>
                <Text style={styles.infoSubtitle}>
                  Toque para ver explicação e recomendações
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Background>
    );
  }

  return (
    <Background>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAF1E5" />

        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <View style={styles.backCircle}>
              <Ionicons name="chevron-back" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Resumo da Análise</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.card, { borderTopColor: accentColor }]}>
            <View style={styles.rowSpaced}>
              <Text style={styles.analysisId}>Análise #{analysisId}</Text>
              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={13} color="#888" />
                <Text style={styles.dateText}>
                  {new Date().toLocaleDateString("pt-BR")}
                </Text>
              </View>
            </View>
            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Resultado:</Text>
              <View style={[styles.badge, { backgroundColor: accentColor }]}>
                <Text style={styles.badgeText}>
                  {deficiencyType === "Indefinido"
                    ? "Nada identificado"
                    : deficiencyType}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Probabilidade da IA:</Text>
              <Text
                style={[styles.infoValue, { color: accentColor, fontWeight: "700" }]}
              >
                {probability}%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${probability}%`, backgroundColor: accentColor },
                ]}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Autor da análise:</Text>
              <View style={styles.authorRow}>
                <Image
                  source={{ uri: authorAvatar || DEFAULT_AVATAR }}
                  style={styles.authorAvatar}
                />
                <Text style={styles.infoValue}>
                  {loadingContext ? "Carregando..." : authorName}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Localização da amostra</Text>
            <Text style={styles.hint}>
              Toque para identificar talhão e pé — os dados alimentam os gráficos
              da home.
            </Text>

            <TouchableOpacity
              style={styles.selectRow}
              onPress={pickTalhao}
              disabled={loadingContext}
            >
              <Ionicons name="map-outline" size={18} color="#6BC24A" />
              <View style={styles.selectTexts}>
                <Text style={styles.selectLabel}>Talhão</Text>
                <Text style={styles.selectValue}>
                  {selectedTalhao?.name || "Selecionar talhão"}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={18} color="#888" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.selectRow}
              onPress={pickPe}
              disabled={loadingContext || !selectedTalhaoId}
            >
              <Ionicons name="leaf-outline" size={18} color="#6BC24A" />
              <View style={styles.selectTexts}>
                <Text style={styles.selectLabel}>Pé analisado</Text>
                <Text style={styles.selectValue}>
                  {selectedPe?.nome || "Selecionar pé"}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={18} color="#888" />
            </TouchableOpacity>

            {savedToDb && (
              <View style={styles.savedBanner}>
                <Ionicons name="checkmark-circle" size={18} color="#2D5016" />
                <Text style={styles.savedText}>
                  Análise salva no banco de dados
                </Text>
              </View>
            )}
          </View>

          <Button
            title={
              saving
                ? "Salvando..."
                : savedToDb
                  ? "Concluir e voltar ao início"
                  : "Salvar e voltar ao início"
            }
            variant="primary"
            size="full"
            onPress={() => void handleFinish()}
          />
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
    backgroundColor: "#FAF1E5",
  },
  backBtn: { width: 40 },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: "#6BC24A",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1A2C3E" },
  container: {
    padding: 16,
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    borderTopWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  analysisId: {
    fontSize: 16,
    fontWeight: "700",
    color: "#98979F",
    marginBottom: 12,
  },
  divider: {
    height: 0.9,
    backgroundColor: "#98979F",
    marginVertical: 14,
    borderRadius: 5,
  },
  gaugeContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 8,
  },
  probabilityLabel: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 6,
  },
  deficiencyTitle: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 24,
  },
  infoCard: { backgroundColor: "#6BC24A", borderRadius: 12, padding: 18 },
  infoContent: { alignItems: "center", justifyContent: "center" },
  infoTitle: { fontSize: 17, fontWeight: "700", color: "#FFF", marginBottom: 2 },
  infoSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.85)" },
  note: { fontSize: 12, color: "#888", textAlign: "center", paddingHorizontal: 8 },
  rowSpaced: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  dateText: { fontSize: 14, color: "#888" },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 8 },
  infoLabel: { fontSize: 16, color: "#666", flex: 1 },
  infoValue: { fontSize: 16, color: "#1A2C3E" },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 14, fontWeight: "700", color: "#FFF" },
  progressBar: {
    height: 14,
    backgroundColor: "#F0F0F0",
    borderRadius: 3,
    marginBottom: 6,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 3 },
  authorRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  authorAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A2C3E",
    marginBottom: 6,
  },
  hint: { fontSize: 12, color: "#888", marginBottom: 12, lineHeight: 17 },
  selectRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  selectTexts: { flex: 1 },
  selectLabel: { fontSize: 12, color: "#888" },
  selectValue: { fontSize: 15, fontWeight: "600", color: "#1A2C3E" },
  savedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#E8F5E0",
    padding: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  savedText: { fontSize: 13, color: "#2D5016", fontWeight: "600" },
});
