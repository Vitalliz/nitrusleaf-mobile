import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

import { ROUTES, safeBack } from "@/utils/navigation";
import BottomNavbar from "@/components/ui/tab-bar";
import { Background } from "@/components/ui/background";
import { createPe } from "@/repositories/peRepository";
import { syncTalhaoStatsFromPes } from "@/services/syncTalhaoStats";
import { getTalhaoById } from "@/repositories/talhaoRepository";
import { SITUACOES_PE, type SituacaoPe } from "@/types/pe";
import type { Talhao } from "@/types/talhao";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CustomAlert, AlertType } from "@/components/ui/alert";
import { Palette, FontSizes, FontWeights } from "@/constants/theme";

const situacaoColors: Record<SituacaoPe, { bg: string; border: string; text: string }> = {
  "Tratado":         { bg: "#E8F5E0", border: Palette.primary, text: "#2D5016" },
  "Não-Tratado":     { bg: "#FFEBEE", border: "#E57373", text: Palette.error },
  "Sem-informações": { bg: Palette.surfaceGray, border: Palette.borderDisabled, text: Palette.textSecondary },
};

function parsePolygonCoords(raw?: string): { latitude: number; longitude: number }[] {
  if (!raw) return [];
  return raw
    .split(";")
    .map((pair) => {
      const parts = pair.split(",").map(Number);
      if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return null;
      return { latitude: parts[0], longitude: parts[1] };
    })
    .filter(Boolean) as { latitude: number; longitude: number }[];
}

export default function AddTreeScreen() {
  const router = useRouter();
  const { talhaoId, talhaoName } = useLocalSearchParams<{
    talhaoId?: string;
    talhaoName?: string;
  }>();

  const [nome, setNome] = useState("");
  const [situacao, setSituacao] = useState<SituacaoPe>("Sem-informações");
  const [observacoes, setObservacoes] = useState("");
  const [talhaoLabel, setTalhaoLabel] = useState(talhaoName ?? "");
  const [talhaoData, setTalhaoData] = useState<Talhao | null>(null);

  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [tempLocation, setTempLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: AlertType;
    buttonText: string;
    onCloseAction?: () => void;
  }>({
    visible: false,
    title: "",
    message: "",
    type: "error",
    buttonText: "Entendido",
  });

  const showAlert = (
    title: string,
    message: string,
    type: AlertType = "error",
    buttonText: string = "Entendido",
    onCloseAction?: () => void
  ) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      type,
      buttonText,
      onCloseAction,
    });
  };

  const handleCloseAlert = () => {
    const callback = alertConfig.onCloseAction;
    setAlertConfig((prev) => ({ ...prev, visible: false, onCloseAction: undefined }));
    if (callback) {
      callback();
    }
  };

  useEffect(() => {
    if (!talhaoId) return;
    void getTalhaoById(talhaoId).then((t) => {
      if (t) {
        setTalhaoData(t);
        if (t.name) setTalhaoLabel(t.name);
      }
    });
  }, [talhaoId]);

  const talhaoPolygon = parsePolygonCoords(talhaoData?.coordenadasPoligono);

  const defaultCenter = () => {
    if (latitude && longitude) {
      return { latitude, longitude };
    }
    if (talhaoPolygon.length > 0) {
      return talhaoPolygon[0];
    }
    if (talhaoData?.latitude && talhaoData?.longitude) {
      return { latitude: talhaoData.latitude, longitude: talhaoData.longitude };
    }
    return { latitude: -24.68964, longitude: -47.85112 };
  };

  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    if (coordinate?.latitude && coordinate?.longitude) {
      setTempLocation(coordinate);
    }
  };

  const handleConfirmLocation = () => {
    if (tempLocation) {
      setLatitude(tempLocation.latitude);
      setLongitude(tempLocation.longitude);
    }
    setShowMapModal(false);
  };

  const handleOpenMap = () => {
    if (latitude && longitude) {
      setTempLocation({ latitude, longitude });
    } else {
      setTempLocation(defaultCenter());
    }
    setShowMapModal(true);
  };

  const handleSave = async () => {
    if (!talhaoId) {
      showAlert("Atenção", "Talhão não informado. Volte e tente novamente.", "warning");
      return;
    }
    if (!nome.trim()) {
      showAlert("Atenção", "O nome da árvore é obrigatório.", "warning");
      return;
    }

    setLoading(true);
    try {
      await createPe({
        talhaoId,
        nome: nome.trim(),
        situacao,
        deficienciaManganes: situacao === "Não-Tratado",
        observacoes: observacoes.trim() || undefined,
        latitude,
        longitude,
      });

      try {
        await syncTalhaoStatsFromPes(talhaoId);
      } catch (syncErr) {
        console.warn("Sync talhão (opcional):", syncErr);
      }

      showAlert(
        "Sucesso!",
        "Árvore cadastrada com sucesso com sua localização.",
        "success",
        "Continuar",
        () => {
          router.replace({
            pathname: "/(tabs)/History/field-detail-screen",
            params: { talhaoId },
          });
        }
      );
    } catch (error) {
      console.error("Erro ao salvar árvore:", error);
      const msg =
        error instanceof Error ? error.message : "Não foi possível salvar a árvore.";
      showAlert("Falha no cadastro", msg, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!talhaoId) {
    return (
      <Background>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => safeBack(router, ROUTES.history)}
            hitSlop={15}
          >
            <Ionicons name="arrow-back" size={24} color={Palette.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cadastrar árvore</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            Talhão não encontrado. Abra a lista de árvores a partir de um talhão.
          </Text>
          <Button
            title="Voltar"
            variant="primary"
            size="full"
            onPress={() => safeBack(router, ROUTES.history)}
          />
        </View>
        <BottomNavbar />
      </Background>
    );
  }

  return (
    <Background>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() =>
            safeBack(router, {
              pathname: "/(tabs)/History/field-detail-screen",
              params: { talhaoId },
            })
          }
          hitSlop={15}
        >
          <Ionicons name="arrow-back" size={24} color={Palette.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cadastrar árvore</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Identificação</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Talhão</Text>
          <View style={styles.propertyBadge}>
            <Ionicons name="leaf-outline" size={14} color={Palette.primary} />
            <Text style={styles.propertyText}>{talhaoLabel || "—"}</Text>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome da árvore *</Text>
          <Input
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Árvore 12"
            size="full"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Situação</Text>
          <View style={styles.situacaoRow}>
            {SITUACOES_PE.map((opt) => {
              const active = situacao === opt;
              const colors = situacaoColors[opt];
              return (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.situacaoChip,
                    active && {
                      backgroundColor: colors.bg,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => setSituacao(opt)}
                >
                  <Text
                    style={[
                      styles.situacaoChipText,
                      active && { color: colors.text, fontWeight: FontWeights.semiBold },
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Localização da Árvore no Mapa</Text>
        <TouchableOpacity
          style={styles.mapBannerBtn}
          onPress={handleOpenMap}
          activeOpacity={0.85}
        >
          <View style={styles.mapBannerIconBox}>
            <Ionicons name="location" size={24} color={Palette.primary} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.mapBannerTitle}>
              {latitude !== undefined && longitude !== undefined
                ? "Posição da Árvore Marcada"
                : "Marcar Posição da Árvore no Mapa"}
            </Text>
            <Text style={styles.mapBannerSubtitle}>
              {latitude !== undefined && longitude !== undefined
                ? `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`
                : "Toque para abrir o mapa do talhão e posicionar o pé"}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Palette.textSecondary} />
        </TouchableOpacity>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Observações</Text>
          <Input
            value={observacoes}
            onChangeText={setObservacoes}
            placeholder="Opcional"
            size="full"
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={loading ? "Salvando..." : "Salvar árvore"}
            variant="primary"
            size="full"
            onPress={() => void handleSave()}
            disabled={loading}
          />
        </View>
      </ScrollView>

      <Modal
        visible={showMapModal}
        animationType="slide"
        onRequestClose={() => setShowMapModal(false)}
      >
        <SafeAreaView style={styles.modalContainer} edges={['top', 'left', 'right', 'bottom']}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowMapModal(false)}
              style={styles.modalCloseBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color={Palette.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Localizar Árvore</Text>
            <TouchableOpacity
              onPress={handleConfirmLocation}
              style={styles.modalConfirmBtn}
              activeOpacity={0.85}
            >
              <Text style={styles.modalConfirmText}>Confirmar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalInstructionBanner}>
            <Ionicons name="information-circle-outline" size={18} color="#16A34A" />
            <Text style={styles.modalInstructionText}>
              Toque no mapa para posicionar a árvore dentro da área demarcada do talhão.
            </Text>
          </View>

          <MapView
            style={styles.map}
            mapType="satellite"
            initialRegion={{
              ...defaultCenter(),
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            onPress={handleMapPress}
            provider={PROVIDER_GOOGLE}
          >
            {talhaoPolygon.length >= 3 && (
              <Polygon
                coordinates={talhaoPolygon}
                strokeColor="#0EA5E9"
                strokeWidth={2.5}
                fillColor="rgba(14, 165, 233, 0.22)"
              />
            )}

            {tempLocation && (
              <Marker
                coordinate={tempLocation}
                anchor={{ x: 0.5, y: 1.0 }}
                title="Posição da Árvore"
              >
                <View style={styles.pinWrapper}>
                  <View style={styles.treePinDrop}>
                    <Ionicons name="leaf" size={14} color="#FFFFFF" />
                  </View>
                  <View style={styles.treePinTail} />
                </View>
              </Marker>
            )}
          </MapView>

          <View style={styles.mapFooter}>
            <Text style={styles.mapFooterText}>
              {tempLocation
                ? `Local selecionado: ${tempLocation.latitude.toFixed(6)}, ${tempLocation.longitude.toFixed(6)}`
                : "Toque no mapa para posicionar a árvore"}
            </Text>
          </View>
        </SafeAreaView>
      </Modal>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        buttonText={alertConfig.buttonText}
        onClose={handleCloseAlert}
      />

      <BottomNavbar />
    </Background>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 35,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: Palette.white,
    borderBottomWidth: 1,
    borderBottomColor: Palette.surfaceGray,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 80,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    marginBottom: 12,
    marginTop: 10,
  },
  formGroup: {
    width: "100%",
    marginBottom: 14,
  },
  label: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semiBold,
    color: Palette.textPrimary,
    marginBottom: 6,
  },
  propertyBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    marginVertical: 4,
    backgroundColor: `${Palette.primary}15`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${Palette.primary}35`,
  },
  propertyText: {
    fontSize: FontSizes.base,
    color: Palette.primary,
    fontWeight: FontWeights.semiBold,
  },
  situacaoRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  situacaoChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Palette.borderDisabled,
    backgroundColor: Palette.white,
  },
  situacaoChipText: {
    fontSize: FontSizes.sm,
    color: Palette.textSecondary,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
  },
  errorBox: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: FontSizes.base,
    color: Palette.textSecondary,
    textAlign: "center",
    marginBottom: 20,
  },

  mapBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  mapBannerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  mapBannerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: Palette.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Palette.surfaceGray,
    backgroundColor: Palette.white,
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
  },
  modalConfirmBtn: {
    backgroundColor: Palette.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modalConfirmText: {
    color: Palette.white,
    fontSize: 12,
    fontWeight: FontWeights.bold,
  },
  modalInstructionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#BBF7D0',
  },
  modalInstructionText: {
    flex: 1,
    fontSize: 12,
    color: '#166534',
    lineHeight: 16,
  },
  map: {
    flex: 1,
  },
  pinWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  treePinDrop: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  treePinTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Palette.primary,
    marginTop: -1,
  },
  mapFooter: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    alignItems: 'center',
  },
  mapFooterText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
});