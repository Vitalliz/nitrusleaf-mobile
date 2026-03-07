import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Background } from '@/components/ui/background';
import { useAuth } from "@/contexts/AuthContext";

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
  const { user, logout } = useAuth();
  const fullName = user?.name || "Usuário";

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
          <View>
            <Text style={styles.userText}>Olá, {fullName.split(" ")[0]}!</Text>
            {user?.email && <Text style={styles.userEmail}>{user.email}</Text>}
          </View>
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

      {/* Ações de conta */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#6BC24A" }]}
          onPress={() => router.push("/register")}
        >
          <Ionicons name="person-add" size={18} color="#fff" />
          <Text style={styles.actionButtonText}>Cadastrar novo usuário</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#E74C3C", marginTop: 8 }]}
          onPress={() => {
            Alert.alert("Sair", "Deseja sair da conta atual?", [
              { text: "Cancelar", style: "cancel" },
              {
                text: "Sair",
                style: "destructive",
                onPress: async () => {
                  await logout();
                  router.replace("/login");
                },
              },
            ]);
          }}
        >
          <Ionicons name="log-out-outline" size={18} color="#fff" />
          <Text style={styles.actionButtonText}>Sair da conta</Text>
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
  userEmail: {
    fontSize: 14,
    marginLeft: 12,
    color: "#666",
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
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 24,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
});
