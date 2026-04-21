import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Background } from '@/components/ui/background';
import { CustomCard } from '@/components/card';
import { Button } from '@/components/ui/button';
import BottomNavbar from '@/components/ui/menu';

export default function ResultadoScreen() {
  return (
    <Background>
      <View style={styles.container}>
        <Text style={styles.title}>Resultado da análise por imagem</Text>

        <CustomCard
          variant="red"
          bottomContent={
            <>
              <Text style={styles.subtitle}>Análise #006</Text>
              <View style={styles.divider} />

              <View style={styles.chartContainer}>
                <View style={styles.circle}>
                  <Text style={styles.percent}>92%</Text>
                </View>
              </View>

              <Text style={styles.label}>Probabilidade estimada</Text>
              <Text style={styles.result}>Deficiência de Cobre</Text>

              <Button title="Ver resumo técnico" size="full" />
            </>
          }
        />
      </View>
      <BottomNavbar />
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  circle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 14,
    borderColor: '#E65100',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percent: {
    fontSize: 36,
    fontWeight: '700',
  },
  label: {
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
  },
  result: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 8,
  },
  infoBox: {
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  infoSubtitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
  },
    divider: {
    width:350,
    height: 1,
    backgroundColor: "#ddd",
  },
});
