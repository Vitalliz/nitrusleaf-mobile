// app/(tabs)/Settings/index.tsx — Redireciona para a tela de perfil/configurações
import { Redirect } from 'expo-router';

export default function SettingsIndex() {
  return <Redirect href="/(tabs)/Settings/profile-new" />;
}
