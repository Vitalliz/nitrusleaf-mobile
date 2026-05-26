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
import { ROUTES, openAddProperty, safeBack } from "@/utils/navigation";
import { Background } from "@/components/ui/background";
import { useAuth } from "@/contexts/AuthContext";
import { getPropertiesByUser, updateProperty } from "@/repositories/propertyRepository";
import type { Property } from "@/types/property";

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric";
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.formGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, isFocused && styles.inputFocused]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <View style={styles.editIndicator}>
          <Ionicons name="pencil-outline" size={16} color="#6BC24A" />
        </View>
      </View>
    </View>
  );
};

export default function PropertyDataScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    cep: "",
    logradouro: "",
    numero: "",
    bairro: "",
    cidade: "",
  });

  useEffect(() => {
    async function loadData() {
      if (!user?.id) return;
      try {
        const props = await getPropertiesByUser(user.id);
        if (props && props.length > 0) {
          const firstProp = props[0];
          setProperty(firstProp);
          setFormData({
            name: firstProp.name || "",
            cep: firstProp.cep || "",
            logradouro: firstProp.logradouro || "",
            numero: String(firstProp.numero || ""),
            bairro: firstProp.bairro || "",
            cidade: firstProp.cidade || "",
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dados da propriedade:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados da propriedade.");
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
    if (!property?.id) {
      Alert.alert("Erro", "Nenhuma propriedade cadastrada para atualizar.");
      return;
    }
    if (!formData.name.trim()) {
      Alert.alert("Erro", "O nome da propriedade é obrigatório.");
      return;
    }

    setSaving(true);
    try {
      await updateProperty(property.id, {
        name: formData.name.trim(),
        cep: formData.cep.trim(),
        logradouro: formData.logradouro.trim(),
        numero: Number(formData.numero) || 0,
        bairro: formData.bairro.trim(),
        cidade: formData.cidade.trim(),
      });
      Alert.alert("Sucesso", "Propriedade atualizada com sucesso!", [
        {
          text: "OK",
          onPress: () => router.replace(ROUTES.profile),
        },
      ]);
    } catch (error: any) {
      console.error("Erro ao salvar propriedade:", error);
      Alert.alert("Erro", error.message || "Não foi possível salvar as alterações.");
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
            <Text style={styles.userText}>{user?.name || "Carregando..."}</Text>
          </View>
          <TouchableOpacity onPress={() => safeBack(router, ROUTES.profile)} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Título da Seção */}
        <View style={styles.sectionHeader}>
          <Ionicons name="business-outline" size={24} color="#1A2C3E" />
          <Text style={styles.sectionTitle}>Dados da Propriedade</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6BC24A" />
          </View>
        ) : !property ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Você ainda não possui propriedade cadastrada. Use a opção abaixo ou cadastre no fluxo inicial de criação de conta.
            </Text>
            <TouchableOpacity
              style={styles.addPropertyBtn}
              onPress={() => openAddProperty(router, ROUTES.profile)}
              activeOpacity={0.85}
            >
              <Text style={styles.addPropertyBtnText}>Cadastrar propriedade</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            style={styles.formContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.formContent}
          >
            <FormInput
              label="Nome da Propriedade *"
              value={formData.name}
              onChangeText={(text) => handleInputChange("name", text)}
              placeholder="Digite o nome da fazenda ou sítio"
            />
            <FormInput
              label="CEP"
              value={formData.cep}
              onChangeText={(text) => handleInputChange("cep", text)}
              placeholder="00000-000"
            />
            <FormInput
              label="Logradouro"
              value={formData.logradouro}
              onChangeText={(text) => handleInputChange("logradouro", text)}
              placeholder="Rua, avenida, etc."
            />
            <FormInput
              label="Número"
              value={formData.numero}
              onChangeText={(text) => handleInputChange("numero", text)}
              placeholder="Ex: 123"
              keyboardType="numeric"
            />
            <FormInput
              label="Bairro"
              value={formData.bairro}
              onChangeText={(text) => handleInputChange("bairro", text)}
              placeholder="Digite o bairro"
            />
            <FormInput
              label="Cidade"
              value={formData.cidade}
              onChangeText={(text) => handleInputChange("cidade", text)}
              placeholder="Digite a cidade"
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 16,
  },
  addPropertyBtn: {
    backgroundColor: "#6BC24A",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  addPropertyBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
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
