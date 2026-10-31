import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Background } from '@/components/ui/background';
import TabBar from '@/components/ui/tab-bar';
import { Palette, FontSizes, FontWeights } from '@/constants/theme';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: keyof typeof Ionicons.glyphMap;
  read: boolean;
}

const RECENT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'Análise Concluída',
    description: 'A análise foliar do Talhão 1 foi processada com sucesso.',
    time: 'Há 2 horas',
    icon: 'checkmark-circle-outline',
    read: false,
  },
  {
    id: '2',
    title: 'Alerta de Manganês',
    description: 'Identificada deficiência nutricional em 3 árvores analisadas.',
    time: 'Ontem',
    icon: 'warning-outline',
    read: false,
  },
  {
    id: '3',
    title: 'Sincronização Finalizada',
    description: 'Os dados da propriedade foram atualizados na nuvem.',
    time: '2 dias atrás',
    icon: 'cloud-done-outline',
    read: true,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [analysisAlerts, setAnalysisAlerts] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/Settings/settings-all');
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
          <Text style={styles.headerTitle}>Notificações</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Preferências de Alerta</Text>

          <View style={styles.settingsGroup}>
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Notificações Push</Text>
                <Text style={styles.settingSubtitle}>
                  Receber alertas importantes no dispositivo
                </Text>
              </View>
              <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                trackColor={{ false: Palette.borderDisabled, true: Palette.primary }}
                thumbColor={Palette.white}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Alertas de Análises</Text>
                <Text style={styles.settingSubtitle}>
                  Avisar quando novas análises forem processadas
                </Text>
              </View>
              <Switch
                value={analysisAlerts}
                onValueChange={setAnalysisAlerts}
                trackColor={{ false: Palette.borderDisabled, true: Palette.primary }}
                thumbColor={Palette.white}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Resumo Semanal</Text>
                <Text style={styles.settingSubtitle}>
                  Relatório do status nutricional da fazenda
                </Text>
              </View>
              <Switch
                value={weeklyReport}
                onValueChange={setWeeklyReport}
                trackColor={{ false: Palette.borderDisabled, true: Palette.primary }}
                thumbColor={Palette.white}
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Recentes</Text>

          <View style={styles.notificationsList}>
            {RECENT_NOTIFICATIONS.map((item) => (
              <View
                key={item.id}
                style={[styles.notificationCard, !item.read && styles.notificationCardUnread]}
              >
                <View style={styles.notificationIconBox}>
                  <Ionicons name={item.icon} size={22} color={Palette.textPrimary} />
                </View>

                <View style={styles.notificationContent}>
                  <View style={styles.notificationTopRow}>
                    <Text style={styles.notificationTitle}>{item.title}</Text>
                    <Text style={styles.notificationTime}>{item.time}</Text>
                  </View>
                  <Text style={styles.notificationDesc}>{item.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

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
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    marginBottom: 12,
    marginTop: 8,
  },
  settingsGroup: {
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.borderDisabled,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semiBold,
    color: Palette.textPrimary,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: Palette.textSecondary,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Palette.surfaceGray,
  },
  notificationsList: {
    gap: 10,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.surfaceGray,
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  notificationCardUnread: {
    borderColor: Palette.borderDisabled,
    backgroundColor: `${Palette.surfaceGray}40`,
  },
  notificationIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Palette.surfaceGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
  },
  notificationTime: {
    fontSize: 12,
    color: Palette.textSecondary,
  },
  notificationDesc: {
    fontSize: 12,
    color: Palette.textSecondary,
    lineHeight: 18,
  },
});