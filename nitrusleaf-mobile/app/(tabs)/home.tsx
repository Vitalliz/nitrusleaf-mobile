
// app/(tabs)/home.tsx - HOME SCREEN COM DESIGN PROFISSIONAL
import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ColorValue,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Footer from '@/components/footer';
import Menu from './menu';
import { getPropertiesByUser } from '@/repositories/propertyRepository';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

// Componente de Gráfico de Pizza
type PieChartItem = { value: number; color: ColorValue };
const PieChart = ({ data, size = 120 }: { data: PieChartItem[]; size?: number }) => {
  const radius = size / 2;
  let currentAngle = -Math.PI / 2;

  const createPath = (value: number, total: number) => {
    const sliceAngle = (value / total) * 2 * Math.PI;
    const endAngle = currentAngle + sliceAngle;

    const x1 = radius + radius * Math.cos(currentAngle);
    const y1 = radius + radius * Math.sin(currentAngle);
    const x2 = radius + radius * Math.cos(endAngle);
    const y2 = radius + radius * Math.sin(endAngle);

    const largeArc = sliceAngle > Math.PI ? 1 : 0;

    const path = `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    
    currentAngle = endAngle;
    return path;
  };

  const total = data.reduce((sum: any, item: { value: any; }) => sum + item.value, 0);
  currentAngle = -Math.PI / 2;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {data.map((item: { value: number; color: ColorValue | undefined; }, index: React.Key | null | undefined) => (
        <Path
          key={index}
          d={createPath(item.value, total)}
          fill={item.color}
        />
      ))}
    </Svg>
  );
};

export default function HomeScreen() {
  const { user } = useAuth();
  const fullName = user?.name || 'Usuário';
  const firstName = fullName.split(' ')[0];
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, [user?.id]);

  const loadProperties = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const userProperties = await getPropertiesByUser(user.id);
      setProperties(userProperties);
      if (userProperties.length > 0) {
        setSelectedProperty(userProperties[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar propriedades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyChange = (property: any) => {
    setSelectedProperty(property);
    setShowPropertyModal(false);
  };

  const analysisData = [
    {
      id: '1',
      title: 'Ocorrências totais de deficiências em %',
      data: [
        { value: 19, color: '#D13C3C', label: 'Cobre' },
        { value: 43, color: '#FFC83D', label: 'Manganês' },
        { value: 38, color: '#B0B0B0', label: 'Adversos' },
      ],
      total: '56/87 Pés',
      subtitle: 'Total de pés analisados',
    },
    {
      id: '2',
      title: 'Saúde Geral da Plantação',
      data: [
        { value: 70, color: '#6BC24A', label: 'Saudável' },
        { value: 20, color: '#FFC83D', label: 'Moderado' },
        { value: 10, color: '#D13C3C', label: 'Crítico' },
      ],
      total: '87/90 Pés',
      subtitle: 'Total analisados',
    },
    {
      id: '3',
      title: 'Fertilizantes Aplicados',
      data: [
        { value: 35, color: '#6BC24A', label: 'N' },
        { value: 30, color: '#3B82F6', label: 'P' },
        { value: 35, color: '#FFC83D', label: 'K' },
      ],
      total: '3 tipos',
      subtitle: 'Nutrientes',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
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

      {/* Main Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {/* Análises Gerais Section */}
        <View style={styles.analysisSection}>
          <Text style={styles.analysisTitle}>Análises Gerais</Text>
          <TouchableOpacity style={styles.propertyDropdown} onPress={() => setShowPropertyModal(true)}>
            <Text style={styles.propertyText}>
              {selectedProperty?.name || 'Selecionar Propriedade'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Scrollable Cards */}
        <FlatList
          data={analysisData}
          renderItem={({ item }) => {
            return (
              <View style={styles.analysisCard}>
                <Text style={styles.cardTitle}>{item.title}</Text>

                {/* Pie Chart */}
                <View style={styles.chartContainer}>
                  <PieChart data={item.data} size={120} />
                </View>

                {/* Legend */}
                <View style={styles.legendContainer}>
                  {item.data.map((legend: { color: any; label: any; }, idx: any) => (
                    <View key={idx} style={styles.legendItem}>
                      <View
                        style={[styles.legendDot, { backgroundColor: legend.color }]} />
                      <Text style={styles.legendText}>{legend.label}</Text>
                    </View>
                  ))}
                </View>

                {/* Total Info */}
                <View style={styles.totalInfo}>
                  <Text style={styles.totalValue}>{item.total}</Text>
                  <Text style={styles.totalLabel}>{item.subtitle}</Text>
                </View>

                {/* Detalhar Button */}
                <TouchableOpacity style={styles.detailButton}>
                  <Text style={styles.detailButtonText}>Detalhar</Text>
                </TouchableOpacity>
              </View>
            );
          }}
          renderToHardwareTextureAndroid
          keyExtractor={(item: { id: any; }) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + 20}
          decelerationRate="fast"
          style={styles.cardsContainer}
          contentContainerStyle={styles.cardsContent}
        />

        {/* Padding Bottom for Footer */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Property Selection Modal */}
      <Modal
        visible={showPropertyModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPropertyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Propriedade</Text>
              <TouchableOpacity
                onPress={() => setShowPropertyModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6BC24A" />
                <Text style={styles.loadingText}>Carregando propriedades...</Text>
              </View>
            ) : properties.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="business-outline" size={48} color="#CCC" />
                <Text style={styles.emptyText}>Nenhuma propriedade encontrada</Text>
                <Text style={styles.emptySubtext}>
                  Cadastre uma propriedade para começar
                </Text>
              </View>
            ) : (
              <ScrollView style={styles.propertiesList}>
                {properties.map((property) => (
                  <TouchableOpacity
                    key={property.id}
                    style={[
                      styles.propertyItem,
                      selectedProperty?.id === property.id && styles.selectedPropertyItem
                    ]}
                    onPress={() => handlePropertyChange(property)}
                  >
                    <View style={styles.propertyInfo}>
                      <Text style={styles.propertyName}>{property.name}</Text>
                      <Text style={styles.propertyLocation}>
                        {property.cidade}
                      </Text>
                    </View>
                    {selectedProperty?.id === property.id && (
                      <Ionicons name="checkmark-circle" size={24} color="#6BC24A" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Footer Profissional */}
      <Footer/>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#FAF1E5',
  },

  /* Header */
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

  /* Content */
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  /* Analysis Section */
  analysisSection: {
    marginBottom: 20,
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  propertyDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4D4D4',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'white',
    maxWidth: 200,
  },
  propertyText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },

  /* Cards Container */
  cardsContainer: {
    marginHorizontal: -20,
  },
  cardsContent: {
    paddingHorizontal: 20,
    gap: 20,
  },

  /* Analysis Card */
  analysisCard: {
    width: CARD_WIDTH,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 20,
    textAlign: 'center',
  },

  /* Chart */
  chartContainer: {
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Legend */
  legendContainer: {
    gap: 10,
    marginBottom: 20,
    alignItems: 'flex-start',
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },

  /* Total Info */
  totalInfo: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  totalLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },

  /* Detail Button */
  detailButton: {
    width: '100%',
    backgroundColor: '#6BC24A',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },

  /* Bottom Padding */
  bottomPadding: {
    height: 40,
  },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    minHeight: '40%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  closeButton: {
    padding: 4,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  propertiesList: {
    maxHeight: 400,
  },
  propertyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedPropertyItem: {
    backgroundColor: '#F8FFF8',
  },
  propertyInfo: {
    flex: 1,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  propertyLocation: {
    fontSize: 14,
    color: '#666',
  },
});

