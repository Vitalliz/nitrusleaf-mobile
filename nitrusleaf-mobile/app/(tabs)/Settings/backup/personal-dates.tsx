import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ROUTES, safeBack } from "@/utils/navigation";
import { Background } from "@/components/ui/background";
import { useAuth } from "@/contexts/AuthContext";
import { getUsuarioDetails, updateUsuarioDetails } from "@/repositories/profileRepository";

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  editable?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  editable = true,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.formGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[
            styles.input,
            isFocused && styles.inputFocused,
            !editable && styles.inputDisabled,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={editable}
        />
        {editable && (
          <View style={styles.editIndicator}>
            <Ionicons name="pencil-outline" size={16} color="#6BC24A" />
          </View>
        )}
      </View>
    </View>
  );
};

export default function PersonalDataScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    birthDate: "",
  });

  useEffect(() => {
    async function loadData() {
      if (!user?.id) return;
      try {
        const details = await getUsuarioDetails(user.id);
        if (details) {
          setFormData({
            name: details.fullName || "",
            email: details.email || "",
            phone: details.phone || "",
            cpf: details.cpf || "",
            birthDate: details.birthDate || "",
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dados pessoais:", error);
        Alert.alert("Erro", "Não foi possível carregar seus dados.");
      } finally {
        setLoading(false);
      }
    }
    void loadData();
  }, [user]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!user?.id) return;
    if (!formData.name.trim()) {
      Alert.alert("Erro", "O nome completo é obrigatório.");
      return;
    }

    setSaving(true);
    try {
      await updateUsuarioDetails(user.id, {
        fullName: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        cpf: formData.cpf.trim() || undefined,
        birthDate: formData.birthDate.trim() || undefined,
      });
      Alert.alert("Sucesso", "Dados pessoais atualizados com sucesso!", [
        {
          text: "OK",
          onPress: () => router.replace(ROUTES.profile),
        },
      ]);
    } catch (error: any) {
      console.error("Erro ao salvar dados pessoais:", error);
      Alert.alert("Erro", error.message || "Não foi possível salvar os dados.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Background>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAF1E5" />
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={{
                uri: "https://media.istockphoto.com/id/1410538853/pt/foto/young-man-in-the-public-park.jpg?s=2048x2048&w=is&k=20&c=MIzvR5V8GPSO0zVoFnyE6E-AdkmH_TdBO0MSeEs1Ik4=",
              }}
              style={styles.avatar}
            />
            <Text style={styles.userText}>{formData.name || "Carregando..."}</Text>
          </View>
          <TouchableOpacity onPress={() => safeBack(router, ROUTES.profile)} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Título da Seção */}
        <View style={styles.sectionHeader}>
          <Ionicons name="person-outline" size={24} color="#1A2C3E" />
          <Text style={styles.sectionTitle}>Dados Pessoais</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6BC24A" />
          </View>
        ) : (
          <ScrollView
            style={styles.formContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.formContent}
          >
            <FormInput
              label="Nome Completo *"
              value={formData.name}
              onChangeText={(text) => handleInputChange("name", text)}
              placeholder="Digite seu nome completo"
            />
            <FormInput
              label="E-mail"
              value={formData.email}
              onChangeText={(text) => handleInputChange("email", text)}
              placeholder="Digite seu e-mail"
              editable={false} // E-mail costuma ser o login do Auth, deixamos somente visualização
            />
            <FormInput
              label="Telefone"
              value={formData.phone}
              onChangeText={(text) => handleInputChange("phone", text)}
              placeholder="(00) 00000-0000"
            />
            <FormInput
              label="CPF"
              value={formData.cpf}
              onChangeText={(text) => handleInputChange("cpf", text)}
              placeholder="000.000.000-00"
            />
            <FormInput
              label="Data de Nascimento"
              value={formData.birthDate}
              onChangeText={(text) => handleInputChange("birthDate", text)}
              placeholder="AAAA-MM-DD"
            />

            <TouchableOpacity
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.saveBtnText}>
                {saving ? "Salvando..." : "Salvar Alterações"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* Footer com Botão Voltar */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => safeBack(router, ROUTES.profile)}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userText: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: "600",
    color: "#1A2C3E",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#6BC24A",
  },
  closeBtn: {
    padding: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    paddingHorizontal: 24,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A2C3E",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    flex: 1,
    marginTop: 16,
  },
  formContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#5A3E2B",
    marginBottom: 8,
    fontWeight: "600",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  input: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderColor: "#E8D7BD",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingRight: 40,
    fontSize: 16,
    color: "#333",
  },
  inputFocused: {
    borderColor: "#6BC24A",
    backgroundColor: "#FAF6F0",
  },
  inputDisabled: {
    backgroundColor: "#F5F5F5",
    borderColor: "#E5E5E5",
    color: "#888",
  },
  editIndicator: {
    position: "absolute",
    right: 14,
    justifyContent: "center",
  },
  saveBtn: {
    backgroundColor: "#6BC24A",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  saveBtnDisabled: {
    backgroundColor: "#9CA3AF",
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "#FAF1E5",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E8D7BD",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A2C3E",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    marginLeft: 8,
    fontWeight: "600",
  },
});
