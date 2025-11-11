// app/(tabs)/profile.tsx - PROFILE SCREEN
import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/footer";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "João Silva",
    email: user?.email || "joao@example.com",
    phone: "(11) 99999-9999",
    company: "NitrusLeaf Agro",
    experience: "5 anos",
  });

  const handleSaveProfile = () => {
    console.log("Perfil salvo:", profileData);
    setIsEditing(false);
    Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
  };

  const handleLogout = () => {
    Alert.alert("Sair", "Tem certeza que deseja sair?", [
      { text: "Cancelar", onPress: () => {} },
      {
        text: "Sair",
        onPress: () => {
          logout();
          router.replace("/login");
        },
      },
    ]);
  };

  const handleChangePassword = () => {
    Alert.alert("Alterar Senha", "Redirecionando para alteração de senha...", [
      { text: "OK", onPress: () => {} },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=1" }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.profileName}>{profileData.name}</Text>
          <Text style={styles.profileEmail}>{profileData.email}</Text>
        </View>

        {/* Profile Edit Toggle */}
        {!isEditing && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Ionicons name="pencil" size={16} color="#FFFFFF" />
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        )}

        {/* Profile Form */}
        <View style={styles.formContainer}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Informações Pessoais</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Nome Completo:</Text>
              <TextInput
                style={[
                  styles.input,
                  !isEditing && styles.inputDisabled,
                ]}
                value={profileData.name}
                onChangeText={(text) =>
                  setProfileData({ ...profileData, name: text })
                }
                editable={isEditing}
                placeholderTextColor="#CCC"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>E-mail:</Text>
              <TextInput
                style={[
                  styles.input,
                  !isEditing && styles.inputDisabled,
                ]}
                value={profileData.email}
                onChangeText={(text) =>
                  setProfileData({ ...profileData, email: text })
                }
                editable={isEditing}
                placeholderTextColor="#CCC"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Telefone:</Text>
              <TextInput
                style={[
                  styles.input,
                  !isEditing && styles.inputDisabled,
                ]}
                value={profileData.phone}
                onChangeText={(text) =>
                  setProfileData({ ...profileData, phone: text })
                }
                editable={isEditing}
                placeholderTextColor="#CCC"
              />
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Informações Profissionais</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Empresa:</Text>
              <TextInput
                style={[
                  styles.input,
                  !isEditing && styles.inputDisabled,
                ]}
                value={profileData.company}
                onChangeText={(text) =>
                  setProfileData({ ...profileData, company: text })
                }
                editable={isEditing}
                placeholderTextColor="#CCC"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Experiência:</Text>
              <TextInput
                style={[
                  styles.input,
                  !isEditing && styles.inputDisabled,
                ]}
                value={profileData.experience}
                onChangeText={(text) =>
                  setProfileData({ ...profileData, experience: text })
                }
                editable={isEditing}
                placeholderTextColor="#CCC"
              />
            </View>
          </View>

          {isEditing && (
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveProfile}
              >
                <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Salvar Alterações</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Account Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Conta</Text>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleChangePassword}
          >
            <Ionicons name="key" size={20} color="#6BC24A" />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Alterar Senha</Text>
              <Text style={styles.actionSubtitle}>
                Atualize sua senha de segurança
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#DDD" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="notifications" size={20} color="#6BC24A" />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Notificações</Text>
              <Text style={styles.actionSubtitle}>
                Configurar preferências de alerta
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#DDD" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="help-circle" size={20} color="#6BC24A" />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Ajuda e Suporte</Text>
              <Text style={styles.actionSubtitle}>
                Contate nosso suporte técnico
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#DDD" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, styles.logoutCard]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out" size={20} color="#E74C3C" />
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, styles.logoutTitle]}>
                Sair da Conta
              </Text>
              <Text style={styles.actionSubtitle}>
                Desconecte-se da sua conta
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#DDD" />
          </TouchableOpacity>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2B2B2B",
  },
  profileEmail: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6BC24A",
    marginHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 8,
  },
  formContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  formSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2B2B2B",
    marginBottom: 15,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2B2B2B",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#2B2B2B",
    backgroundColor: "#FFFFFF",
  },
  inputDisabled: {
    backgroundColor: "#F5F5F5",
    color: "#999",
  },
  buttonGroup: {
    gap: 10,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6BC24A",
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 8,
  },
  cancelButton: {
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#2B2B2B",
    fontWeight: "600",
  },
  actionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  logoutCard: {
    marginTop: 10,
    backgroundColor: "#FFF5F5",
  },
  actionContent: {
    flex: 1,
    marginLeft: 12,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2B2B2B",
  },
  logoutTitle: {
    color: "#E74C3C",
  },
  actionSubtitle: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  spacer: {
    height: 40,
  },
});