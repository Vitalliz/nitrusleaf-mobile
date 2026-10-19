import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Background } from "@/components/ui/background";
import { LoginButton, GoogleButton2 } from "@/components/ui/button";
import { CustomAlert, AlertType } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES, safeBack } from "@/utils/navigation";
import { Palette, FontWeights, FontSizes } from "@/constants/theme";

export default function LoginScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { login, isAuthPending, isSignedIn } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Estado do Alert 
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertData, setAlertData] = useState<{
        title: string;
        message: string;
        type: AlertType;
    }>({
        title: "",
        message: "",
        type: "error",
    });

    const showAlert = (title: string, message: string, type: AlertType = "error") => {
        setAlertData({ title, message, type });
        setAlertVisible(true);
    };

    useEffect(() => {
        if (isSignedIn) router.replace("/(tabs)/AI/home");
    }, [isSignedIn, router]);

    useEffect(() => {
        const loadRememberedEmail = async () => {
        try {
            const savedEmail = await AsyncStorage.getItem("@user_email");
            if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
            }
        } catch (e) {
            console.error("Erro ao carregar e-mail salvo", e);
        }
        };
        loadRememberedEmail();
    }, []);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
        showAlert(
            "Atenção",
            "Por favor, preencha o e-mail e a senha para continuar.",
            "warning"
        );
        return;
        }

        try {
        if (rememberMe) {
            await AsyncStorage.setItem("@user_email", email);
        } else {
            await AsyncStorage.removeItem("@user_email");
        }

        await login(email, password);
        router.replace("/(tabs)/AI/home");
        } catch (e: any) {
        showAlert(
            "Falha ao entrar",
            e?.message ?? "E-mail ou senha incorretos. Verifique e tente novamente.",
            "error"
        );
        }
    };

    const handleGoogleLogin = () => {
        // Integração do Google
    };

    const handleRegister = () => {
        router.push("/register");
    };

    return (
        <Background>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardContainer}
            >
                <ScrollView
                contentContainerStyle={[
                    styles.scrollContainer,
                    {
                    paddingTop: Math.max(insets.top, 16),
                    paddingBottom: Math.max(insets.bottom, 16) + 12,
                    },
                ]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                >
                <View style={styles.centerSection}>
                    <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => safeBack(router, ROUTES.welcome)}
                    hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                    >
                    <Ionicons name="chevron-back" size={26} color={Palette.textPrimary} />
                    </TouchableOpacity>

                    <View style={styles.header}>
                    <Text style={styles.title}>Bem-vindo!</Text>
                    <Text style={styles.subtitle}>Entre na sua conta</Text>
                    </View>

                    <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>E-mail</Text>
                        <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite seu e-mail"
                            placeholderTextColor={Palette.textSecondary}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Senha</Text>
                        <View style={styles.inputContainer}>
                        <TextInput
                            style={[styles.input, { paddingRight: 45 }]}
                            placeholder="Digite sua senha"
                            placeholderTextColor={Palette.textSecondary}
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setShowPassword(!showPassword)}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons
                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                            size={20}
                            color={Palette.textSecondary}
                            />
                        </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.optionsRow}>
                        <TouchableOpacity
                        style={styles.rememberMe}
                        onPress={() => setRememberMe(!rememberMe)}
                        activeOpacity={0.7}
                        >
                        <View
                            style={[
                            styles.checkbox,
                            rememberMe && {
                                backgroundColor: Palette.primary,
                                borderColor: Palette.primary,
                            },
                            ]}
                        >
                            {rememberMe && (
                            <Ionicons name="checkmark" size={13} color={Palette.white} />
                            )}
                        </View>
                        <Text style={styles.rememberText}>Lembre-se de mim</Text>
                        </TouchableOpacity>

                        <TouchableOpacity>
                        <Text style={styles.forgotPassword}>Esqueci a senha</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.actionGroup}>
                        <LoginButton onPress={handleLogin} disabled={isAuthPending} />

                        <View style={styles.divider}>
                        <View style={styles.line} />
                        <Text style={styles.orText}>ou</Text>
                        <View style={styles.line} />
                        </View>

                        <GoogleButton2 onPress={handleGoogleLogin} />
                    </View>
                    </View>
                </View>

                <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>Não possui uma conta? </Text>
                    <TouchableOpacity onPress={handleRegister}>
                    <Text style={styles.registerLink}>Fazer cadastro</Text>
                    </TouchableOpacity>
                </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <CustomAlert
                visible={alertVisible}
                title={alertData.title}
                message={alertData.message}
                type={alertData.type}
                onClose={() => setAlertVisible(false)}
            />
        </Background>
    );
}

const styles = StyleSheet.create({
    keyboardContainer: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "space-between",
        paddingHorizontal: 28,
    },
    centerSection: {
        flex: 1,
        justifyContent: "center",
        width: "100%",
    },
    backButton: {
        alignSelf: "flex-start",
        marginBottom: 20,
    },
    header: {
        marginBottom: 28,
        gap: 4,
    },
    title: {
        fontSize: FontSizes["3xl"],
        fontWeight: FontWeights.bold,
        color: Palette.textPrimary,
    },
    subtitle: {
        fontSize: FontSizes["2xl"],
        fontWeight: FontWeights.semiBold,
        color: Palette.textSecondary,
    },
    form: {
        width: "100%",
        gap: 16,
    },
    inputGroup: {
        width: "100%",
        gap: 8,
    },
    label: {
        fontSize: FontSizes.base,
        fontWeight: FontWeights.semiBold,
        color: Palette.textPrimary,
    },
    inputContainer: {
        position: "relative",
        width: "100%",
        height: 48,
        borderWidth: 1,
        borderColor: Palette.borderDisabled,
        borderRadius: 8,
        backgroundColor: Palette.surfaceGray,
        justifyContent: "center",
    },
    input: {
        flex: 1,
        paddingHorizontal: 14,
        fontSize: FontSizes.base,
        color: Palette.textPrimary,
    },
    eyeIcon: {
        position: "absolute",
        right: 14,
        justifyContent: "center",
        alignItems: "center",
    },
    optionsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 2,
        marginBottom: 8,
    },
    rememberMe: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1.5,
        borderColor: Palette.borderDisabled,
        backgroundColor: Palette.white,
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
    },
    rememberText: {
        fontSize: FontSizes.sm,
        color: Palette.textPrimary,
    },
    forgotPassword: {
        fontSize: FontSizes.sm,
        color: Palette.primary,
        fontWeight: FontWeights.medium,
    },
    actionGroup: {
        width: "100%",
        gap: 14,
        marginTop: 6,
    },
    divider: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: Palette.borderDisabled,
    },
    orText: {
        marginHorizontal: 12,
        fontSize: FontSizes.sm,
        color: Palette.textSecondary,
    },
    registerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 16,
    },
    registerText: {
        fontSize: FontSizes.base,
        color: Palette.textPrimary,
    },
    registerLink: {
        fontSize: FontSizes.base,
        color: Palette.primary,
        fontWeight: FontWeights.medium,
        textDecorationLine: "underline",
    },
});