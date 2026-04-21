// app/(tabs)/history.tsx - HISTORY SCREEN
import Footer from "@/components/footer";
import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Background } from '@/components/ui/background';
import { getPropertiesByUser } from "@/repositories/propertyRepository";
import { getTalhoesByProperty } from "@/repositories/talhaoRepository";
import { getPesByTalhao } from "@/repositories/peRepository";

export default function HistoryScreen() {
  const [expandedId] = useState<number | null>(null);
  const { user } = useAuth();
  const fullName = user?.name || 'Usuário';
  const firstName = fullName.split(' ')[0];
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [summary, setSummary] = useState({
    talhoes: 0,
    totalPes: 0,
    diagnosticados: 0,
    analisados: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [showPropertyModal, setShowPropertyModal] = useState(false);

  useEffect(() => {
    loadHistoryData();
  }, [user?.id]);

  const loadHistoryData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const userProperties = await getPropertiesByUser(user.id);
      setProperties(userProperties);

      if (userProperties.length > 0 && !selectedProperty) {
        setSelectedProperty(userProperties[0].id.toString());
      }

      if (selectedProperty || userProperties.length > 0) {
        const propertyId = selectedProperty || userProperties[0].id.toString();
        await loadPropertyData(propertyId);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPropertyData = async (propertyId: string) => {
    try {
        const talhoes = await getTalhoesByProperty(propertyId);
      let totalPes = 0;
      let diagnosticados = 0;
      let analisados = 0;

      for (const talhao of talhoes) {
        const pes = await getPesByTalhao(talhao.id.toString());
        totalPes += pes.length;
        diagnosticados += pes.filter((pe) => pe.situacao === "Não-Tratado").length;
        analisados += pes.filter((pe) => pe.situacao === "Tratado").length;
      }

      setSummary({
        talhoes: talhoes.length,
        totalPes,
        diagnosticados,
        analisados,
      });
    } catch (error) {
      console.error('Erro ao carregar dados da propriedade:', error);
    }
  };

  const handlePropertyChange = (propertyId: string) => {
    setSelectedProperty(propertyId);
    setShowPropertyModal(false);
    loadPropertyData(propertyId);
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
          <TouchableOpacity style={styles.propertyDropdown} onPress={() => setShowPropertyModal(true)}>
            <Text style={styles.propertyText}>
              {properties.find(p => p.id.toString() === selectedProperty)?.name || 'Selecionar Propriedade'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#333" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6BC24A" />
            <Text style={styles.loadingText}>Carregando dados...</Text>
          </View>
        ) : (
          <>
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
          </>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Modal de Seleção de Propriedade */}
      <Modal
        visible={showPropertyModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPropertyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Propriedade</Text>
              <TouchableOpacity
                onPress={() => setShowPropertyModal(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {properties.map((property) => (
                <TouchableOpacity
                  key={property.id}
                  style={[
                    styles.propertyOption,
                    selectedProperty === property.id.toString() && styles.propertyOptionSelected
                  ]}
                  onPress={() => handlePropertyChange(property.id.toString())}
                >
                  <Text style={[
                    styles.propertyOptionText,
                    selectedProperty === property.id.toString() && styles.propertyOptionTextSelected
                  ]}>
                    {property.name}
                  </Text>
                  {selectedProperty === property.id.toString() && (
                    <Ionicons name="checkmark" size={20} color="#6BC24A" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  modalCloseBtn: {
    padding: 8,
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  propertyOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
  },
  propertyOptionSelected: {
    backgroundColor: '#F0F9F0',
    borderWidth: 1,
    borderColor: '#6BC24A',
  },
  propertyOptionText: {
    fontSize: 16,
    color: '#374151',
  },
  propertyOptionTextSelected: {
    color: '#1A1A1A',
    fontWeight: '600',
  },
});