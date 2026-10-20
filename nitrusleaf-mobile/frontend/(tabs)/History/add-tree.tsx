import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ROUTES, safeBack } from "@/utils/navigation";
import BottomNavbar from "@/components/ui/tab-bar";
import { Background } from "@/components/ui/background";
import { Ionicons } from "@expo/vector-icons";
import { createPe } from "@/repositories/peRepository";
import { syncTalhaoStatsFromPes } from "@/services/syncTalhaoStats";
import { getTalhaoById } from "@/repositories/talhaoRepository";
import { SITUACOES_PE, type SituacaoPe } from "@/types/pe";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CustomAlert, AlertType } from "@/components/ui/alert";
import { Palette, FontSizes, FontWeights } from "@/constants/theme";

const situacaoColors: Record<SituacaoPe, { bg: string; border: string; text: string }> = {
  "Tratado":         { bg: "#E8F5E0", border: Palette.primary, text: "#2D5016" },
  "Não-Tratado":     { bg: "#FFEBEE", border: "#E57373", text: Palette.error },
  "Sem-informações": { bg: Palette.surfaceGray, border: Palette.borderDisabled, text: Palette.textSecondary },
};

export default function AddFootScreen() {
  const router = useRouter();
  const { talhaoId, talhaoName } = useLocalSearchParams<{
    talhaoId?: string;
    talhaoName?: string;
  }>();

  const [nome, setNome] = useState("");
  const [situacao, setSituacao] = useState<SituacaoPe>("Sem-informações");
  const [observacoes, setObservacoes] = useState("");
  const [talhaoLabel, setTalhaoLabel] = useState(talhaoName ?? "");
  const [loading, setLoading] = useState(false);

  // Estado unificado do CustomAlert (Sucesso, Aviso e Erro)
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
    if (!talhaoId || talhaoName) return;
    void getTalhaoById(talhaoId).then((t) => {
      if (t?.name) setTalhaoLabel(t.name);
    });
  }, [talhaoId, talhaoName]);

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
        observacoes: observacoes.trim() || undefined,
      });

      try {
        await syncTalhaoStatsFromPes(talhaoId);
      } catch (syncErr) {
        console.warn("Sync talhão (opcional):", syncErr);
      }

      // Alerta de sucesso com redirecionamento ao clicar no botão
      showAlert(
        "Sucesso!",
        "Árvore cadastrada com sucesso.",
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
        <Text style={styles.sectionTitle}>Nova árvore</Text>

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

      {/* Componente Modal CustomAlert integrado para Sucesso, Avisos e Erros */}
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
    marginBottom: 14,
    marginTop: 4,
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
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
    marginBottom: 4,
  },
  situacaoChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Palette.borderDisabled,
    backgroundColor: Palette.white,
  },
  situacaoChipText: {
    fontSize: FontSizes.sm,
    color: Palette.textPrimary,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
  },
  errorBox: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  errorText: {
    fontSize: FontSizes.base,
    color: Palette.textPrimary,
    textAlign: "center",
    marginBottom: 24,
  },
});