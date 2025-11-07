import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Card, DeficiencyCard } from '@/components/card';
import Footer from '@/components/footer';
import Top from '@/components/top';
import { ContinueButton, SeeMoreButton } from '@/components/ui/button';
import { Background } from '@/components/ui/background';

export default function ResultScreen() {
  const handleContinue = () => {
    console.log("Continuar pressionado");
    // Navegação ou ação desejada
  };

  const handleLearnMore = () => {
    console.log("Saiba mais pressionado");
    // Navegação para tela de detalhes
  };

  return (
    <Background>
      {/* Top fixo no topo */}
      <View style={styles.header}>
        <Top />
      </View>
      
      {/* Conteúdo principal com scroll */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Card de Resultado da Deficiência */}
        <View style={styles.cardContainer}>
          <DeficiencyCard 
            percentage={92}
            onPress={handleLearnMore}
          />
          
          {/* Botão Continuar DENTRO do container do card */}
          <View style={styles.buttonContainer}>
            <ContinueButton onPress={handleContinue} />
          </View>
        </View>

        {/* Seção "O que significa?" como card verde */}
        <View style={styles.meaningCard}>
          <TouchableOpacity style={styles.meaningContent} onPress={handleLearnMore}>
            <Text style={styles.meaningTitle}>O que significa?</Text>
            <Text style={styles.meaningLink}>Clique para saber mais</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 120,
    height: 100,
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  meaningCard: {
    backgroundColor: '#6BC24A',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    height:190,
    alignItems: 'center',
    marginTop:250
  },
  meaningContent: {
    alignItems: 'center',
  },
  meaningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  meaningLink: {
    fontSize: 14,
    color: '#FFFFFF',
    textDecorationLine: 'underline',
    opacity: 0.9,
  },
});