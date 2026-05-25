// app/(tabs)/History/index.tsx — Redireciona para a tela principal de histórico
import { Redirect } from 'expo-router';

export default function HistoryIndex() {
  return <Redirect href="/(tabs)/History/fields" />;
}
