import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { ROUTES, openAddProperty, safeBack } from "@/utils/navigation";
import { Background } from "@/components/ui/background";
import { Button } from "@/components/ui/button";
import { CustomAlert, AlertType } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useProperty } from "@/contexts/PropertyContext";
import { updateProperty } from "@/repositories/propertyRepository";
import type { Property } from "@/types/property";
import { Palette, FontSizes, FontWeights } from "@/constants/theme";
import { useLanguage } from "@/i18n/LanguageContext";
import { LanguageToggle } from "@/components/ui/LanguageToggle";

export default function PropertyDataScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { selectedProperty, refreshProperties } = useProperty();
  const { t, isEn } = useLanguage();

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

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title?: string;
    message: string;
    type: AlertType;
    onCloseAction?: () => void;
  }>({
    visible: false,
    title: "",
    message: "",
    type: "error",
  });

  const showAlert = useCallback(
    (message: string, title?: string, type: AlertType = "error", onCloseAction?: () => void) => {
      setAlertConfig({ visible: true, title, message, type, onCloseAction });
    },
    []
  );

  const handleCloseAlert = useCallback(() => {
    const action = alertConfig.onCloseAction;
    setAlertConfig((prev) => ({ ...prev, visible: false }));
    if (action) action();
  }, [alertConfig.onCloseAction]);

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
        showAlert(
          isEn ? "Could not load property details." : "Não foi possível carregar os dados da propriedade.",
          isEn ? "Error" : "Erro",
          "error"
        );
      } finally {
        setLoading(false);
      }
    }
    void loadData();
  }, [user?.id, selectedProperty, showAlert, isEn]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!property?.id) {
      showAlert(
        isEn ? "No property selected to update." : "Nenhuma propriedade selecionada para atualizar.",
        isEn ? "Warning" : "Atenção",
        "warning"
      );
      return;
    }
    if (!formData.name.trim()) {
      showAlert(
        isEn ? "Property name is required." : "O nome da propriedade é obrigatório.",
        isEn ? "Warning" : "Atenção",
        "warning"
      );
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
      showAlert(
        isEn ? "Property updated successfully!" : "Propriedade atualizada com sucesso!",
        isEn ? "Success" : "Sucesso",
        "success",
        () => {
          safeBack(router, ROUTES.profile);
        }
      );
    } catch (error: any) {
      console.error("Erro ao salvar propriedade:", error);
      showAlert(
        error.message || (isEn ? "Could not save changes." : "Não foi possível salvar as alterações."),
        isEn ? "Error" : "Erro",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Background>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <StatusBar style="dark" />

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => safeBack(router, ROUTES.profile)}
            style={styles.backBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={Palette.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{isEn ? "Property Details" : "Dados da Propriedade"}</Text>
          <LanguageToggle compact />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Palette.primary} />
          </View>
        ) : !property ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="business-outline" size={54} color={Palette.borderDisabled} />
            <Text style={styles.emptyText}>
              {isEn
                ? "You don't have a registered property yet."
                : "Você ainda não possui propriedade cadastrada."}
            </Text>
            <View style={styles.addPropertyBtnWrapper}>
              <Button
                title={isEn ? "Register property" : "Cadastrar propriedade"}
                variant="primary"
                size="full"
                onPress={() => openAddProperty(router, ROUTES.profile)}
              />
            </View>
          </View>
        ) : (
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.sectionTitle}>
              {isEn ? "Property Information" : "Informações da Propriedade"}
            </Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{isEn ? "Property Name *" : "Nome da Propriedade *"}</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => handleInputChange("name", text)}
                placeholder={isEn ? "e.g., Green Valley Farm" : "Ex: Fazenda Santa Maria"}
                placeholderTextColor={Palette.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{isEn ? "ZIP Code / CEP" : "CEP"}</Text>
              <TextInput
                style={styles.input}
                value={formData.cep}
                onChangeText={(text) => handleInputChange("cep", text)}
                placeholder="00000-000"
                placeholderTextColor={Palette.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{isEn ? "Street / Address" : "Logradouro"}</Text>
              <TextInput
                style={styles.input}
                value={formData.logradouro}
                onChangeText={(text) => handleInputChange("logradouro", text)}
                placeholder={isEn ? "Street, road, highway, etc." : "Rua, rodovia, km, etc."}
                placeholderTextColor={Palette.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{isEn ? "Number" : "Número"}</Text>
              <TextInput
                style={styles.input}
                value={formData.numero}
                onChangeText={(text) => handleInputChange("numero", text)}
                placeholder={isEn ? "e.g., 123 or N/A" : "Ex: 123 ou S/N"}
                placeholderTextColor={Palette.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{isEn ? "Neighborhood / District" : "Bairro"}</Text>
              <TextInput
                style={styles.input}
                value={formData.bairro}
                onChangeText={(text) => handleInputChange("bairro", text)}
                placeholder={isEn ? "Enter neighborhood or rural area" : "Digite o bairro ou zona rural"}
                placeholderTextColor={Palette.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{isEn ? "City" : "Cidade"}</Text>
              <TextInput
                style={styles.input}
                value={formData.cidade}
                onChangeText={(text) => handleInputChange("cidade", text)}
                placeholder={isEn ? "Enter city" : "Digite a cidade"}
                placeholderTextColor={Palette.textSecondary}
              />
            </View>

            <View style={styles.saveButtonContainer}>
              <Button
                title={saving ? t("common_saving") : (isEn ? "Save Changes" : "Salvar Alterações")}
                variant="primary"
                size="full"
                onPress={handleSave}
                disabled={saving}
              />
            </View>
          </ScrollView>
        )}

        <CustomAlert
          visible={alertConfig.visible}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
          onClose={handleCloseAlert}
        />
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Palette.white,
    borderBottomWidth: 1,
    borderBottomColor: Palette.surfaceGray,
  },
  backBtn: {
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
  },
  headerSpacer: {
    width: 36,
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
    paddingHorizontal: 24,
    gap: 12,
  },
  emptyText: {
    fontSize: FontSizes.base,
    color: Palette.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  addPropertyBtnWrapper: {
    width: "100%",
    maxWidth: 240,
    marginTop: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: FontWeights.semiBold,
    color: Palette.textPrimary,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: Palette.borderDisabled,
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 48,
    fontSize: FontSizes.base,
    color: Palette.textPrimary,
    backgroundColor: Palette.white,
  },
  saveButtonContainer: {
    marginTop: 16,
  },
});