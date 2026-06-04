import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
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
import { useProperty } from "@/contexts/PropertyContext";
import { updateProperty } from "@/repositories/propertyRepository";
import type { Property } from "@/types/property";

export default function PropertyDataScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { selectedProperty, refreshProperties } = useProperty();
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
        if (selectedProperty) {
          setProperty(selectedProperty);
          setFormData({
            name: selectedProperty.name || "",
            cep: selectedProperty.cep || "",
            logradouro: selectedProperty.logradouro || "",
            numero: String(selectedProperty.numero || ""),
            bairro: selectedProperty.bairro || "",
            cidade: selectedProperty.cidade || "",
          });
        } else {
          setProperty(null);
        }
      } catch (error) {
        console.error("Erro ao carregar dados da propriedade:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados da propriedade.");
      } finally {
        setLoading(false);
      }
    }
    void loadData();
  }, [user?.id, selectedProperty?.id]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
      await refreshProperties();
      Alert.alert("Sucesso", "Propriedade atualizada com sucesso!", [
        { text: "OK", onPress: () => router.replace(ROUTES.profile) },
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

        {/* Header — mesmo padrão do profile-edit */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => safeBack(router, ROUTES.profile)} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dados da Propriedade</Text>
          <View style={{ width: 24 }} />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6BC24A" />
          </View>
        ) : !property ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="business-outline" size={48} color="#CCC" />
            <Text style={styles.emptyText}>
              Você ainda não possui propriedade cadastrada.
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
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>Informações da Propriedade</Text>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Nome da Propriedade *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => handleInputChange("name", text)}
                  placeholder="Digite o nome da fazenda ou sítio"
                  placeholderTextColor="#CCC"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>CEP</Text>
                <TextInput
                  style={styles.input}
                  value={formData.cep}
                  onChangeText={(text) => handleInputChange("cep", text)}
                  placeholder="00000-000"
                  placeholderTextColor="#CCC"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Logradouro</Text>
                <TextInput
                  style={styles.input}
                  value={formData.logradouro}
                  onChangeText={(text) => handleInputChange("logradouro", text)}
                  placeholder="Rua, avenida, etc."
                  placeholderTextColor="#CCC"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Número</Text>
                <TextInput
                  style={styles.input}
                  value={formData.numero}
                  onChangeText={(text) => handleInputChange("numero", text)}
                  placeholder="Ex: 123"
                  placeholderTextColor="#CCC"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Bairro</Text>
                <TextInput
                  style={styles.input}
                  value={formData.bairro}
                  onChangeText={(text) => handleInputChange("bairro", text)}
                  placeholder="Digite o bairro"
                  placeholderTextColor="#CCC"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Cidade</Text>
                <TextInput
                  style={styles.input}
                  value={formData.cidade}
                  onChangeText={(text) => handleInputChange("cidade", text)}
                  placeholder="Digite a cidade"
                  placeholderTextColor="#CCC"
                />
              </View>

              <TouchableOpacity
                style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={saving}
              >
                <Text style={styles.saveButtonText}>
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.spacer} />
          </ScrollView>
        )}
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 35,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
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
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  addPropertyBtn: {
    backgroundColor: "#6BC24A",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 50,
    marginTop: 8,
  },
  addPropertyBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A2C3E",
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#E8D7BD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#2B2B2B",
    backgroundColor: "#FFFFFF",
  },
  saveButton: {
    backgroundColor: "#6BC24A",
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  spacer: {
    height: 40,
  },
});