// app/(tabs)/history.tsx - HISTORY SCREEN
import Footer from "@/components/footer";
import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Background } from '@/components/ui/background';

export default function HistoryScreen() {
  const [expandedId] = useState<number | null>(null);
  const { user } = useAuth();
  const firstName = 'João Silva';
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Dados de exemplo (poderão vir da API no futuro)
  const summary = {
    talhoes: 3,
    totalPes: 82,
    diagnosticados: 42,
    analisados: 52,
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "watering":
        return "water";
      case "alert":
        return "alert-circle";
      case "inspection":
        return "checkmark-circle";
      case "maintenance":
        return "hammer";
      case "photo":
        return "camera";
      case "report":
        return "document";
      default:
        return "information-circle";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "watering":
        return "#3B82F6";
      case "alert":
        return "#E74C3C";
      case "inspection":
        return "#2ECC71";
      case "maintenance":
        return "#F39C12";
      case "photo":
        return "#9B59B6";
      case "report":
        return "#1ABC9C";
      default:
        return "#95A5A6";
    }
  };

  return (
    <Background>
      {/* Header estilizado como na Home */}
      <View style={[
        styles.header,
        { paddingTop: insets.top + 12, backgroundColor: '#FFFFFF', paddingBottom: 18 }
      ]}>
        <View style={styles.headerLeft}>
           <Image source={require('@/assets/images/icons/people_profile.png')}  style={styles.avatar}/>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Olá, {firstName}!</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/(tabs)/profile')}>
          <Ionicons name="menu" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Título + dropdown de propriedade */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>Histórico</Text>
          <TouchableOpacity style={styles.propertyDropdown}>
            <Text style={styles.propertyText}>Propriedade 1</Text>
            <Ionicons name="chevron-down" size={20} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Card de resumo */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Talhões registrados</Text>
            <Text style={styles.summaryValue}>{summary.talhoes}</Text>
          </View>
          <View style={styles.dashed} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total de pés</Text>
            <Text style={styles.summaryValue}>{summary.totalPes}</Text>
          </View>
          <View style={styles.dashed} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Pés Diagnosticados</Text>
            <Text style={styles.summaryValue}>{summary.diagnosticados}</Text>
          </View>
          <View style={styles.dashed} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Pés analisados</Text>
            <Text style={styles.summaryValue}>{summary.analisados}</Text>
          </View>
        </View>

        {/* Card link para tabela de Talhões */}
        <TouchableOpacity style={styles.linkCard} onPress={() => router.push('/(tabs)/fields')}>
          <Text style={styles.linkText}>Ver tabela de Talhões</Text>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>

        <View style={styles.bottomSpace} />
      </ScrollView>
      <Footer />
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF6F0",
  },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  headerText: {
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  menuButton: {
    padding: 8,
  },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  title: { fontSize: 24, fontWeight: '700', color: '#1A1A1A' },
  propertyDropdown: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#D4D4D4', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#FFFFFF' },
  propertyText: { fontSize: 14, color: '#333', marginRight: 6 },

  summaryCard: { backgroundColor: '#FFFFFF', borderRadius: 12, paddingVertical: 18, paddingHorizontal: 18, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  summaryLabel: { fontSize: 14, color: '#2B2B2B', fontWeight: '600' },
  summaryValue: { fontSize: 28, fontWeight: '800', color: '#1A1A1A' },
  dashed: { height: 1, backgroundColor: '#EAEAEA', borderStyle: 'dashed', borderWidth: 0.5, borderColor: '#EAEAEA' },

  linkCard: { backgroundColor: '#FFFFFF', borderRadius: 12, paddingVertical: 18, paddingHorizontal: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  linkText: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  bottomSpace: { height: 40 },
});