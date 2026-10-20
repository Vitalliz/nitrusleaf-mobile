import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { ROUTES, safeBack } from "@/utils/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  getUsuarioDetails,
  updateUsuarioPassword,
  deleteUsuario,
} from "@/repositories/profileRepository";
import { Background } from "@/components/ui/background";
import { Button } from "@/components/ui/button";
import { CustomAlert, AlertType } from "@/components/ui/alert";
import { Palette, FontSizes, FontWeights } from "@/constants/theme";

export default function AccountConfigScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

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
        const details = await getUsuarioDetails(user.id);
        if (details) setEmail(details.email || "");
      } catch (error) {
        console.error("Erro ao carregar conta:", error);
        showAlert("Não foi possível carregar os dados da conta.", "Erro", "error");
      } finally {
        setLoading(false);
      }
    }
    void loadData();
  }, [user, showAlert]);

  const handleSave = async () => {
    if (!user?.id) return;
    if (!currentPassword.trim()) {
      showAlert("Informe sua senha atual.", "Atenção", "warning");
      return;
    }
    if (!newPassword.trim()) {
      showAlert("Informe a nova senha.", "Atenção", "warning");
      return;
    }
    if (newPassword.length < 6) {
      showAlert("A nova senha deve ter ao menos 6 caracteres.", "Atenção", "warning");
      return;
    }

    setSaving(true);
    try {
      await updateUsuarioPassword(user.id, currentPassword, newPassword);
      showAlert("Senha atualizada com sucesso!", "Sucesso", "success");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error: any) {
      console.error("Erro ao atualizar senha:", error);
      showAlert(error.message || "Não foi possível atualizar a senha.", "Erro", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    showAlert(
      "Tem certeza que deseja excluir sua conta permanentemente? Essa ação é irreversível e apagará todos os seus registros.",
      "Excluir Conta",
      "warning",
      async () => {
        if (!user?.id) return;
        try {
          setSaving(true);
          await deleteUsuario(user.id);
          await logout();
          router.replace("/login");
        } catch (error: any) {
          console.error("Erro ao excluir conta:", error);
          showAlert(
            error.message || "Não foi possível excluir a conta. Entre em contato com o suporte.",
            "Erro",
            "error"
          );
        } finally {
          setSaving(false);
        }
      }
    );
  };

  return (
    <Background>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <StatusBar barStyle="dark-content" backgroundColor={Palette.white} />

        {/* Cabeçalho Padronizado */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => safeBack(router, ROUTES.profile)}
            style={styles.backBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={Palette.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Configurações da Conta</Text>
          <View style={styles.headerSpacer} />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Palette.primary} />
          </View>
        ) : (
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Formulário Direto na Tela */}
            <Text style={styles.sectionTitle}>Credenciais de Acesso</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>E-mail (Não editável)</Text>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={email}
                editable={false}
                placeholderTextColor={Palette.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Senha Atual</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.inputWithIcon}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Digite sua senha atual"
                  placeholderTextColor={Palette.textSecondary}
                  secureTextEntry={!showCurrent}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowCurrent(!showCurrent)}
                  style={styles.eyeButton}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={showCurrent ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={Palette.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Nova Senha</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.inputWithIcon}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Digite a nova senha"
                  placeholderTextColor={Palette.textSecondary}
                  secureTextEntry={!showNew}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowNew(!showNew)}
                  style={styles.eyeButton}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={showNew ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={Palette.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.saveButtonContainer}>
              <Button
                title={saving ? "Salvando..." : "Confirmar Alterações"}
                variant="primary"
                size="full"
                onPress={handleSave}
                disabled={saving}
              />
            </View>

            {/* Bloco de Zona de Risco */}
            <View style={styles.dangerZone}>
              <Text style={styles.dangerTitle}>Zona de Risco</Text>
              <Text style={styles.dangerDesc}>
                A exclusão da conta apagará permanentemente todos os seus dados pessoais, históricos e análises cadastradas.
              </Text>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDeleteAccount}
                disabled={saving}
                activeOpacity={0.8}
              >
                <Ionicons name="trash-outline" size={18} color={Palette.error} />
                <Text style={styles.deleteButtonText}>Excluir Minha Conta</Text>
              </TouchableOpacity>
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
  inputDisabled: {
    backgroundColor: Palette.surfaceGray,
    borderColor: Palette.borderDisabled,
    color: Palette.textSecondary,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Palette.borderDisabled,
    borderRadius: 8,
    backgroundColor: Palette.white,
    height: 48,
  },
  inputWithIcon: {
    flex: 1,
    paddingHorizontal: 14,
    fontSize: FontSizes.base,
    color: Palette.textPrimary,
  },
  eyeButton: {
    paddingHorizontal: 14,
  },
  saveButtonContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  dangerZone: {
    backgroundColor: `${Palette.error}10`,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: `${Palette.error}25`,
  },
  dangerTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Palette.error,
    marginBottom: 6,
  },
  dangerDesc: {
    fontSize: 12,
    color: Palette.textSecondary,
    marginBottom: 16,
    lineHeight: 18,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Palette.white,
    borderRadius: 8,
    height: 44,
    borderWidth: 1,
    borderColor: Palette.error,
  },
  deleteButtonText: {
    color: Palette.error,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semiBold,
  },
});