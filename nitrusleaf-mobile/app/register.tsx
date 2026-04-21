import { Background } from "@/components/ui/background";
import { WelcomeSubtitle, WelcomeTitle } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LoginButton } from "@/components/ui/button";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import Leaf from "@/assets/images/leaf.svg";
import WaveBg from "@/assets/images/wave-bg.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";

const REGISTER_DRAFT_KEY = "@nitrusleaf_register_draft_v1";

type RegisterDraft = {
  v: 1;
  step: number;
  name: string;
  lastName: string;
  cpf: string;
  phone: string;
  propName: string;
  cep: string;
  city: string;
  street: string;
  number: string;
  neighborhood: string;
  email: string;
};

export default function RegisterScreen() {
  const router = useRouter();
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

  /** Evita redirecionar para home no meio do submit: o listener de auth pode setar sessão antes do UPDATE do perfil. */
  const isSubmittingRegistrationRef = useRef(false);
  const draftRestoredRef = useRef(false);

  const persistDraft = useCallback(async () => {
    const draft: RegisterDraft = {
      v: 1,
      step,
      name,
      lastName,
      cpf,
      phone,
      propName,
      cep,
      city,
      street,
      number,
      neighborhood,
      email,
    };
    try {
      await AsyncStorage.setItem(REGISTER_DRAFT_KEY, JSON.stringify(draft));
    } catch {
      /* ignore */
    }
  }, [
    step,
    name,
    lastName,
    cpf,
    phone,
    propName,
    cep,
    city,
    street,
    number,
    neighborhood,
    email,
  ]);

  useEffect(() => {
    if (draftRestoredRef.current) return;
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(REGISTER_DRAFT_KEY);
        if (cancelled || !raw) {
          draftRestoredRef.current = true;
          return;
        }
        const d = JSON.parse(raw) as RegisterDraft;
        if (d?.v !== 1) {
          draftRestoredRef.current = true;
          return;
        }
        setStep(Math.min(4, Math.max(1, Number(d.step) || 1)));
        setName(typeof d.name === "string" ? d.name : "");
        setLastName(typeof d.lastName === "string" ? d.lastName : "");
        setCpf(typeof d.cpf === "string" ? d.cpf : "");
        setPhone(typeof d.phone === "string" ? d.phone : "");
        setPropName(typeof d.propName === "string" ? d.propName : "");
        setCep(typeof d.cep === "string" ? d.cep : "");
        setCity(typeof d.city === "string" ? d.city : "");
        setStreet(typeof d.street === "string" ? d.street : "");
        setNumber(typeof d.number === "string" ? d.number : "");
        setNeighborhood(typeof d.neighborhood === "string" ? d.neighborhood : "");
        setEmail(typeof d.email === "string" ? d.email : "");
      } catch {
        /* ignore */
      } finally {
        draftRestoredRef.current = true;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!draftRestoredRef.current) return;
    const t = setTimeout(() => {
      void persistDraft();
    }, 400);
    return () => clearTimeout(t);
  }, [persistDraft]);

  useEffect(() => {
    if (isSignedIn && !isSubmittingRegistrationRef.current) {
      router.replace("/(tabs)/home");
    }
  }, [isSignedIn, router]);

  const handleNext = async () => {
    if (step === 1) {
      if (!name.trim() || !lastName.trim()) {
        Alert.alert("Cadastro", "Preencha nome e sobrenome.");
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!propName.trim()) {
        Alert.alert("Cadastro", "Informe o nome da propriedade.");
        return;
      }
      setStep(3);
      return;
    }
    if (step === 3) {
      if (
        !cep.trim() ||
        !city.trim() ||
        !street.trim() ||
        !number.trim() ||
        !neighborhood.trim()
      ) {
        Alert.alert(
          "Cadastro",
          "Preencha CEP, cidade, logradouro, número e bairro da propriedade."
        );
        return;
      }
      const n = parseInt(String(number).replace(/\D/g, ""), 10);
      if (!Number.isFinite(n) || n < 0) {
        Alert.alert("Cadastro", "Informe um número válido no endereço.");
        return;
      }
      setStep(4);
      return;
    }
    await handleRegister();
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleRegister = async () => {
    try {
      if (!email.trim() || !password.trim()) {
        Alert.alert("Cadastro", "Preencha e-mail e senha.");
        return;
      }
      if (password !== passwordConfirmation) {
        Alert.alert("Cadastro", "As senhas não conferem.");
        return;
      }
      if (!name.trim() || !lastName.trim()) {
        Alert.alert("Cadastro", "Informe nome e sobrenome (volte à primeira etapa se necessário).");
        return;
      }
      if (
        !propName.trim() ||
        !cep.trim() ||
        !city.trim() ||
        !street.trim() ||
        !number.trim() ||
        !neighborhood.trim()
      ) {
        Alert.alert(
          "Cadastro",
          "Complete os dados da propriedade nas etapas anteriores."
        );
        return;
      }
      const numeroParsed = parseInt(String(number).replace(/\D/g, ""), 10);
      if (!Number.isFinite(numeroParsed) || numeroParsed < 0) {
        Alert.alert("Cadastro", "Informe um número válido no endereço da propriedade.");
        return;
      }

      isSubmittingRegistrationRef.current = true;

      await register({
        name: name.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        cpf: cpf.trim(),
        password,
        passwordConfirmation,
        property: {
          name: propName.trim(),
          cep: cep.replace(/\D/g, "") || cep.trim(),
          city: city.trim(),
          street: street.trim(),
          number: numeroParsed,
          neighborhood: neighborhood.trim(),
        },
      });

      await AsyncStorage.removeItem(REGISTER_DRAFT_KEY);
      router.replace("/(tabs)/home");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Erro ao cadastrar.";
      Alert.alert("Cadastro", message);
    } finally {
      isSubmittingRegistrationRef.current = false;
    }
  };

  return (
    <Background>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <View style={styles.iconsBox}>
            <TouchableOpacity onPress={handleBack} hitSlop={20}>
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
            <Leaf width={45} height={45} />
          </View>

          <View style={styles.form}>
            {step === 1 && (
              <View style={styles.stepContainer}>
                <WelcomeTitle text="Cadastro" />
                <WelcomeSubtitle text="Dados Pessoais" />
                <Text style={[styles.label, { marginTop: 25 }]}>Nome</Text>
                <Input placeholder="Nome" value={name} onChangeText={setName} />
                <Text style={styles.label}>Sobrenome</Text>
                <Input
                  placeholder="Sobrenome"
                  value={lastName}
                  onChangeText={setLastName}
                />
                <Text style={styles.label}>CPF</Text>
                <Input placeholder="000.000.000-00" value={cpf} onChangeText={setCpf} />
                <Text style={styles.label}>Telefone</Text>
                <Input
                  placeholder="(xx) xxxxx-xxxx"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            )}

            {step === 2 && (
              <View style={styles.stepContainer}>
                <WelcomeTitle text="Cadastro" />
                <WelcomeSubtitle text="Dados da Propriedade" />
                <View style={styles.propertyContainer}>
                  <Text style={styles.infoText}>
                    Informe o nome da sua propriedade para começar.
                  </Text>
                  <Text style={styles.label}>Nome da Propriedade</Text>
                  <Input
                    placeholder="Nome da fazenda, sítio.."
                    value={propName}
                    onChangeText={setPropName}
                  />
                  <View style={{ width: "100%", marginTop: 20 }}>
                    <LoginButton
                      onPress={handleNext}
                      disabled={isAuthPending}
                      title="Continuar"
                    />
                  </View>
                </View>
              </View>
            )}

            {step === 3 && (
              <View style={styles.stepContainer}>
                <WelcomeTitle text="Cadastro" />
                <WelcomeSubtitle text="Dados da Propriedade" />
                <Text style={[styles.label, { marginTop: 25 }]}>CEP</Text>
                <Input placeholder="00000-000" value={cep} onChangeText={setCep} />
                <Text style={styles.label}>Cidade</Text>
                <Input placeholder="Sua cidade" value={city} onChangeText={setCity} />

                <View style={styles.row}>
                  <View style={{ flex: 3 }}>
                    <Text style={styles.label}>Logradouro</Text>
                    <Input placeholder="Rua/Av" value={street} onChangeText={setStreet} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.label}>Número</Text>
                    <Input placeholder="Nº" value={number} onChangeText={setNumber} />
                  </View>
                </View>

                <Text style={styles.label}>Bairro</Text>
                <Input
                  placeholder="Bairro"
                  value={neighborhood}
                  onChangeText={setNeighborhood}
                />
              </View>
            )}

            {step === 4 && (
              <View style={styles.stepContainer}>
                <WelcomeTitle text="Bem vindo!" />
                <WelcomeSubtitle text="Cadastre-se" />
                <Text style={[styles.label, { marginTop: 25 }]}>E-mail</Text>
                <Input
                  placeholder="email@exemplo.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
                <Text style={styles.label}>Senha</Text>
                <Input
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                <Text style={styles.label}>Confirmar senha</Text>
                <Input
                  placeholder="Repita a senha"
                  value={passwordConfirmation}
                  onChangeText={setPasswordConfirmation}
                  secureTextEntry
                />
              </View>
            )}

            {step !== 2 && (
              <View style={{ width: "100%", marginTop: 20 }}>
                <LoginButton
                  onPress={handleNext}
                  disabled={isAuthPending}
                  title={step === 4 ? "Criar conta" : "Continuar"}
                />
              </View>
            )}

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Já possui uma conta? </Text>
              <TouchableOpacity onPress={() => router.replace("/login")}>
                <Text style={styles.loginLink}>Entrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.waveContainer} pointerEvents="none">
        <WaveBg width="100%" height={140} />
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 38,
  },
  iconsBox: {
    width: "100%",
    alignItems: "flex-start",
    gap: 35,
    marginVertical: 25,
  },
  stepContainer: {
    width: "100%",
  },
  form: {
    width: "100%",
    flex: 1,
    minHeight: 400,
  },
  propertyContainer: {
    width: "100%",
    justifyContent: "center",
    paddingVertical: 120,
  },
  label: {
    fontSize: 14,
    color: "#2B2B2B",
    fontWeight: "600",
    marginTop: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    width: "100%",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    zIndex: 10,
  },
  loginText: { color: "#666" },
  loginLink: { color: "#6BC24A", fontWeight: "700" },
  waveContainer: {
    position: "absolute",
    bottom: -10,
    left: 0,
    right: 0,
  },
});
