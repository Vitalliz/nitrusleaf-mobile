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
import MaskInput, { Masks } from "react-native-mask-input";

import { Background } from "@/components/ui/background";
import { LoginButton, GoogleButton2 } from "@/components/ui/button";
import { CustomAlert, AlertType } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES, safeBack } from "@/utils/navigation";
import { Palette, FontSizes, FontWeights } from "@/constants/theme";

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { register, isAuthPending, isSignedIn } = useAuth();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");

  const [propName, setPropName] = useState("");
  const [cep, setCep] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  // Estado do Alert Estilizado
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

  const handleNext = async () => {
    // Validações por etapa
    if (step === 1) {
      if (!name.trim() || !lastName.trim() || !cpf.trim() || !phone.trim()) {
        showAlert("Atenção", "Por favor, preencha todos os dados pessoais.", "warning");
        return;
      }
    }

    if (step === 2) {
      if (!propName.trim()) {
        showAlert("Atenção", "Por favor, informe o nome da propriedade.", "warning");
        return;
      }
    }

    if (step === 3) {
      if (!cep.trim() || !city.trim() || !street.trim() || !number.trim() || !neighborhood.trim()) {
        showAlert("Atenção", "Por favor, preencha o endereço completo da propriedade.", "warning");
        return;
      }
    }

    if (step < 4) {
      setStep(step + 1);
    } else {
      await handleRegister();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      safeBack(router, ROUTES.welcome);
    }
  };

  const handleRegister = async () => {
    try {
      if (!email.trim() || !password.trim() || !passwordConfirmation.trim()) {
        showAlert("Atenção", "Preencha todos os dados de acesso.", "warning");
        return;
      }

      if (password !== passwordConfirmation) {
        showAlert("Erro", "As senhas não coincidem.", "error");
        return;
      }

      await register({
        name,
        lastName,
        email,
        phone,
        cpf,
        password,
        passwordConfirmation,
        property: {
          name: propName,
          cep,
          city,
          street,
          number: Number(number) || 0,
          neighborhood,
        },
      });

      router.replace("/(tabs)/AI/home");
    } catch (e: any) {
      showAlert("Falha no cadastro", e?.message ?? "Erro ao realizar o cadastro.", "error");
    }
  };

  const handleGoogleRegister = () => {
    // Integração com Google
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
              onPress={handleBack}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
              <Ionicons name="chevron-back" size={26} color={Palette.textPrimary} />
            </TouchableOpacity>

            {/* Passo 1: Dados Pessoais */}
            {step === 1 && (
              <View style={styles.stepContainer}>
                <View style={styles.header}>
                  <Text style={styles.title}>Cadastro</Text>
                  <Text style={styles.subtitle}>Dados Pessoais</Text>
                </View>

                <View style={styles.form}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nome</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="Digite seu nome"
                        placeholderTextColor={Palette.textSecondary}
                        value={name}
                        onChangeText={setName}
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Sobrenome</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="Digite seu sobrenome"
                        placeholderTextColor={Palette.textSecondary}
                        value={lastName}
                        onChangeText={setLastName}
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>CPF</Text>
                    <View style={styles.inputContainer}>
                      <MaskInput
                        style={styles.input}
                        placeholder="000.000.000-00"
                        placeholderTextColor={Palette.textSecondary}
                        value={cpf}
                        onChangeText={(masked) => setCpf(masked)}
                        mask={Masks.BRL_CPF}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Telefone</Text>
                    <View style={styles.inputContainer}>
                      <MaskInput
                        style={styles.input}
                        placeholder="(xx) xxxxx-xxxx"
                        placeholderTextColor={Palette.textSecondary}
                        value={phone}
                        onChangeText={(masked) => setPhone(masked)}
                        mask={Masks.BRL_PHONE}
                        keyboardType="phone-pad"
                      />
                    </View>
                  </View>

                  <View style={styles.actionGroup}>
                    <LoginButton
                      onPress={handleNext}
                      disabled={isAuthPending}
                      title="Continuar"
                    />

                    <View style={styles.divider}>
                      <View style={styles.line} />
                      <Text style={styles.orText}>ou</Text>
                      <View style={styles.line} />
                    </View>

                    <GoogleButton2
                      onPress={handleGoogleRegister}
                    />
                  </View>
                </View>
              </View>
            )}

            {/* Passo 2: Nome da Propriedade */}
            {step === 2 && (
              <View style={styles.stepContainer}>
                <View style={styles.header}>
                  <Text style={styles.title}>Cadastro</Text>
                  <Text style={styles.subtitle}>Dados da Propriedade</Text>
                </View>

                <View style={styles.form}>
                  <Text style={styles.infoText}>
                    Informe o nome da sua propriedade para começar.
                  </Text>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nome da Propriedade</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="Nome da fazenda, sítio..."
                        placeholderTextColor={Palette.textSecondary}
                        value={propName}
                        onChangeText={setPropName}
                      />
                    </View>
                  </View>

                  <View style={styles.actionGroup}>
                    <LoginButton
                      onPress={handleNext}
                      disabled={isAuthPending}
                      title="Continuar"
                    />
                  </View>
                </View>
              </View>
            )}

            {/* Passo 3: Endereço da Propriedade */}
            {step === 3 && (
              <View style={styles.stepContainer}>
                <View style={styles.header}>
                  <Text style={styles.title}>Cadastro</Text>
                  <Text style={styles.subtitle}>Dados da Propriedade</Text>
                </View>

                <View style={styles.form}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>CEP</Text>
                    <View style={styles.inputContainer}>
                      <MaskInput
                        style={styles.input}
                        placeholder="00000-000"
                        placeholderTextColor={Palette.textSecondary}
                        value={cep}
                        onChangeText={(masked) => setCep(masked)}
                        mask={Masks.ZIP_CODE}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Cidade</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="Sua cidade"
                        placeholderTextColor={Palette.textSecondary}
                        value={city}
                        onChangeText={setCity}
                      />
                    </View>
                  </View>

                  <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 3 }]}>
                      <Text style={styles.label}>Logradouro</Text>
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.input}
                          placeholder="Rua / Av."
                          placeholderTextColor={Palette.textSecondary}
                          value={street}
                          onChangeText={setStreet}
                        />
                      </View>
                    </View>

                    <View style={[styles.inputGroup, { flex: 1.2, marginLeft: 10 }]}>
                      <Text style={styles.label}>Número</Text>
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.input}
                          placeholder="N°"
                          placeholderTextColor={Palette.textSecondary}
                          value={number}
                          onChangeText={setNumber}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Bairro</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="Bairro"
                        placeholderTextColor={Palette.textSecondary}
                        value={neighborhood}
                        onChangeText={setNeighborhood}
                      />
                    </View>
                  </View>

                  <View style={styles.actionGroup}>
                    <LoginButton
                      onPress={handleNext}
                      disabled={isAuthPending}
                      title="Continuar"
                    />
                  </View>
                </View>
              </View>
            )}

            {/* Passo 4: Acesso */}
            {step === 4 && (
              <View style={styles.stepContainer}>
                <View style={styles.header}>
                  <Text style={styles.title}>Bem-vindo!</Text>
                  <Text style={styles.subtitle}>Cadastre-se</Text>
                </View>

                <View style={styles.form}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>E-mail</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="email@exemplo.com"
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
                        style={styles.input}
                        placeholder="Mínimo 8 caracteres"
                        placeholderTextColor={Palette.textSecondary}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Confirmar senha</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="Repita a senha"
                        placeholderTextColor={Palette.textSecondary}
                        value={passwordConfirmation}
                        onChangeText={setPasswordConfirmation}
                        secureTextEntry
                      />
                    </View>
                  </View>

                  <View style={styles.actionGroup}>
                    <LoginButton
                      onPress={handleNext}
                      disabled={isAuthPending}
                      title="Criar conta"
                    />
                  </View>
                </View>
              </View>
            )}
          </View>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Já possui uma conta? </Text>
            <TouchableOpacity onPress={() => router.replace("/login")}>
              <Text style={styles.loginLink}>Entrar</Text>
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
  stepContainer: {
    width: "100%",
  },
  header: {
    marginBottom: 26,
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
  row: {
    flexDirection: "row",
    width: "100%",
  },
  infoText: {
    fontSize: FontSizes.base,
    color: Palette.textSecondary,
    marginBottom: 4,
  },
  actionGroup: {
    width: "100%",
    gap: 14,
    marginTop: 10,
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  loginText: {
    fontSize: FontSizes.base,
    color: Palette.textPrimary,
  },
  loginLink: {
    fontSize: FontSizes.base,
    color: Palette.info,
    fontWeight: FontWeights.medium,
    textDecorationLine: "underline",
  },
});