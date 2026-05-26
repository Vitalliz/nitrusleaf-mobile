  import React, { useState, useEffect } from "react";
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
    SafeAreaView,
    StatusBar,
  } from "react-native";
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
          Alert.alert("Erro", "Não foi possível carregar os dados de perfil.");
        } finally {
          setLoading(false);
        }
      }
      void loadData();
    }, [user]);

    const handleSave = async () => {
      if (!user?.id) return;
      if (!formData.name.trim()) {
        Alert.alert("Erro", "Nome completo é obrigatório.");
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
        Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
        router.replace(ROUTES.profile);
      } catch (error: any) {
        console.error("Erro ao atualizar perfil:", error);
        Alert.alert("Erro", error.message || "Não foi possível atualizar o perfil.");
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
        Alert.alert("Sucesso", "Foto de perfil atualizada.");
      } catch (error: unknown) {
        console.error("Erro ao alterar foto:", error);
        const msg =
          error instanceof Error
            ? error.message
            : "Não foi possível atualizar a foto de perfil.";
        Alert.alert("Erro", msg);
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
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="dark-content" backgroundColor="#FAF1E5" />

          <View style={styles.header}>
            <TouchableOpacity onPress={() => safeBack(router, ROUTES.profile)} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Editar Perfil</Text>
            <View style={{ width: 24 }} />
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6BC24A" />
            </View>
          ) : (
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* Avatar Header */}
              <TouchableOpacity
                style={styles.avatarSection}
                onPress={handleChangePhoto}
                disabled={uploadingAvatar}
                activeOpacity={0.8}
              >
              <View style={styles.avatarWrapper}>
                {avatarUri ? (
                  <Image
                    source={{ uri: avatarUri }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={styles.defaultAvatar}>
                    <Ionicons
                      name="person"
                      size={45}
                      color="#BDBDBD"
                    />
                  </View>
                )}

                <View style={styles.cameraIcon}>
                  {uploadingAvatar ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Ionicons
                      name="camera"
                      size={16}
                      color="#FFF"
                    />
                  )}
                </View>
              </View>
                <Text style={styles.avatarText}>
                  {uploadingAvatar ? "Enviando foto..." : "Alterar foto de perfil"}
                </Text>
              </TouchableOpacity>

              {/* Form */}
              <View style={styles.formContainer}>
                <Text style={styles.sectionTitle}>Informações Pessoais</Text>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Nome Completo *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                    placeholder="Seu nome"
                    placeholderTextColor="#CCC"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>E-mail (Não editável)</Text>
                  <TextInput
                    style={[styles.input, styles.inputDisabled]}
                    value={formData.email}
                    editable={false}
                    placeholder="Seu e-mail"
                    placeholderTextColor="#CCC"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Telefone</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.phone}
                    onChangeText={(text) => setFormData({ ...formData, phone: text })}
                    placeholder="(00) 00000-0000"
                    placeholderTextColor="#CCC"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>CPF</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.cpf}
                    onChangeText={(text) => setFormData({ ...formData, cpf: text })}
                    placeholder="000.000.000-00"
                    placeholderTextColor="#CCC"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Data de Nascimento</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.birthDate}
                    onChangeText={(text) => setFormData({ ...formData, birthDate: text })}
                    placeholder="AAAA-MM-DD"
                    placeholderTextColor="#CCC"
                  />
                </View>

                {/* Save Button */}
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
    content: {
      flex: 1,
      padding: 20,
    },
    defaultAvatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: '#F3F4F6',
      borderWidth: 3,
      borderColor: '#6BC24A',
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarSection: {
      alignItems: "center",
      marginVertical: 20,
    },
    avatarWrapper: {
      position: "relative",
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 3,
      borderColor: "#6BC24A",
    },
    cameraIcon: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: "#6BC24A",
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: "#FFF",
    },
    avatarText: {
      fontSize: 14,
      color: "#6BC24A",
      fontWeight: "600",
      marginTop: 8,
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
    inputDisabled: {
      backgroundColor: "#F5F5F5",
      borderColor: "#E5E5E5",
      color: "#999",
    },
    saveButton: {
      backgroundColor: "#6BC24A",
      paddingVertical: 14,
      borderRadius:50,
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

  });