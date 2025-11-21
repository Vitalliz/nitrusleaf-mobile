import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Background } from '@/components/ui/background';

// Interface para as props do Item
interface MenuItemProps {
  icon: string;
  text: string;
  onPress: () => void;
}

// Componente MenuItem separado
const MenuItem: React.FC<MenuItemProps> = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuItemLeft}>
      <Ionicons name={icon as any} size={22} color="#555" />
      <Text style={styles.menuItemText}>{text}</Text>
    </View>
    <Ionicons name="chevron-forward" size={22} color="#555" />
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const router = useRouter();

  // Dados do menu
  const menuItems = [
    {
      icon: "person-outline",
      text: "Dados Pessoais",
      route: "/(tabs)/personal-dates",
    },
    {
      icon: "business-outline",
      text: "Dados de Propriedade",
      route: "/(tabs)/property-dates",
    },
    {
      icon: "people-outline",
      text: "Permissões",
      route: "/(tabs)/permissions",
    },
    {
      icon: "key-outline",
      text: "Segurança",
      route: "/(tabs)/security",
    },
  ];

  return (
    <Background>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
           <Image source={require('@/assets/images/icons/people_profile.png')}  style={styles.avatar}/>
          <Text style={styles.userText}>Olá, João Silva!</Text>
        </View>

        <TouchableOpacity>
          <Ionicons name="menu" size={32} color="#3A3A3A" />
        </TouchableOpacity>
      </View>

      {/* Título da Seção */}
      <View style={styles.sectionHeader}>
        <Ionicons name="settings-outline" size={22} color="#555" />
        <Text style={styles.sectionTitle}>Configurações da Conta</Text>
      </View>

      {/* Card do Menu */}
      <View style={styles.menuCard}>
        {menuItems.map((item) => (
          <MenuItem
            key={item.text}
            icon={item.icon}
            text={item.text}
            onPress={() => router.push(item.route as any)}
          />
        ))}
      </View>

      {/* Botão Voltar */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({

  // Header
  header: {
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userText: {
    fontSize: 18,
    marginLeft: 12,
    fontWeight: "600",
    color: "#333",
  },
  userImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E8D7BD", // fallback color
  },

  // Seção Título
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 32,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 8,
    color: "#333",
  },

  // Card do Menu
  menuCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 320,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  // Itens do Menu
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0E6D5",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 100,
    backgroundColor: "#FFB027",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6BC24A",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 30,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "600",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
});
