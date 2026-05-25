import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ROUTES, safeBack } from "@/utils/navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomNavbar from "@/components/ui/tab-bar";
import { Background } from "@/components/ui/background";
import { Ionicons } from "@expo/vector-icons";
import { createPe } from "@/repositories/peRepository";
import { syncTalhaoStatsFromPes } from "@/services/syncTalhaoStats";
import { getTalhaoById } from "@/repositories/talhaoRepository";
import { SITUACOES_PE, type SituacaoPe } from "@/types/pe";

export default function AddFootScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
      Alert.alert("Erro", "Nome do pé é obrigatório.");
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

      Alert.alert("Sucesso", "Pé cadastrado com sucesso!", [
        {
          text: "OK",
          onPress: () =>
            router.replace({
              pathname: "/(tabs)/History/field-feet",
              params: { talhaoId },
            }),
        },
      ]);
    } catch (error) {
      console.error("Erro ao salvar pé:", error);
      const msg =
        error instanceof Error ? error.message : "Não foi possível salvar o pé.";
      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
    }
  };

  if (!talhaoId) {
    return (
      <Background>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => safeBack(router, ROUTES.history)}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cadastrar pé</Text>
          <View style={{ width: 32 }} />
        </View>
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            Talhão não encontrado. Abra a lista de pés a partir de um talhão.
          </Text>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => safeBack(router, ROUTES.history)}
          >
            <Text style={styles.saveText}>Voltar</Text>
          </TouchableOpacity>
        </View>
        <BottomNavbar />
      </Background>
    );
  }

  return (
    <Background>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            safeBack(router, {
              pathname: "/(tabs)/History/field-feet",
              params: { talhaoId },
            })
          }
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cadastrar pé</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionTitle}>Novo pé</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Talhão</Text>
          <TextInput
            value={talhaoLabel || "—"}
            editable={false}
            style={styles.inputDisabled}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome do pé *</Text>
          <TextInput
            value={nome}
            onChangeText={setNome}
            style={styles.input}
            placeholder="Ex: Pé 12"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Situação</Text>
          <View style={styles.situacaoRow}>
            {SITUACOES_PE.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.situacaoChip,
                  situacao === opt && styles.situacaoChipActive,
                ]}
                onPress={() => setSituacao(opt)}
              >
                <Text
                  style={[
                    styles.situacaoChipText,
                    situacao === opt && styles.situacaoChipTextActive,
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Observações</Text>
          <TextInput
            value={observacoes}
            onChangeText={setObservacoes}
            style={[styles.input, styles.textArea]}
            placeholder="Opcional"
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
          onPress={() => void handleSave()}
          disabled={loading}
        >
          <Text style={styles.saveText}>
            {loading ? "Salvando..." : "Salvar pé"}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
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
    paddingHorizontal: 20,
    paddingBottom: 18,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#6BC24A",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    color: "#1A1A1A",
    backgroundColor: "#FFFFFF",
    fontSize: 16,
  },
  inputDisabled: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    color: "#6B7280",
    backgroundColor: "#F9FAFB",
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  situacaoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  situacaoChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D4D4D4",
    backgroundColor: "#FFFFFF",
  },
  situacaoChipActive: {
    borderColor: "#6BC24A",
    backgroundColor: "#E8F5E0",
  },
  situacaoChipText: {
    fontSize: 13,
    color: "#374151",
  },
  situacaoChipTextActive: {
    color: "#2D5016",
    fontWeight: "600",
  },
  saveBtn: {
    backgroundColor: "#6BC24A",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  saveBtnDisabled: {
    backgroundColor: "#9CA3AF",
  },
  saveText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
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
