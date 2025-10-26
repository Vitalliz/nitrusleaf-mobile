import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TabBar } from '@/components/menu'; // ajuste o caminho conforme necessário
import { TopProfile } from '@/components/top-profile';
import { MenuSub } from '@/components/menu-sub';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProperty, setSelectedProperty] = useState<string>('Todas as Propriedades');

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

  function handlePropertySelect(option: string): void {
    setSelectedProperty(option);
    // Aqui você pode adicionar lógica adicional ao selecionar uma propriedade
    console.log('Propriedade selecionada:', option);
  }

  return (
    <View style={styles.container}>
        <TopProfile 
        userName="Paulo"
        onMenuPress={handleMenuPress}
        onProfilePress={handleProfilePress}
        showGreeting={true}
      />
        <MenuSub 
        title="Análises Gerais"
        dropdownOptions={['Propriedade 1', 'Propriedade 2', 'Propriedade 3', 'Todas as Propriedades']}
        onOptionSelect={handlePropertySelect}
        selectedOption={selectedProperty}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Tab Ativa: {activeTab}</Text>
      </View>

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