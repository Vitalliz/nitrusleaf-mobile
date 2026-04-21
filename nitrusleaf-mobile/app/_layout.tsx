import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Background } from '@/components/ui/background';
import { CustomCard } from '@/components/card';
import { SimpleGaugeChart } from '@/components/chart';

export default function AnalysisResultScreen() {
  return (
    <Background>
      <View style={styles.container}>
        <Text style={styles.title}>Resultado da análise por imagem</Text>

        <CustomCard
          variant="white"
          bottomContent={
            <View>
              {/* Header */}
              <View style={styles.headerRow}>
                <Text style={styles.analysisId}>Análise #006</Text>
                <Text style={styles.date}>23 de Março de 2026</Text>
              </View>

              {/* Deficiência */}
              <View style={styles.section}>
                <Text style={styles.label}>Deficiência detectada:</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Cobre</Text>
                </View>
              </View>

              {/* Probabilidade */}
              <View style={styles.section}>
                <Text style={styles.label}>Probabilidade estimada da IA:</Text>
                <SimpleGaugeChart percentage={92} />
              </View>

              {/* Autor */}
              <View style={styles.sectionRow}>
                <Text style={styles.label}>Autor da análise:</Text>
                <Text style={styles.value}>Roberto Almeida</Text>
              </View>

              {/* Status */}
              <View style={styles.sectionRow}>
                <Text style={styles.label}>Status:</Text>
                <TouchableOpacity style={styles.statusButton}>
                  <Text style={styles.statusText}>+ Adicionar status</Text>
                </TouchableOpacity>
              </View>

              {/* Localização */}
              <View style={styles.section}>
                <Text style={styles.subtitle}>Localização da amostra</Text>

                <View style={styles.locationRow}>
                  <View style={styles.locationTag}>
                    <Text>Talhão 3</Text>
                  </View>
                  <View style={styles.locationTag}>
                    <Text>Árvore 6</Text>
                  </View>
                </View>

                <TouchableOpacity>
                  <Text style={styles.link}>Alterar localização</Text>
                </TouchableOpacity>
              </View>

              {/* Relatório */}
              <View style={styles.section}>
                <Text style={styles.subtitle}>Escrever Relatório</Text>
                <TextInput
                  placeholder="Adicione suas observações..."
                  multiline
                  style={styles.input}
                />
              </View>
            </View>
          }
        />

        {/* Botão */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveText}>Salvar no histórico</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  analysisId: {
    fontWeight: '600',
    fontSize: 16,
  },
  date: {
    color: '#666',
  },
  section: {
    marginVertical: 10,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    color: '#333',
  },
  value: {
    fontWeight: '500',
  },
  badge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '600',
  },
  statusButton: {
    backgroundColor: '#E5E5E5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    color: '#333',
  },
  subtitle: {
    fontWeight: '600',
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  locationTag: {
    backgroundColor: '#E5E5E5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  link: {
    color: '#3B82F6',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#58B741',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 12,
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
  },
});
