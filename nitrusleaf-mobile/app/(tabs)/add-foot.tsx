// app/(tabs)/add-foot.tsx - Cadastro simples de Pé
import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AddFootScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { field } = useLocalSearchParams<{ field?: string }>();

  const [name, setName] = useState('Pé 1');
  const [status, setStatus] = useState('Não-Tratado');

  const save = () => {
    // Passa os dados do novo pé de volta para a tela anterior
    router.replace({
      pathname: '/(tabs)/field-feet',
      params: {
        field: field,
        newFoot: JSON.stringify({ name, status, color: status === 'Tratado' ? '#8B5CF6' : '#FACC15' })
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Cadastrar pé</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Talhão</Text>
        <TextInput value={String(field || 'Talhão 1')} editable={false} style={styles.inputDisabled} />

        <Text style={styles.label}>Nome do pé</Text>
        <TextInput value={name} onChangeText={setName} style={styles.input} />

        <Text style={styles.label}>Status</Text>
        <TextInput value={status} onChangeText={setStatus} style={styles.input} />

        <TouchableOpacity style={styles.saveBtn} onPress={save}>
          <Text style={styles.saveText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0E8' },
  header: { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#EFEFEF', paddingBottom: 16, paddingHorizontal: 20 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  label: { fontSize: 14, color: '#1A1A1A', fontWeight: '700', marginBottom: 8 },
  input: { backgroundColor: '#FFFFFF', borderRadius: 10, borderWidth: 1, borderColor: '#D4D4D4', paddingHorizontal: 14, paddingVertical: 12, marginBottom: 14 },
  inputDisabled: { backgroundColor: '#F9FAFB', borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 14, paddingVertical: 12, marginBottom: 14, color: '#6B7280' },
  saveBtn: { backgroundColor: '#6BC24A', borderRadius: 24, paddingVertical: 12, alignItems: 'center', marginTop: 8 },
  saveText: { color: '#FFFFFF', fontWeight: '800' },
});


