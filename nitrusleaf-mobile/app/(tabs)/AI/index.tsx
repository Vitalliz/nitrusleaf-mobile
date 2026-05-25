// app/(tabs)/AI/index.tsx — redireciona para home automaticamente
import { Redirect } from 'expo-router';

export default function AIIndex() {
  return <Redirect href="/(tabs)/AI/home" />;
}
