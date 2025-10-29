// Exemplo avançado de como usar o sistema de autenticação e API
// Esta é uma versão melhorada do home.tsx com integração de API

import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import type { Plantation, WeatherData } from "@/types/common";
import { COLORS, MESSAGES } from "@/constants/config";

export default function HomeScreenAdvanced() {
  const router = useRouter();
  const { user, logout, token, isLoading: authLoading } = useAuth();

  // Estados para dados
  const [plantations, setPlantations] = useState<Plantation[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Carrega dados ao abrir tela
  useEffect(() => {
    loadData();
  }, [token]);

  const loadData = async () => {
    try {
      setLoading(true);
      // TODO: Descomentar quando API estiver pronta
      // const [plantationsData, weatherData] = await Promise.all([
      //   apiService.getPlantations(token),
      //   apiService.getWeather(token),
      // ]);
      // setPlantations(plantationsData);
      // setWeather(weatherData);

      // MOCK - Remover em produção
      setPlantations([
        {
          id: "1",
          name: "Talhão A",
          area: 15.5,
          temperature: 28,
          humidity: 68,
          status: "healthy",
          type: "Café",
          lastUpdated: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Talhão B",
          area: 12.3,
          temperature: 26,
          humidity: 72,
          status: "warning",
          type: "Milho",
          lastUpdated: new Date().toISOString(),
        },
      ]);
      setWeather({
        temperature: 28,
        humidity: 65,
        condition: "Parcialmente nublado",
        windSpeed: 12,
        precipitation: 0,
      });
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadData();
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      healthy: COLORS.SUCCESS,
      warning: COLORS.WARNING,
      alert: COLORS.DANGER,
    };
    return colors[status] || COLORS.MUTED;
  };

  if (authLoading || loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header com Usuário */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bem vindo,</Text>
          <Text style={styles.userName}>{user?.name || "Usuário"}</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out" size={20} color={COLORS.DANGER} />
        </TouchableOpacity>
      </View>

      {/* Weather Card */}
      {weather && (
        <View style={styles.weatherCard}>
          <View style={styles.weatherTop}>
            <Ionicons name="cloud" size={32} color={COLORS.INFO} />
            <View style={styles.weatherInfo}>
              <Text style={styles.weatherCondition}>
                {weather.condition}
              </Text>
              <Text style={styles.weatherTemp}>
                {weather.temperature}°C • {weather.humidity}% umidade
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Plantations */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Suas Plantações</Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/maps")}
          >
            <Text style={styles.seeAll}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        {plantations.map(plantation => (
          <View key={plantation.id} style={styles.plantationCard}>
            <View style={styles.plantationHeader}>
              <View>
                <Text style={styles.plantationName}>
                  {plantation.name}
                </Text>
                <Text style={styles.plantationType}>
                  {plantation.type}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: getStatusColor(plantation.status),
                  },
                ]}
              >
                <Text style={styles.statusText}>
                  {plantation.status === "healthy"
                    ? "Saudável"
                    : plantation.status === "warning"
                    ? "Atenção"
                    : "Alerta"}
                </Text>
              </View>
            </View>

            <View style={styles.plantationStats}>
              <View style={styles.stat}>
                <Ionicons name="thermometer" size={16} color={COLORS.WARNING} />
                <Text style={styles.statLabel}>{plantation.temperature}°C</Text>
              </View>
              <View style={styles.stat}>
                <Ionicons name="water" size={16} color={COLORS.INFO} />
                <Text style={styles.statLabel}>{plantation.humidity}%</Text>
              </View>
              <View style={styles.stat}>
                <Ionicons name="square" size={16} color={COLORS.SECONDARY} />
                <Text style={styles.statLabel}>{plantation.area} ha</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: "#FFFFFF",
  },
  greeting: {
    fontSize: 14,
    color: COLORS.PLACEHOLDER,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.DARK,
    marginTop: 4,
  },
  logoutButton: {
    padding: 10,
  },
  weatherCard: {
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 20,
    backgroundColor: COLORS.INFO,
    borderRadius: 12,
    padding: 15,
  },
  weatherTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  weatherInfo: {
    marginLeft: 12,
    flex: 1,
  },
  weatherCondition: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  weatherTemp: {
    fontSize: 13,
    color: "#E8F4F8",
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.DARK,
  },
  seeAll: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: "600",
  },
  plantationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  plantationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  plantationName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.DARK,
  },
  plantationType: {
    fontSize: 12,
    color: COLORS.MUTED,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  plantationStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.DARK,
    fontWeight: "500",
  },
  spacer: {
    height: 40,
  },
});