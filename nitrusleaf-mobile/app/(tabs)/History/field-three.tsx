import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Background } from '@/components/ui/background';
import { CustomCard } from '@/components/card';
import { Header } from '@/components/header';
import BottomNavbar from '@/components/ui/menu';
import { Ionicons } from '@expo/vector-icons';

const analysesData = [
  {
    id: '#06',
    status: 'Em tratamento',
    date: '10 Nov, 2025',
    subItems: [
      { label: 'Laudo Agronômico', value: 'Pendente' },
      { label: 'Recomendações', value: 'Em análise' },
      { label: 'Data da coleta', value: '05 Nov, 2025' },
    ],
  },
  {
    id: '#05',
    status: 'Tratado',
    date: '10 Nov, 2025',
    subItems: [
      { label: 'Laudo Agronômico', value: 'Finalizado' },
      { label: 'Recomendações', value: 'Aplicadas' },
      { label: 'Data da coleta', value: '01 Nov, 2025' },
    ],
  },
];

const InnerCard = ({ label, value }: { label: string; value: string }) => {
  let valueColor = '#333';
  let valueBg = 'transparent';

  if (value === 'Pendente') {
    valueColor = '#EF4444';
    valueBg = '#FEE2E2';
  } else if (value === 'Em análise') {
    valueColor = '#F59E0B';
    valueBg = '#FEF3C7';
  } else {
    valueColor = '#10B981';
    valueBg = '#D1FAE5';
  }

  return (
    <View style={styles.innerCard}>
      <Text style={styles.innerCardLabel}>{label}</Text>
      <View style={[styles.innerCardValueContainer, { backgroundColor: valueBg }]}> 
        <Text style={[styles.innerCardValue, { color: valueColor }]}>{value}</Text>
      </View>
    </View>
  );
};

export default function HistoryTreeScreen() {
  const [expandedCard, setExpandedCard] = React.useState<string | null>('#06');

  const toggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const renderAnalysisCard = (item: any) => {
    const isExpanded = expandedCard === item.id;
    const isActive = item.status === 'Em tratamento';

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.analysisCard}
        onPress={() => toggleCard(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.analysisId}>Análise {item.id}</Text>

          {isActive ? (
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          ) : (
            <View style={styles.statusBadgeSuccess}>
              <Text style={styles.statusTextSuccess}>✓</Text>
              <Text style={styles.statusTextSuccessLabel}>{item.status}</Text>
            </View>
          )}
        </View>

        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={14} color="#888" />
          <Text style={styles.dateText}>Criado em: {item.date}</Text>
        </View>

        <View style={styles.expandIconContainer}>
          <Ionicons
            name={isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}
            size={18}
            color="#999"
          />
        </View>

        {isExpanded && (
          <View style={styles.innerCardsContainer}>
            {item.subItems.map((sub: any, i: number) => (
              <InnerCard key={i} label={sub.label} value={sub.value} />
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Background>
      <StatusBar barStyle="dark-content" backgroundColor="#F5EFE6" />
      <View style={styles.container}>
        <Header
          title="Roberto Almeida"
          subtitle="Sítio Santa Aurora"
        />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <CustomCard variant="white-large-feet">
            <View style={styles.mainCardContent}>

              <View style={styles.treeHeader}>
                <Text style={styles.treeTitle}>Árvore #01</Text>
              </View>

              {analysesData.map(renderAnalysisCard)}

            </View>
          </CustomCard>
        </ScrollView>

        <BottomNavbar />
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EFE6',
  },
  scrollContent: {
    padding: 10,
    paddingBottom: 100,
  },
  mainCardContent: {
    paddingTop: 200,
    padding: 16,
  },
  treeHeader: {
    marginBottom: 16,
  },
  treeTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  analysisCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEE',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  analysisId: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    marginRight: 6,
  },
  statusText: {
    color: '#EF4444',
    fontSize: 12,
  },
  statusBadgeSuccess: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusTextSuccess: {
    color: '#4CAF50',
    marginRight: 4,
  },
  statusTextSuccessLabel: {
    color: '#4CAF50',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 6,
  },
  expandIconContainer: {
    alignItems: 'center',
  },
  innerCardsContainer: {
    marginTop: 10,
    gap: 8,
  },
  innerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F9F9F9',
    padding: 10,
    borderRadius: 10,
  },
  innerCardLabel: {
    color: '#555',
  },
  innerCardValueContainer: {
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  innerCardValue: {
    fontWeight: '500',
  },
});
