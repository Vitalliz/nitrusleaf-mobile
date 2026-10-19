import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Palette, FontSizes, FontWeights } from "@/constants/theme";

export type AlertType = "error" | "warning" | "success";

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  type?: AlertType;
  buttonText?: string;
  onClose: () => void;
}

const config = {
  error: {
    icon: "close-circle" as const,
    color: Palette.error,
  },
  warning: {
    icon: "alert-circle" as const,
    color: Palette.orangePrimary,
  },
  success: {
    icon: "checkmark-circle" as const,
    color: Palette.success,
  },
};

/**
 * Mapeia erros comuns em inglês (Firebase, Supabase, Axios e APIs REST)
 * para mensagens amigáveis em português.
 */
function translateErrorMessage(msg: string): string {
  if (!msg) return "Ocorreu um erro inesperado. Tente novamente.";

  const lower = msg.toLowerCase();

  // Erros de credenciais e senha
  if (
    lower.includes("invalid-credential") ||
    lower.includes("wrong-password") ||
    lower.includes("invalid login credentials") ||
    lower.includes("invalid username or password")
  ) {
    return "E-mail ou senha incorretos. Verifique seus dados e tente novamente.";
  }

  // Usuário não encontrado
  if (lower.includes("user-not-found")) {
    return "Nenhuma conta encontrada com este endereço de e-mail.";
  }

  // E-mail inválido
  if (lower.includes("invalid-email") || lower.includes("email is invalid")) {
    return "O formato do e-mail informado não é válido.";
  }

  // E-mail já cadastrado
  if (
    lower.includes("email-already-in-use") ||
    lower.includes("user already registered") ||
    lower.includes("email already exists")
  ) {
    return "Este endereço de e-mail já está em uso por outra conta.";
  }

  // Senha fraca / curta
  if (
    lower.includes("weak-password") ||
    lower.includes("password should be at least")
  ) {
    return "A senha é muito curta. Crie uma senha com pelo menos 6 a 8 caracteres.";
  }

  // Muitas tentativas / bloqueio temporário
  if (
    lower.includes("too-many-requests") ||
    lower.includes("rate limit")
  ) {
    return "Acesso bloqueado temporariamente por excesso de tentativas. Tente novamente mais tarde.";
  }

  // Conexão e rede
  if (
    lower.includes("network") ||
    lower.includes("connection") ||
    lower.includes("failed to fetch") ||
    lower.includes("timeout")
  ) {
    return "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.";
  }

  // E-mail não confirmado
  if (lower.includes("email not confirmed")) {
    return "Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada.";
  }

  // Não autorizado / token expirado
  if (lower.includes("unauthorized") || lower.includes("jwt expired")) {
    return "Sua sessão expirou. Faça login novamente.";
  }

  return msg;
}

export function CustomAlert({
  visible,
  title,
  message,
  type = "error",
  buttonText = "Entendido",
  onClose,
}: CustomAlertProps) {
  const current = config[type] || config.error;
  const translatedMessage = translateErrorMessage(message);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              {/* Ícone com fundo suave */}
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: `${current.color}18` },
                ]}
              >
                <Ionicons name={current.icon} size={38} color={current.color} />
              </View>

              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{translatedMessage}</Text>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: Palette.primary }]}
                activeOpacity={0.8}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>{buttonText}</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  card: {
    width: "100%",
    backgroundColor: Palette.white,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: "center",
    elevation: 6,
    shadowColor: Palette.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: FontSizes.base,
    color: Palette.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  button: {
    width: "100%",
    height: 46,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semiBold,
    color: Palette.white,
  },
});