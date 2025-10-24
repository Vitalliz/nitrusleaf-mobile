// app/modal.tsx
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function ModalScreen() {
  const router = useRouter();

  return (
    <View style={styles.modal}>
      <Text style={styles.title}>Resultado da análise</Text>
      <Text style={styles.text}>Folha com bom nível de nitrogênio 🌿</Text>
      <Button title="Fechar" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    borderRadius: 20,
  },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 10 },
  text: { fontSize: 16, color: '#555', textAlign: 'center' },
});
