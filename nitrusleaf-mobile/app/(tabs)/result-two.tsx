import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ResultTwoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resultado Dois</Text>
      <Text>Conteúdo da tela de resultado dois</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4E8D7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});