// app/(tabs)/analysis.tsx - Tela com wave invertida no topo e card central
import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import Footer from '@/components/footer';

export default function AnalysisScreen() {
  const router = useRouter();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <View style={styles.container}>
      {/* Wave no topo invertida */}
      <Image
        source={require('@/assets/images/icons/wave-laranja.png')}
        style={styles.topWave}
        resizeMode="cover"
      />

      {/* Card central */}
      <View style={styles.card}>
        <Text style={styles.subtitle}>Probabilidade de ser</Text>
        <Text style={styles.title}>Deficiência de <Text style={styles.titleLink}>Cobre</Text></Text>

        {/* Gráfico em anel (92%) */}
        <View style={styles.chartWrap}>
          <Svg width={220} height={220}>
            {/* anel cinza claro */}
            <Circle cx={110} cy={110} r={90} stroke="#E6E6E6" strokeWidth={30} fill="none" />
            {/* progresso vermelho 92% */}
            <Circle
              cx={110}
              cy={110}
              r={90}
              stroke="#EE2727"
              strokeWidth={30}
              fill="none"
              strokeDasharray={`${2 * Math.PI * 90}`}
              strokeDashoffset={`${(1 - 0.92) * 2 * Math.PI * 90}`}
              strokeLinecap="round"
              rotation={-90}
              origin="110,110"
            />
          </Svg>
          <Text style={styles.chartLabel}>92%</Text>
        </View>

        <Text style={styles.diagnosis}>Deficiência de{`\n`}Cobre</Text>

        <TouchableOpacity style={styles.cta} onPress={() => router.push('/(tabs)/analysis-form')}>
          <Text style={styles.ctaText}>Continuar</Text>
        </TouchableOpacity>
      </View>

      {/* Footer exclusivo desta tela com texto informativo (abre cascata) */}
      <TouchableOpacity style={styles.footer} activeOpacity={0.9} onPress={() => setShowInfo((v) => !v)}>
        <Text style={styles.footerInfoTitle}>O que significa?</Text>
        <Text style={styles.footerInfoSub}>Clique para saber mais</Text>
      </TouchableOpacity>

      {showInfo && (
        <View style={styles.cascade}>
          <Text style={styles.cascadeTitle}>Deficiência de cobre</Text>
          <Text style={styles.cascadeText}>Em mexericas, a deficiência de cobre pode causar folhas retorcidas, clorose e baixa frutificação. Balanceie micronutrientes e revise pH do solo.</Text>
          <TouchableOpacity style={styles.cascadeLink} onPress={() => setShowInfo(false)}>
            <Text style={styles.cascadeLinkText}>Fechar</Text>
          </TouchableOpacity>
        </View>
        
      )}
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0E8',
    alignItems: 'center',
  },
  topWave: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    width: '100%',
    transform: [{ rotate: '180deg' }],
  },
  card: {
    marginTop: 140,
    width: '88%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  subtitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  title: { fontSize: 26, fontWeight: '800', color: '#1A1A1A', marginTop: 6, textAlign: 'center' },
  titleLink: { textDecorationLine: 'underline' },
  chartWrap: { marginTop: 14, marginBottom: 8, justifyContent: 'center', alignItems: 'center' },
  chartLabel: { position: 'absolute', fontSize: 48, fontWeight: '800', color: '#1A1A1A' },
  diagnosis: { fontSize: 22, fontWeight: '800', color: '#000', textAlign: 'center', marginTop: 8 },
  cta: { marginTop: 14, backgroundColor: '#6BC24A', borderRadius: 28, paddingVertical: 12, paddingHorizontal: 32 },
  ctaText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#6BC24A',
    paddingVertical: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  footerInfoTitle: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
  footerInfoSub: { color: '#FFFFFF', opacity: 0.9, marginTop: 4, fontSize: 12 },
  cascade: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  cascadeTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A1A', marginBottom: 6 },
  cascadeText: { fontSize: 12, color: '#333' },
  cascadeLink: { alignSelf: 'flex-end', marginTop: 8, backgroundColor: '#6BC24A', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  cascadeLinkText: { color: '#FFF', fontWeight: '700', fontSize: 12 },
});