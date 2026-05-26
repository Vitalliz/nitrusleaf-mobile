// app/(tabs)/Settings/account-config.tsx — Configurações da Conta
import React, { useState, useEffect } from "react";
import {
    View,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
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
    updateUsuarioPassword,
    deleteUsuario,
} from "@/repositories/profileRepository";
import { Background } from "@/components/ui/background";

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

    useEffect(() => {
        async function loadData() {
        if (!user?.id) return;
        try {
            const details = await getUsuarioDetails(user.id);
            if (details) setEmail(details.email || "");
        } catch (error) {
            console.error("Erro ao carregar conta:", error);
            Alert.alert("Erro", "Não foi possível carregar os dados da conta.");
        } finally {
            setLoading(false);
        }
        }
        void loadData();
    }, [user]);

    const handleSave = async () => {
        if (!user?.id) return;
        if (!currentPassword.trim()) {
        Alert.alert("Erro", "Informe sua senha atual.");
        return;
        }
        if (!newPassword.trim()) {
        Alert.alert("Erro", "Informe a nova senha.");
        return;
        }
        if (newPassword.length < 6) {
        Alert.alert("Erro", "A nova senha deve ter ao menos 6 caracteres.");
        return;
        }

    setSaving(true);
        try {
        await updateUsuarioPassword(user.id, currentPassword, newPassword);
        Alert.alert("Sucesso", "Senha atualizada com sucesso!");
        setCurrentPassword("");
        setNewPassword("");
        } catch (error: any) {
        console.error("Erro ao atualizar senha:", error);
        Alert.alert("Erro", error.message || "Não foi possível atualizar a senha.");
        } finally {
        setSaving(false);
        }
    };

    const handleDeleteAccount = () => {
        Alert.alert(
        "Excluir Conta",
        "Tem certeza que deseja excluir sua conta permanentemente? Essa ação é irreversível e excluirá todos os seus dados.",
        [
            { text: "Cancelar", style: "cancel" },
            {
            text: "Excluir permanentemente",
            style: "destructive",
            onPress: async () => {
                if (!user?.id) return;
                try {
                setSaving(true);
                await deleteUsuario(user.id);
                await logout();
                Alert.alert("Conta Excluída", "Sua conta foi excluída com sucesso.");
                router.replace("/login");
                } catch (error: any) {
                console.error("Erro ao excluir conta:", error);
                Alert.alert("Erro", error.message || "Não foi possível excluir a conta. Entre em contato com o suporte.");
                } finally {
                setSaving(false);
                }
            },
            },
        ]
        );
    };

    return (
        <Background>
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#FAF1E5" />

            {/* Header */}
            <View style={styles.header}>
            <TouchableOpacity onPress={() => safeBack(router, ROUTES.profile)} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Configurações da Conta</Text>
            <View style={{ width: 24 }} />
            </View>

            {loading ? (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6BC24A" />
            </View>
            ) : (
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

                {/* Seção de credenciais */}
                <View style={styles.formContainer}>
                <Text style={styles.sectionTitle}>Credenciais de Acesso</Text>

                {/* Email */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>E-mail (Não editável)</Text>
                    <TextInput
                    style={[styles.input, styles.inputDisabled]}
                    value={email}
                    editable={false}
                    placeholderTextColor="#CCC"
                    />
                </View>

                {/* Senha atual */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Senha Atual</Text>
                    <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.inputWithIcon}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        placeholder="Digite sua senha atual"
                        placeholderTextColor="#CCC"
                        secureTextEntry={!showCurrent}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity
                        onPress={() => setShowCurrent(!showCurrent)}
                        style={styles.eyeButton}
                    >
                        <Ionicons
                        name={showCurrent ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color="#888"
                        />
                    </TouchableOpacity>
                    </View>
                </View>

                {/* Nova senha */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Nova Senha</Text>
                    <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.inputWithIcon}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="Digite a nova senha"
                        placeholderTextColor="#CCC"
                        secureTextEntry={!showNew}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity
                        onPress={() => setShowNew(!showNew)}
                        style={styles.eyeButton}
                    >
                        <Ionicons
                        name={showNew ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color="#888"
                        />
                    </TouchableOpacity>
                    </View>
                </View>

                {/* Botão salvar */}
                <TouchableOpacity
                    style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                    <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                    <Text style={styles.saveButtonText}>Confirmar Alterações</Text>
                    )}
                </TouchableOpacity>
                </View>

                {/* Zona de perigo */}
                <View style={styles.dangerZone}>
                <Text style={styles.dangerTitle}>Zona de Risco</Text>
                <Text style={styles.dangerDesc}>
                    A exclusão da conta apagará permanentemente todos os seus dados pessoais, históricos e análises cadastradas.
                </Text>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDeleteAccount}
                    disabled={saving}
                >
                    <Ionicons name="trash-outline" size={20} color="#E53E3E" />
                    <Text style={styles.deleteButtonText}>Excluir Minha Conta</Text>
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
    inputDisabled: {
        backgroundColor: "#F5F5F5",
        borderColor: "#E5E5E5",
        color: "#999",
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: "#E8D7BD",
        borderRadius: 8,
        backgroundColor: "#FFFFFF",
    },
    inputWithIcon: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 15,
        color: "#2B2B2B",
    },
    eyeButton: {
        paddingHorizontal: 12,
    },
    saveButton: {
        backgroundColor: "#6BC24A",
        paddingVertical: 14,
        borderRadius: 8,
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
    dangerZone: {
        backgroundColor: "#FFF5F5",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#FED7D7",
        marginBottom: 40,
    },
    dangerTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#C53030",
        marginBottom: 8,
    },
    dangerDesc: {
        fontSize: 13,
        color: "#742A2A",
        marginBottom: 16,
        lineHeight: 18,
    },
    deleteButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: "#E53E3E",
    },
    deleteButtonText: {
        color: "#E53E3E",
        fontSize: 15,
        fontWeight: "600",
    },
    spacer: {
        height: 40,
    },
});