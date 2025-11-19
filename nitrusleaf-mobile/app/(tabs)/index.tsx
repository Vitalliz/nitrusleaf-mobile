// app/(tabs)/index.tsx - HOME SCREEN
import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import Menu from '@/components/menu'; // Importação corrigida

export default function HomeScreen() {
  const { user } = useAuth();

  const stats = [
    { label: 'Plantações', value: '4', icon: 'leaf', color: '#6BC24A' },
    { label: 'Área Total', value: '42ha', icon: 'expand', color: '#F9AA33' },
    { label: 'Alertas', value: '2', icon: 'alert-circle', color: '#E74C3C' },
    { label: 'Sensores', value: '18', icon: 'git-network', color: '#3B82F6' },
  ];

  const activities = [
    {
      id: 1,
      title: 'Rega em Plantation A',
      time: 'Há 2 horas',
      icon: 'water',
      color: '#3B82F6',
    },
    {
      id: 2,
      title: 'Alerta de umidade',
      time: 'Há 1 hora',
      icon: 'alert',
      color: '#E74C3C',
    },
    {
      id: 3,
      title: 'Inspeção concluída',
      time: 'Há 4 horas',
      icon: 'checkmark-circle',
      color: '#2ECC71',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bem-vindo!</Text>
            <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
          </View>
          <Ionicons name="notifications-outline" size={28} color="#2B2B2B" />
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                <Ionicons name={stat.icon as any} size={24} color="white" />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="camera" size={28} color="#6BC24A" />
              <Text style={styles.actionLabel}>Tirar Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="add-circle" size={28} color="#F9AA33" />
              <Text style={styles.actionLabel}>Nova Atividade</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="map" size={28} color="#3B82F6" />
              <Text style={styles.actionLabel}>Ver Mapa</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Atividades Recentes</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllLink}>Ver Tudo</Text>
            </TouchableOpacity>
          </View>

          {activities.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: activity.color }]}>
                <Ionicons name={activity.icon as any} size={20} color="white" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#DDD" />
            </View>
          ))}
        </View>

        <View style={styles.spacer} />
      </ScrollView>
      <Menu />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2B2B2B',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: '1%',
    marginBottom: 10,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2B2B2B',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2B2B2B',
  },
  seeAllLink: {
    fontSize: 13,
    color: '#6BC24A',
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 6,
  },
  actionLabel: {
    fontSize: 12,
    color: '#2B2B2B',
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2B2B2B',
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  spacer: {
    height: 40,
  },
});
