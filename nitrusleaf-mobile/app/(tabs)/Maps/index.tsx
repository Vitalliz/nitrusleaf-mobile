// app/(tabs)/Maps/index.tsx — Redireciona para a tela principal de mapas
import { Redirect } from 'expo-router';

export default function MapsIndex() {
  return <Redirect href="/(tabs)/Maps/maps" />;
}
