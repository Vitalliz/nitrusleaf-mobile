// app/(tabs)/analysis-form.tsx - Tela com formulário (Talhão e Pé) e Finalizar
import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Footer from '@/components/footer';
import { Background } from '@/components/ui/background';

export default function AnalysisFormScreen() {
  const router = useRouter();
  const [talhao, setTalhao] = useState('Talhão 1');
  const [pe, setPe] = useState('Pé 1');
  const [showTalhaoModal, setShowTalhaoModal] = useState(false);
  const [showPeModal, setShowPeModal] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const talhoes = ['Talhão 1', 'Talhão 2', 'Talhão 3'];
  const pes = ['Pé 1', 'Pé 2', 'Pé 3', 'Pé 4'];

  return (
   <Background>
      {/* Wave no topo invertida */}
      <Image
        source={require('@/assets/images/icons/wave-laranja.png')}
        style={styles.topWave}
        resizeMode="cover"
      />

      {/* Card central - maior e mais centrado */}
      <View style={styles.card}>
        <Text style={styles.subtitle}>Probabilidade de ser</Text>
        <Text style={styles.title}>Deficiência de <Text style={styles.titleLink}>Cobre</Text></Text>

        {/* Campo Talhão */}
        <View style={{ width: '100%', marginTop: 22 }}>
          <Text style={styles.label}>Insira o talhão em que o pé se localiza:</Text>
          <View style={styles.row}>
            <TouchableOpacity style={styles.chipField} onPress={() => setShowTalhaoModal(true)}>
              <Text style={styles.chipText}>{talhao}</Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => setShowTalhaoModal(true)}>
              <Image source={require('@/assets/images/icons/bx_edit.png')} style={{ width: 24, height: 24 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Campo Pé */}
        <View style={{ width: '100%', marginTop: 16 }}>
          <Text style={styles.label}>Insira o número/Id do pé</Text>
          <View style={styles.row}>
            <TouchableOpacity style={styles.chipField} onPress={() => setShowPeModal(true)}>
              <Text style={styles.chipText}>{pe}</Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => setShowPeModal(true)}>
              <Image source={require('@/assets/images/icons/bx_edit.png')} style={{ width: 24, height: 24 }} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.cta} onPress={() => router.replace('/(tabs)/home')}>
          <Text style={styles.ctaText}>Finalizar</Text>
        </TouchableOpacity>
      </View>

      {/* Footer informativo verde, mantendo consistência */}
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

      {/* Modal de seleção Talhão */}
      <Modal visible={showTalhaoModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowTalhaoModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione o Talhão</Text>
            {talhoes.map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.modalOption, talhao === t && styles.modalOptionSelected]}
                onPress={() => {
                  setTalhao(t);
                  setShowTalhaoModal(false);
                }}
              >
                <Text style={[styles.modalOptionText, talhao === t && styles.modalOptionTextSelected]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal de seleção Pé */}
      <Modal visible={showPeModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowPeModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione o Pé</Text>
            {pes.map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.modalOption, pe === p && styles.modalOptionSelected]}
                onPress={() => {
                  setPe(p);
                  setShowPeModal(false);
                }}
              >
                <Text style={[styles.modalOptionText, pe === p && styles.modalOptionTextSelected]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
      <Footer />
  </Background>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0E8', alignItems: 'center', justifyContent: 'center' },
  topWave: { position: 'absolute', top: 0, left: 0, right: 0, height: 160, width: '100%', transform: [{ rotate: '180deg' }] },
  card: {
    width: '92%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 5,
  },
  subtitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  title: { fontSize: 26, fontWeight: '800', color: '#1A1A1A', marginTop: 6 },
  titleLink: { textDecorationLine: 'underline' },
  label: { fontSize: 14, color: '#1A1A1A', fontWeight: '700', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  chipField: { flex: 1, height: 56, borderWidth: 1, borderColor: '#6BC24A', borderRadius: 28, justifyContent: 'space-between', paddingHorizontal: 18, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center' },
  chipText: { color: '#1A1A1A', fontWeight: '700', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 20, paddingBottom: 32 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', paddingHorizontal: 20, marginBottom: 12 },
  modalOption: { paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  modalOptionSelected: { backgroundColor: '#F0FDF4' },
  modalOptionText: { fontSize: 16, color: '#1A1A1A' },
  modalOptionTextSelected: { color: '#6BC24A', fontWeight: '700' },
  iconBtn: { width: 64, height: 56, borderRadius: 16, backgroundColor: '#6BC24A', justifyContent: 'center', alignItems: 'center' },
  cta: { marginTop: 22, backgroundColor: '#6BC24A', borderRadius: 28, paddingVertical: 12, alignItems: 'center' },
  ctaText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#6BC24A', paddingVertical: 16, borderTopLeftRadius: 20, borderTopRightRadius: 20, alignItems: 'center' },
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

