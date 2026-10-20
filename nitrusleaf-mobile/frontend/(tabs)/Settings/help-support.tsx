import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Background } from '@/components/ui/background';
import TabBar from '@/components/ui/tab-bar';
import { Palette, FontSizes, FontWeights } from '@/constants/theme';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: '1',
    question: 'Como cadastrar um novo talhão?',
    answer:
      'Acesse a tela inicial ou o menu de gerenciamento da fazenda e selecione a opção de cadastrar talhão para delimitar a área e registrar as árvores.',
  },
  {
    id: '2',
    question: 'Como funciona a análise foliar por imagem?',
    answer:
      'Utilize o botão central da câmera para fotografar uma folha com sintomas ou em boa iluminação. O modelo de inteligência artificial identificará deficiências nutricionais como manganês.',
  },
  {
    id: '3',
    question: 'Como atualizar os dados da minha propriedade?',
    answer:
      'No menu Configurações, selecione "Dados da Propriedade" para editar endereço, nome e localização no mapa.',
  },
];

export default function HelpSupportScreen() {
  const router = useRouter();
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/Settings/settings-all');
    }
  };

  const toggleFaq = (id: string) => {
    setExpandedFaqId((prev) => (prev === id ? null : id));
  };

  const handleOpenEmail = () => {
    Linking.openURL('mailto:suporte@exemplo.com.br?subject=Suporte%20App');
  };

  const handleOpenWhatsApp = () => {
    Linking.openURL('https://wa.me/5511999999999');
  };

  return (
    <Background>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor={Palette.white} />

        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={Palette.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ajuda e Suporte</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Seção: Canais de Atendimento */}
          <Text style={styles.sectionTitle}>Canais de Atendimento</Text>

          <View style={styles.contactCardsRow}>
            <TouchableOpacity
              style={styles.contactCard}
              activeOpacity={0.7}
              onPress={handleOpenWhatsApp}
            >
              <View style={styles.contactIconBox}>
                <Ionicons name="logo-whatsapp" size={22} color={Palette.primary} />
              </View>
              <Text style={styles.contactLabel}>WhatsApp</Text>
              <Text style={styles.contactSub}>Atendimento rápido</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactCard}
              activeOpacity={0.7}
              onPress={handleOpenEmail}
            >
              <View style={styles.contactIconBox}>
                <Ionicons name="mail-outline" size={22} color={Palette.primary} />
              </View>
              <Text style={styles.contactLabel}>E-mail</Text>
              <Text style={styles.contactSub}>suporte@app.com</Text>
            </TouchableOpacity>
          </View>

          {/* Seção: Perguntas Frequentes */}
          <Text style={styles.sectionTitle}>Perguntas Frequentes</Text>

          <View style={styles.faqList}>
            {FAQS.map((faq) => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <View key={faq.id} style={styles.faqCard}>
                  <TouchableOpacity
                    style={styles.faqHeader}
                    activeOpacity={0.7}
                    onPress={() => toggleFaq(faq.id)}
                  >
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={Palette.textPrimary}
                    />
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.faqAnswerContainer}>
                      <Text style={styles.faqAnswer}>{faq.answer}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>

        <TabBar />
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Palette.white,
    borderBottomWidth: 1,
    borderBottomColor: Palette.surfaceGray,
  },
  backBtn: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
  },
  headerSpacer: {
    width: 36,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    marginBottom: 12,
    marginTop: 8,
  },
  contactCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  contactCard: {
    flex: 1,
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.borderDisabled,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  contactIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.surfaceGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  contactLabel: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    marginBottom: 2,
  },
  contactSub: {
    fontSize: 12,
    color: Palette.textSecondary,
    textAlign: 'center',
  },
  faqList: {
    gap: 10,
  },
  faqCard: {
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.borderDisabled,
    borderRadius: 12,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  faqQuestion: {
    flex: 1,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semiBold,
    color: Palette.textPrimary,
    marginRight: 10,
  },
  faqAnswerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: Palette.surfaceGray,
    paddingTop: 10,
  },
  faqAnswer: {
    fontSize: 12,
    color: Palette.textSecondary,
    lineHeight: 18,
  },
});