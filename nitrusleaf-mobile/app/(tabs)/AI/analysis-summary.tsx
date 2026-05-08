// app/analysis/ResultScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { GaugeChart } from "@/components/charts/gaugechart";
import { Background } from "@/components/ui/background";
import { Button } from "@/components/ui/button";

// ─── Tipagem ──────────────────────────────────────────────────────────────────
interface ResultParams {
  analysisId?: string;
  probability?: number;
  deficiencyType?: "Cobre" | "Manganês";
  date?: string;
  author?: string;
  talhao?: string;
  tree?: string;
}

// ─── Tela 1: Resultado ────────────────────────────────────────────────────────
function ResultView({
  analysisId,
  deficiencyType,
  probability,
  onVerResumo,
  onInfoPress,
}: {
  analysisId: string;
  deficiencyType: "Cobre" | "Manganês";
  probability: number;
  onVerResumo: () => void;
  onInfoPress: () => void;
}) {
  const accentColor = deficiencyType === "Cobre" ? "#E65723" : "#FBBF24";

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Card principal */}
      <View>
        <View style={[styles.card, { borderTopColor: accentColor }]}>
          <Text style={styles.analysisId}>Análise #{analysisId}</Text>
          <View style={styles.divider} />

          <View style={styles.gaugeContainer}>
            <GaugeChart
              percentage={probability}
              size={200}
              label=""
            />
          </View>

          <Text style={styles.probabilityLabel}>Probabilidade estimada</Text>
          <Text style={[styles.deficiencyTitle, { color: accentColor }]}>
            Deficiência de {deficiencyType}
          </Text>

          <Button title="Ver resumo técnico" variant="primary" size="full" onPress={onVerResumo} />
        </View>
        <Text style={styles.note}>
          Esta análise foi baseada na imagem enviada. Consulte um agrônomo para recomendações específicas.
        </Text>
      </View>
      

      
      {/* Card verde */}
      <TouchableOpacity style={styles.infoCard} onPress={onInfoPress} activeOpacity={0.85}>
        <View style={styles.infoContent}>
          <View>
            <Text style={styles.infoTitle}>O que significa?</Text>
            <Text style={styles.infoSubtitle}>Clique para saber mais</Text>
          </View>
        </View>
      </TouchableOpacity>
      
    </ScrollView>
  );
}

// ─── Tela 2: Resumo Técnico ───────────────────────────────────────────────────
function SummaryView({
  analysisId,
  deficiencyType,
  probability,
  date,
  author,
  talhao,
  tree,
}: {
  analysisId: string;
  deficiencyType: "Cobre" | "Manganês";
  probability: number;
  date: string;
  author: string;
  talhao: string;
  tree: string;
}) {
  const accentColor = deficiencyType === "Cobre" ? "#E65723" : "#FBBF24";
  const navigation = useNavigation();

  const [reportText, setReportText] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [showStatusOptions, setShowStatusOptions] = useState(false);

  const statusOptions = [
    { label: "Em tratamento", value: "treatment", color: "#FBBF24", bgColor: "#FEFCE8" },
    { label: "Concluído",     value: "completed",  color: "#58B741", bgColor: "#F0FDF4" },
    { label: "Pendente",      value: "pending",    color: "#9CA3AF", bgColor: "#F3F4F6" },
  ];
  const currentStatus = statusOptions.find((o) => o.value === status);

  const handleSave = useCallback(() => {
    if (!reportText.trim()) {
      Alert.alert("Aviso", "Adicione suas observações antes de salvar.");
      return;
    }
    Alert.alert("Sucesso!", "Análise salva no histórico.", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  }, [reportText, navigation]);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={[styles.card, { borderTopColor: accentColor }]}>
        {/* ID + Data */}
        <View style={styles.rowSpaced}>
          <Text style={styles.analysisId}>Análise #{analysisId}</Text>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={13} color="#888" />
            <Text style={styles.dateText}>{date}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        {/* Deficiência */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Deficiência detectada:</Text>
          <View style={[styles.badge, { backgroundColor: accentColor }]}>
            <Text style={styles.badgeText}>{deficiencyType}</Text>
          </View>
        </View>

        {/* Probabilidade */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Probabilidade estimada da IA:</Text>
          <Text style={[styles.infoValue, { color: accentColor, fontWeight: "700" }]}>
            {probability}%
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${probability}%` as any, backgroundColor: accentColor }]} />
        </View>

        <View style={styles.divider} />

        {/* Autor */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Autor da análise:</Text>
          <View style={styles.authorRow}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={12} color="#fff" />
            </View>
            <Text style={styles.infoValue}>{author}</Text>
          </View>
        </View>

        {/* Status */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status:</Text>
          {status === null ? (
            <TouchableOpacity onPress={() => setShowStatusOptions(!showStatusOptions)}>
              <Text style={styles.addStatus}>+ Adicionar status</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.statusRow} onPress={() => setShowStatusOptions(!showStatusOptions)}>
              <View style={[styles.statusBadge, { backgroundColor: currentStatus?.bgColor }]}>
                <Text style={[styles.statusText, { color: currentStatus?.color }]}>
                  {currentStatus?.label}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={14} color="#888" />
            </TouchableOpacity>
          )}
        </View>
        {showStatusOptions && (
          <View style={styles.statusDropdown}>
            {statusOptions.map((o) => (
              <TouchableOpacity
                key={o.value}
                style={[styles.statusOption, { backgroundColor: o.bgColor }]}
                onPress={() => { setStatus(o.value); setShowStatusOptions(false); }}
              >
                <Text style={[styles.statusText, { color: o.color }]}>{o.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.divider} />

        {/* Localização */}
        <Text style={styles.sectionTitle}>Localização da amostra</Text>
        <View style={styles.locationRow}>
          <View style={styles.locationChip}>
            <Ionicons name="lock-closed-outline" size={12} color="#555" />
            <Text style={styles.locationChipText}>{talhao}</Text>
          </View>
          <View style={styles.locationChip}>
            <Ionicons name="lock-closed-outline" size={12} color="#555" />
            <Text style={styles.locationChipText}>{tree}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.linkRow}>
          <Ionicons name="pencil-outline" size={13} color="#6BC24A" />
          <Text style={styles.linkText}>Alterar localização</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Relatório */}
        <Text style={styles.sectionTitle}>Escrever Relatório</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Adicione suas observações..."
          placeholderTextColor="#AAA"
          multiline
          value={reportText}
          onChangeText={setReportText}
        />
        <View style={styles.reportActions}>
          <TouchableOpacity style={styles.linkRow}>
            <Ionicons name="pencil-outline" size={13} color="#6BC24A" />
            <Text style={styles.linkText}>Editar relatório</Text>
          </TouchableOpacity>
        </View>

        {/* BOTÕES */}
        <View style={{ gap: 12, marginTop: 10 }}>
          <Button 
            title="Exportar como PDF" 
            variant="outline" 
            size="full" 
            icon="share-outline"
            onPress={() => console.log("Exportar")} 
          />
          
          <Button 
            title="Salvar no histórico" 
            variant="primary" 
            size="full" 
            icon="save-outline"
            onPress={handleSave} 
          />
        </View>
      </View>
    </ScrollView>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function ResultScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const params = (route.params as ResultParams) ?? {};

  const analysisId     = params.analysisId    ?? "006";
  const probability    = params.probability   ?? 92;
  const deficiencyType = params.deficiencyType ?? "Cobre";
  const date           = params.date          ?? "23 de Março de 2026";
  const author         = params.author        ?? "Roberto Almeida";
  const talhao         = params.talhao        ?? "Talhão 3";
  const tree           = params.tree          ?? "Árvore 6";

  const [view, setView] = useState<"result" | "summary">("result");

  return (
    <Background>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAF1E5" />

        {/* Header */}
        <View style={styles.header}>
          {view === "summary" ? (
            <TouchableOpacity style={styles.backBtn} onPress={() => setView("result")}>
              <View style={styles.backCircle}>
                <Ionicons name="chevron-back" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.backBtn} />
          )}
 
          <Text style={styles.headerTitle}>
            {view === "result" ? "Resultado da análise" : "Resumo da Análise"}
          </Text>
        </View>

        {view === "result" ? (
          <ResultView
            analysisId={analysisId}
            deficiencyType={deficiencyType}
            probability={probability}
            onVerResumo={() => setView("summary")}
            onInfoPress={() => console.log("O que significa")}
          />
        ) : (
          <SummaryView
            analysisId={analysisId}
            deficiencyType={deficiencyType}
            probability={probability}
            date={date}
            author={author}
            talhao={talhao}
            tree={tree}
          />
        )}

      </SafeAreaView>
    </Background>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1 },

  header: {
    flexDirection: "column",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    gap: 18,
    width: "100%",
    paddingTop: 32,
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
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    justifyContent: "space-between",
  },

  // Card base
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    borderTopWidth: 4,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 30
    
  },

  // Tela 1
  analysisId: { fontSize: 16, fontWeight: "700", color: "#98979F"},
  divider: { height: 1, backgroundColor: "#b8b8b8", marginVertical: 14, borderRadius: 5 },
  gaugeContainer: { alignItems: "center", marginBottom: 16 },
  probabilityLabel: { fontSize: 14, color: "#666", textAlign: "center", marginBottom: 6 },
  deficiencyTitle: { fontSize: 20, fontWeight: "800", textAlign: "center", marginBottom: 24 },
  infoCard: { backgroundColor: "#6BC24A",  alignSelf: "center", borderRadius: 16, marginBottom: 12, minHeight: 100, 
    width: "60%", justifyContent: "center", borderBottomRightRadius: 0, borderBottomLeftRadius: 0, paddingTop: 12
  },
  infoContent: { alignItems: "center", justifyContent: "center", width: "100%" },
  infoTitle: { fontSize: 17, fontWeight: "700", color: "#fff", marginBottom: 2 },
  infoSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.85)" },
  note: { fontSize: 12, color: "#888", textAlign: "center", paddingHorizontal: 8, marginTop: 15 },

  // Tela 2
  rowSpaced: { flexDirection: "column", alignItems: "flex-start", gap: 10 },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 4,  backgroundColor: "#F1F1F1", padding: 5, borderRadius: 3 },
  dateText: { fontSize: 14, color: "#000000" },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 5 },
  infoLabel: { fontSize: 14, color: "#252525", flex: 1 },
  infoValue: { fontSize: 14, color: "#1A2C3E" },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4},
  badgeText: { fontSize: 14, fontWeight: "700", color: "#fff" },
  progressBar: { height: 14, backgroundColor: "#F0F0F0", borderRadius: 50, marginBottom: 6, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  authorRow: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#F1F1F1", padding: 5, borderRadius: 3 },
  avatarCircle: { width: 22, height: 22, borderRadius: 11, backgroundColor: "#9CA3AF", alignItems: "center", justifyContent: "center" },
  addStatus: { fontSize: 14, color: "#2b81d8", fontWeight: "500", textDecorationLine: "none",backgroundColor: "#F1F1F1", padding: 5, paddingHorizontal: 10, borderRadius: 3 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 14, fontWeight: "600" },
  statusDropdown: { alignItems: "flex-end", gap: 6, marginBottom: 8 },
  statusOption: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#1A2C3E", marginBottom: 10 },
  locationRow: { flexDirection: "row", gap: 8, marginBottom: 8, flexWrap: "wrap" },
  locationChip: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#F1F1F1", padding: 6, borderRadius: 3 },
  locationChipText: { fontSize: 14, color: "#1A2C3E", fontWeight: "500"   },
  linkRow: { flexDirection: "row", alignItems: "center", alignSelf: "center", gap: 4, marginBottom: 4, backgroundColor: "#F1F1F1", padding: 6, paddingHorizontal: 15, borderRadius: 50  },
  linkText: { fontSize: 14, color: "#2b81d8", fontWeight: "500" },
  textInput: { backgroundColor: "#F8F8F8", borderRadius: 10, padding: 12, minHeight: 90, fontSize: 13, color: "#1A2C3E", textAlignVertical: "top", marginBottom: 10, borderWidth: 1, borderColor: "#EFEFEF" },
  reportActions: { flexDirection: "row", justifyContent: "flex-end", gap: 16, marginBottom: 4 },
});