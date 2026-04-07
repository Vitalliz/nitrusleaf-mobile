import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Footer from '@/components/footer';
import { Background } from '@/components/ui/background';
import { Ionicons } from '@expo/vector-icons';

export default function MemorialScreen() {
  const insets = useSafeAreaInsets();

  return (
    <Background>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Memorial</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.memorialCard}>
          <Ionicons name="heart" size={48} color="#6BC24A" style={styles.heartIcon} />
          <Text style={styles.memorialTitle}>Em Memória</Text>
          <Text style={styles.memorialName}>Maria Cecilia Gomes Domingues</Text>

          <View style={styles.divider} />

          <Text style={styles.memorialText}>
            Esta aplicação é dedicada com muito carinho à memória de Maria Cecilia Gomes Domingues,
            avó do desenvolvedor Lucas Gomes Fagundes.
          </Text>

          <Text style={styles.memorialText}>
            Sua presença, ensinamentos e amor pela família continuam sendo a maior inspiração
            para este trabalho e para todos que a conheceram.
          </Text>

          <Text style={styles.memorialText}>
            Que sua memória seja eterna e que seu legado de força, dedicação e amor
            continue iluminando nossos caminhos.
          </Text>

          <View style={styles.quoteContainer}>
            <Text style={styles.quoteText}>
              "Uma mulher que ensinou o valor do trabalho árduo, do amor incondicional
              e da força familiar."
            </Text>
          </View>

          <Text style={styles.memorialDate}>
            Sempre em nossos corações
          </Text>
        </View>
      </ScrollView>
      <Footer />
    </Background>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 18,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  memorialCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6BC24A',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heartIcon: {
    marginBottom: 16,
  },
  memorialTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  memorialName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6BC24A',
    marginBottom: 16,
    textAlign: 'center',
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: '#6BC24A',
    marginBottom: 20,
  },
  memorialText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  quoteContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginVertical: 16,
  },
  quoteText: {
    fontSize: 14,
    color: '#6BC24A',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  memorialDate: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 16,
  },
});