import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Interface para as props do FormInput
interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

// Componente FormInput
const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.formGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, isFocused && styles.inputFocused]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="create-outline" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function PropertyDataScreen() {
  const router = useRouter();

  // Estados para os campos do formulário
  const [formData, setFormData] = useState({
    street: "Rua das Flores",
    number: "123",
    neighborhood: "Jardim Primavera",
    complement: "Apto 45",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-567",
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Dados dos campos do formulário
  const formFields = [
    {
      key: "street" as keyof typeof formData,
      label: "Logradouro",
      placeholder: "Digite o nome da rua/avenida",
    },
    {
      key: "number" as keyof typeof formData,
      label: "Número",
      placeholder: "Número do imóvel",
    },
    {
      key: "neighborhood" as keyof typeof formData,
      label: "Bairro",
      placeholder: "Digite o bairro",
    },
    {
      key: "complement" as keyof typeof formData,
      label: "Complemento",
      placeholder: "Apto, Bloco, etc. (opcional)",
    },
    {
      key: "city" as keyof typeof formData,
      label: "Cidade",
      placeholder: "Digite a cidade",
    },
    {
      key: "state" as keyof typeof formData,
      label: "Estado",
      placeholder: "UF",
    },
    {
      key: "zipCode" as keyof typeof formData,
      label: "CEP",
      placeholder: "00000-000",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image source={require('@/assets/images/icons/people_profile.png')}  style={styles.avatar}/>
          <Text style={styles.userText}>Olá, João Silva!</Text>
        </View>

        <TouchableOpacity>
          <Ionicons name="menu" size={32} color="#3A3A3A" />
        </TouchableOpacity>
      </View>

      {/* Título da Seção */}
      <View style={styles.sectionHeader}>
        <Ionicons name="business-outline" size={24} color="#555" />
        <Text style={styles.sectionTitle}>Dados da Propriedade</Text>
      </View>

      {/* Formulário com Scroll */}
      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.formContent}
      >
        {formFields.map((field) => (
          <FormInput
            key={field.key}
            label={field.label}
            value={formData[field.key]}
            onChangeText={(text) => handleInputChange(field.key, text)}
            placeholder={field.placeholder}
          />
        ))}
      </ScrollView>

      {/* Footer com Botão Voltar */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4E8D7",
  },

  // Header
  header: {
    marginTop: 60,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userText: {
    fontSize: 18,
    marginLeft: 12,
    fontWeight: "600",
    color: "#333",
  },
  userImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E8D7BD",
  },

  // Seção Título
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 8,
    color: "#333",
  },

  // Container do Formulário
  formContainer: {
    flex: 1,
    marginTop: 16,
  },
  formContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },

  // Grupos do Formulário
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#5A3E2B",
    marginBottom: 8,
    fontWeight: "600",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderColor: "#E8D7BD",
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333",
  },
  inputFocused: {
    borderColor: "#6BC24A",
    backgroundColor: "#FAF6F0",
  },
  editButton: {
    width: 44,
    height: 44,
    backgroundColor: "#6BC24A",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 100,
    backgroundColor: "#FFB027",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6BC24A",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 30,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "600",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
});
