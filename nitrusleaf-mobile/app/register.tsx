import { Background } from "@/components/ui/background";
import { WelcomeSubtitle, WelcomeTitle } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LoginButton } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import Ionicons from '@expo/vector-icons/Ionicons';
import Leaf from "@/assets/images/leaf.svg";
import WaveBg from "@/assets/images/wave-bg.svg";

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, isSignedIn } = useAuth();

  // CONTROLE DE ETAPA (1 a 4)
  const [step, setStep] = useState(1);

  // ESTADOS DOS CAMPOS
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  
  const [propName, setPropName] = useState(""); // Nome da Propriedade
  
  const [cep, setCep] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  useEffect(() => {
    if (isSignedIn) router.replace("/(tabs)/home");
  }, [isSignedIn, router]);

  // Lógica para avançar ou finalizar
  const handleNext = async () => {
    if (step < 4) {
      // Adicionar validações específicas por step se necessario
      setStep(step + 1);
    } else {
      await handleRegister();
    }
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
        alert("Preencha os dados de acesso.");
        return;
      }
      // Chame sua API enviando todos os estados acumulados
      await register({
        name, lastName, email, phone, cpf, password, passwordConfirmation,
        // adicione propName, cep, etc, se o seu context suportar
      });
      router.replace("/(tabs)/home");
    } catch (e: any) {
      alert(e?.message ?? "Erro ao cadastrar.");
    }
  };

  return (
    <Background>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          
          {/* HEADER COM VOLTAR E LOGO */}
          <View style={styles.iconsBox}>
            <TouchableOpacity onPress={handleBack} hitSlop={20}>
              <Ionicons name="chevron-back" size={24} color="black"/>
            </TouchableOpacity>
            <Leaf width={45} height={45} />  
          </View>

          <View style={styles.form}>
            {/* ETAPA 1: DADOS PESSOAIS */}
            {step === 1 && (
              <View style={styles.stepContainer}>
                <WelcomeTitle text="Cadastro"/>
                <WelcomeSubtitle text="Dados Pessoais"/>
                <Text style={[styles.label, { marginTop: 25 }]}>Nome</Text>
                <Input placeholder="Nome" value={name} onChangeText={setName}/>
                <Text style={styles.label}>Sobrenome</Text>
                <Input placeholder="Sobrenome" value={lastName} onChangeText={setLastName}/>
                <Text style={styles.label}>CPF</Text>
                <Input placeholder="000.000.000-00" value={cpf} onChangeText={setCpf}/>
                <Text style={styles.label}>Telefone</Text>
                <Input placeholder="(xx) xxxxx-xxxx" value={phone} onChangeText={setPhone}/>
              </View>
            )}

            {/* ETAPA 2: NOME DA PROPRIEDADE */}
            {step === 2 && (
              <View style={styles.stepContainer}>
                <WelcomeTitle text="Cadastro"/>
                <WelcomeSubtitle text="Dados da Propriedade"/>
                <View style={styles.propertyContainer}>
                  <Text style={styles.infoText}>Informe o nome da sua propriedade para começar.</Text>
                  <Text style={styles.label}>Nome da Propriedade</Text>
                  <Input placeholder="Nome da fazenda, sítio.." value={propName} onChangeText={setPropName}/>
                  <View style={{ width: '100%', marginTop: 20 }}>
                    <LoginButton 
                      onPress={handleNext} 
                      disabled={isLoading} 
                      title="Continuar" 
                    />
                  </View>
                </View>
              </View>
            )}

            {/* ETAPA 3: ENDEREÇO DA PROPRIEDADE */}
            {step === 3 && (
              <View style={styles.stepContainer}>
                <WelcomeTitle text="Cadastro"/>
                <WelcomeSubtitle text="Dados da Propriedade"/>
                <Text style={styles.label}>CEP</Text>
                <Input placeholder="00000-000" value={cep} onChangeText={setCep}/>
                <Text style={styles.label}>Cidade</Text>
                <Input placeholder="Sua cidade" value={city} onChangeText={setCity}/>
                
                <View style={styles.row}>
                  <View style={{ flex: 3 }}>
                    <Text style={styles.label}>Logradouro</Text>
                    <Input placeholder="Rua/Av" value={street} onChangeText={setStreet}/>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.label}>Número</Text>
                    <Input placeholder="Nº" value={number} onChangeText={setNumber}/>
                  </View>
                </View>

                <Text style={styles.label}>Bairro</Text>
                <Input placeholder="Bairro" value={neighborhood} onChangeText={setNeighborhood}/>
              </View>
            )}

            {/* ETAPA 4: CONTA / ACESSO */}
            {step === 4 && (
              <View style={styles.stepContainer}>
                <WelcomeTitle text="Bem vindo!"/>
                <WelcomeSubtitle text="Cadastre-se"/>
                <Text style={styles.label}>E-mail</Text>
                <Input placeholder="email@exemplo.com" value={email} onChangeText={setEmail}/>
                <Text style={styles.label}>Senha</Text>
                <Input placeholder="Mínimo 8 caracteres" value={password} onChangeText={setPassword} secureTextEntry/>
                <Text style={styles.label}>Confirmar senha</Text>
                <Input placeholder="Repita a senha" value={passwordConfirmation} onChangeText={setPasswordConfirmation} secureTextEntry/>
              </View>
            )}

            {step !== 2 && (
              <View style={{ width: '100%', marginTop: 20 }}>
                <LoginButton 
                  onPress={handleNext} 
                  disabled={isLoading} 
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

      <View style={styles.waveContainer}>
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
    marginBottom: 25
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
    flexDirection: 'row',
    width: '100%',
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