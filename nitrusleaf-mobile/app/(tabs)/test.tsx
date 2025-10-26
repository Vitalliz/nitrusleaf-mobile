import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TabBar } from '@/components/menu'; // ajuste o caminho conforme necessário
import { TopProfile } from '@/components/top-profile';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    // Aqui você pode adicionar lógica para navegar entre telas
    console.log('Tab pressionada:', tabName);
  };

  function handleMenuPress(): void {
    throw new Error('Function not implemented.');
  }

  function handleProfilePress(): void {
    throw new Error('Function not implemented.');
  }

  return (
    <View style={styles.container}>
        <TopProfile 
        userName="Paulo"
        onMenuPress={handleMenuPress}
        onProfilePress={handleProfilePress}
        showGreeting={true}
      />
      {/* Conteúdo principal da tela */}
      <View style={styles.content}>
        <Text style={styles.title}>Tab Ativa: {activeTab}</Text>
        {/* Seu conteúdo aqui baseado na tab ativa */}
      </View>

      {/* TabBar fixa na parte inferior */}
      <TabBar 
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default App;