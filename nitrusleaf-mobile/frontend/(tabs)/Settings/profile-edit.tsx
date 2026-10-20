import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
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
  updateUsuarioDetails,
  updateUsuarioAvatar,
} from "@/repositories/profileRepository";
import {
  pickProfileImageFromDevice,
  uploadProfileAvatar,
} from "@/services/profileAvatar";

import { Background } from "@/components/ui/background";
import { Button } from "@/components/ui/button";
import { CustomAlert, AlertType } from "@/components/ui/alert";
import { Palette, FontSizes, FontWeights } from "@/constants/theme";

export default function ProfileEditScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    birthDate: "",
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
        const details = await getUsuarioDetails(user.id);
        if (details) {
          setFormData({
            name: details.fullName || "",
            email: details.email || "",
            phone: details.phone || "",
            cpf: details.cpf || "",
            birthDate: details.birthDate || "",
          });
          if (details.avatarUrl) setAvatarUri(details.avatarUrl);
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        showAlert("Não foi possível carregar os dados de perfil.", "Erro", "error");
      } finally {
        setLoading(false);
      }
    }
    void loadData();
  }, [user, showAlert]);

  const handleSave = async () => {
    if (!user?.id) return;
    if (!formData.name.trim()) {
      showAlert("O nome completo é obrigatório.", "Atenção", "warning");
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

      showAlert("Perfil atualizado com sucesso!", "Sucesso", "success", () => {
        safeBack(router, ROUTES.profile);
      });
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error);
      showAlert(error.message || "Não foi possível atualizar o perfil.", "Erro", "error");
    } finally {
      setSaving(false);
    }
  };

  const applyPickedAvatar = async (useCamera: boolean) => {
    if (!user?.id) return;
    try {
      const picked = await pickProfileImageFromDevice(useCamera);
      if (picked.cancelled || !picked.localUri) return;

      setUploadingAvatar(true);
      setAvatarUri(picked.localUri);

      const storedUrl = await uploadProfileAvatar(user.id, picked.localUri);
      await updateUsuarioAvatar(user.id, storedUrl);
      setAvatarUri(storedUrl);
      showAlert("Foto de perfil atualizada com sucesso.", "Sucesso", "success");
    } catch (error: unknown) {
      console.error("Erro ao alterar foto:", error);
      const msg =
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar a foto de perfil.";
      showAlert(msg, "Erro", "error");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleChangePhoto = () => {
    Alert.alert("Foto de perfil", "Escolha de onde enviar a imagem", [
      { text: "Galeria", onPress: () => void applyPickedAvatar(false) },
      { text: "Câmera", onPress: () => void applyPickedAvatar(true) },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  return (
    <Background>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <StatusBar barStyle="dark-content" backgroundColor={Palette.white} />

        {/* Cabeçalho com o ícone de voltar original */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => safeBack(router, ROUTES.profile)}
            style={styles.backBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={Palette.textPrimary} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Editar Perfil</Text>
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
            {/* Foto de Perfil */}
            <View style={styles.avatarSection}>
              <TouchableOpacity
                style={styles.avatarWrapper}
                onPress={handleChangePhoto}
                disabled={uploadingAvatar}
                activeOpacity={0.8}
              >
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={styles.avatar} />
                ) : (
                  <View style={styles.defaultAvatar}>
                    <Ionicons
                      name="person"
                      size={46}
                      color={Palette.borderDisabled}
                    />
                  </View>
                )}

                <View style={styles.cameraBadge}>
                  {uploadingAvatar ? (
                    <ActivityIndicator size="small" color={Palette.white} />
                  ) : (
                    <Ionicons name="camera" size={16} color={Palette.white} />
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleChangePhoto}
                disabled={uploadingAvatar}
                activeOpacity={0.7}
              >
                <Text style={styles.avatarText}>
                  {uploadingAvatar ? "Enviando foto..." : "Alterar foto de perfil"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Formulário Direto na Tela */}
            <Text style={styles.sectionTitle}>Informações Pessoais</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Nome Completo *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Seu nome completo"
                placeholderTextColor={Palette.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>E-mail (Não editável)</Text>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={formData.email}
                editable={false}
                placeholder="Seu e-mail"
                placeholderTextColor={Palette.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Telefone</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="(00) 00000-0000"
                placeholderTextColor={Palette.textSecondary}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>CPF</Text>
              <TextInput
                style={styles.input}
                value={formData.cpf}
                onChangeText={(text) => setFormData({ ...formData, cpf: text })}
                placeholder="000.000.000-00"
                placeholderTextColor={Palette.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Data de Nascimento</Text>
              <TextInput
                style={styles.input}
                value={formData.birthDate}
                onChangeText={(text) => setFormData({ ...formData, birthDate: text })}
                placeholder="AAAA-MM-DD"
                placeholderTextColor={Palette.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.saveButtonContainer}>
              <Button
                title={saving ? "Salvando..." : "Salvar Alterações"}
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
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },

  /* Avatar */
  avatarSection: {
    alignItems: "center",
    marginVertical: 16,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: Palette.primary,
  },
  defaultAvatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Palette.surfaceGray,
    borderWidth: 2,
    borderColor: Palette.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Palette.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Palette.white,
  },
  avatarText: {
    fontSize: FontSizes.sm,
    color: Palette.primary,
    fontWeight: FontWeights.semiBold,
    marginTop: 8,
  },

  /* Formulário */
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    marginBottom: 14,
  },
  formGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: FontSizes.sm,
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
  saveButtonContainer: {
    marginTop: 12,
  },
});