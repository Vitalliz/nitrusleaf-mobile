import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
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

const situacaoColors: Record<SituacaoPe, { bg: string; border: string; text: string }> = {
  "Tratado":         { bg: "#E8F5E0", border: "#6BC24A", text: "#2D5016" },
  "Não-Tratado":     { bg: "#FFEBEE", border: "#E57373", text: "#B71C1C" },
  "Sem-informações": { bg: "#F5F5F5", border: "#BDBDBD", text: "#616161" },
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

  useEffect(() => {
    if (!talhaoId || talhaoName) return;
    void getTalhaoById(talhaoId).then((t) => {
      if (t?.name) setTalhaoLabel(t.name);
    });
  }, [talhaoId, talhaoName]);

  const handleSave = async () => {
    if (!talhaoId) {
      Alert.alert("Erro", "Talhão não informado. Volte e tente novamente.");
      return;
    }
    if (!nome.trim()) {
      Alert.alert("Erro", "Nome da Árvore é obrigatório.");
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
      await syncTalhaoStatsFromPes(talhaoId);

      Alert.alert("Sucesso", "Árvore cadastrada com sucesso!", [
        {
          text: "OK",
          onPress: () =>
            router.replace({
              pathname: "/(tabs)/History/field-detail-screen",
              params: { talhaoId },
            }),
        },
      ]);
    } catch (error) {
      console.error("Erro ao salvar árvore:", error);
      const msg =
        error instanceof Error ? error.message : "Não foi possível salvar a árvore.";
      Alert.alert("Erro", msg);
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
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
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
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cadastrar árvore</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>

          <Text style={styles.sectionTitle}>Nova árvore</Text>

          {/* TALHÃO */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Talhão</Text>
            <View style={styles.propertyBadge}>
              <Ionicons name="leaf-outline" size={14} color="#6BC24A" />
              <Text style={styles.propertyText}>{talhaoLabel || "—"}</Text>
            </View>
          </View>

          {/* NOME */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nome da árvore *</Text>
            <Input
              value={nome}
              onChangeText={setNome}
              placeholder="Ex: Árvore 12"
              size="full"
            />
          </View>

          {/* SITUAÇÃO */}
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
                        active && { color: colors.text, fontWeight: "600" },
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* OBSERVAÇÕES */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Observações</Text>
            <Input
              value={observacoes}
              onChangeText={setObservacoes}
              placeholder="Opcional"
              size="size-364"
            />
          </View>

          <Button
            title={loading ? "Salvando..." : "Salvar árvore"}
            variant="primary"
            size="full"
            onPress={() => void handleSave()}
            disabled={loading}
          />

        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

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
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },

  backBtn: {
    padding: 4,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },

  content: {
    flex: 1,
    padding: 20,
  },

  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A2C3E",
    marginBottom: 12,
    marginTop: 4,
  },

  formGroup: {
    marginBottom: 5,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 2,
  },

  propertyBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    marginVertical: 12,
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1F2D0",
  },

  propertyText: {
    fontSize: 14,
    color: "#6BC24A",
    fontWeight: "600",
  },

  situacaoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
    marginBottom: 8,
  },

  situacaoChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D4D4D4",
    backgroundColor: "#FFFFFF",
  },

  situacaoChipText: {
    fontSize: 13,
    color: "#374151",
  },

  errorBox: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },

  errorText: {
    fontSize: 15,
    color: "#374151",
    textAlign: "center",
    marginBottom: 24,
  },
});