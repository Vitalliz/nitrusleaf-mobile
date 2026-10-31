import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Background } from '@/components/ui/background';
import { Button } from '@/components/ui/button';
import TabBar from '@/components/ui/tab-bar';
import { Palette, FontSizes, FontWeights } from '@/constants/theme';

export default function HeatMapScreenWeb() {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/Maps/maps' as any);
    }
  };

  return (
    <Background>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar style="dark" />

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={Palette.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mapa de Calor</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Ionicons name="map-outline" size={48} color={Palette.primary} />
          </View>

          <Text style={styles.title}>Visualização Indisponível na Web</Text>
          <Text style={styles.message}>
            O mapa de calor e NDVI depende de recursos nativos de hardware e não está disponível na versão web. Acesse pelo aplicativo móvel ou emulador para utilizar esta funcionalidade.
          </Text>

          <View style={styles.buttonWrapper}>
            <Button
              title="Voltar"
              variant="primary"
              size="full"
              onPress={handleBack}
            />
          </View>
        </View>

        <TabBar />
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Palette.white,
    borderBottomWidth: 1,
    borderBottomColor: Palette.surfaceGray,
  },
  backBtn: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
  },
  headerSpacer: {
    width: 36,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Palette.surfaceGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Palette.borderDisabled,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: FontSizes.base,
    lineHeight: 22,
    color: Palette.textSecondary,
    textAlign: 'center',
    marginBottom: 28,
  },
  buttonWrapper: {
    width: '100%',
    maxWidth: 240,
  },
});