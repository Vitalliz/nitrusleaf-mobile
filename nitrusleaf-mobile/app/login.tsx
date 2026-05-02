// app/login.tsx - LOGIN PAGE
import { Background } from "@/components/ui/background";
import { WelcomeTitle, WelcomeSubtitle } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LoginButton, GoogleButton2 } from "@/components/ui/button";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import React, { useEffect, useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import WaveBg from "@/assets/images/wave-bg.svg";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
    const router = useRouter();
    const { login, isLoading, isSignedIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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

    // Carregar o e-mail salvo ao abrir a tela
    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
        alert("Por favor, preencha email e senha");
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
        alert(e?.message ?? "Falha ao entrar.");
        }
    };

    const handleGoogleLogin = () => {
        // Login com Google - funcionalidade a ser implementada
        // Implementar login com Google aqui
    };

    const handleRegister = () => {
        router.push("/register");
    };

    return (
        <Background>
        <View style={styles.container}>
            {/* Botão de voltar e ícone da leaf */}
            <View style={styles.iconsBox}>
                <TouchableOpacity 
                    onPress={() => router.back()}
                    // Aumenta a área de clique em 20px para cada lado
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                >
                    <Ionicons name="chevron-back" size={24} color="black"/>
                </TouchableOpacity> 
            </View>
            
            {/* Formulário de login */}
            <View style={styles.form}>
            <View style={styles.titleBox}>
                <WelcomeTitle text="Bem vindo!"/>
                <WelcomeSubtitle text="Entre na sua conta"/>
            </View>
            
            <View style={styles.form}>
                <View style={styles.formInput}>
                <Text style={styles.label}>E-mail ou número de telefone</Text>
                <Input
                    placeholder="Digite seu e-mail ou número de telefone"
                    size="full"
                    variant="default"
                    value={email}
                    onChangeText={setEmail}
                />
                </View>
                
                {/*  */}
                <View style={styles.formInput}>
                <Text style={styles.label}>Senha</Text>
                <Input
                    placeholder="Digite sua senha"
                    secureTextEntry={true} 
                    value={password}
                    onChangeText={setPassword}
                />
                </View>
            </View>
            </View>

            {/* Checkbox "Lembre-se de mim" e "Esqueci a senha" */}
            <View style={{ width: "100%" }}>
            <View style={styles.optionsRow}>
                <TouchableOpacity 
                style={styles.rememberMe} 
                onPress={() => setRememberMe(!rememberMe)} // Toggle do checkbox
                activeOpacity={0.7}
                >
                <View style={[
                    styles.checkbox, 
                    rememberMe && { backgroundColor: '#6BC24A', borderColor: '#6BC24A' } // Cor quando marcado
                ]}>
                    {rememberMe && <Ionicons name="checkmark" size={12} color="white" />}
                </View>
                <Text style={styles.rememberText}>Lembre-se de mim</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                <Text style={styles.forgotPassword}>Esqueci a senha</Text>
                </TouchableOpacity>
            </View>
            
            {/* Botão de login (Entrar) */}
            <LoginButton  onPress={handleLogin} disabled={isLoading} />

            <View style={styles.divider}>
                <View style={styles.line} />
                <Text style={styles.orText}>ou</Text>
                <View style={styles.line} />
            </View>

            <GoogleButton2 onPress={handleGoogleLogin} />
            </View>
            
            {/* Link para cadastro */}
            <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
                Não possui uma conta?{" "}
            </Text>
            <TouchableOpacity onPress={handleRegister}>
                <Text style={styles.registerLink}>Fazer cadastro</Text>
            </TouchableOpacity>
            </View>
        </View>

        {/* Onda laranja na base (ao fundo) */}
        <View style={styles.waveContainer}>
            <WaveBg width="100%" height={140} />
        </View>

        </Background>
    );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 25,
    paddingTop: 70,
    gap: 10
},
titleBox: {
    width: "100%",
    alignItems: "flex-start",
    gap: 5,
    marginBottom: 25
},
iconsBox: {
    width: "100%",
    alignItems: "flex-start",
    gap: 35,
    marginVertical: 25
},
form: {
    width: "100%",
    alignItems: "flex-start",
    gap: 5
},
formInput: {
    width: "100%",
    alignItems: "flex-start"
},
label: {
    fontSize: 16,
    color: "#2B2B2B",
    alignSelf: "flex-start",
    marginLeft: 6,
    fontWeight: "500",
},
registerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
},
registerText: {
    fontSize: 14,
    color: "#666",
},
registerLink: {
    fontSize: 14,
    color: "#6BC24A",
    fontWeight: "600",
},

// Divider dos botões
divider: {
flexDirection: "row",
alignItems: "center",
marginVertical: 16,
width: "100%",
},

line: {
    flex: 1,
    height: 1,
    backgroundColor: "#98979F",
},

orText: {
    marginHorizontal: 10,
    color: "#98979F",
},

// Select "Lembre-se de mim" e "Esqueci a senha"
optionsRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
    marginBottom: 25
},

rememberMe: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
},

checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: "#a39a9a",
    backgroundColor: "white",
    borderRadius: 4,
    justifyContent: 'center', // Centraliza o ícone de check
    alignItems: 'center',
},

rememberText: {
    fontSize: 14,
    color: "#666",
},

forgotPassword: {
    fontSize: 14,
    color: "#2F80ED",
},
// Footer
waveContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    bottom: -10
},
});
