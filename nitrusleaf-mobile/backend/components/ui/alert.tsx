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

export type AlertType = "error" | "warning" | "success" | "info";

interface CustomAlertProps {
  visible: boolean;
  title?: string;
  message: string;
  type?: AlertType;
  buttonText?: string;
  onClose: () => void;
}

const config = {
  error: {
    icon: "close" as const,
    color: Palette.error,
  },
  warning: {
    icon: "alert" as const,
    color: Palette.orangePrimary,
  },
  success: {
    icon: "checkmark" as const,
    color: Palette.primary,
  },
  info: {
    icon: "information" as const,
    color: Palette.info,
  },
};

function translateErrorMessage(msg: string): string {
  if (!msg) return "Ocorreu um erro inesperado. Tente novamente.";

  const lower = msg.toLowerCase();

  if (
    lower.includes("invalid-credential") ||
    lower.includes("wrong-password") ||
    lower.includes("invalid login credentials") ||
    lower.includes("invalid username or password")
  ) {
    return "E-mail ou senha incorretos. Verifique seus dados.";
  }

  if (lower.includes("user-not-found")) {
    return "Nenhuma conta encontrada com este e-mail.";
  }

  if (lower.includes("invalid-email") || lower.includes("email is invalid")) {
    return "O formato do e-mail informado não é válido.";
  }

  if (
    lower.includes("email-already-in-use") ||
    lower.includes("user already registered") ||
    lower.includes("email already exists")
  ) {
    return "Este e-mail já está em uso por outra conta.";
  }

  if (
    lower.includes("weak-password") ||
    lower.includes("password should be at least")
  ) {
    return "A senha deve ter pelo menos 6 caracteres.";
  }

  if (
    lower.includes("too-many-requests") ||
    lower.includes("rate limit")
  ) {
    return "Muitas tentativas. Aguarde um momento e tente novamente.";
  }

  if (
    lower.includes("network") ||
    lower.includes("connection") ||
    lower.includes("failed to fetch") ||
    lower.includes("timeout")
  ) {
    return "Falha de conexão. Verifique sua internet.";
  }

  return msg;
}

export function CustomAlert({
  visible,
  title,
  message,
  type = "error",
  buttonText = "Ok",
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
              <TouchableOpacity
                style={styles.closeIconBtn}
                onPress={onClose}
                hitSlop={12}
                activeOpacity={0.6}
              >
                <Ionicons
                  name="close"
                  size={18}
                  color={Palette.textSecondary}
                />
              </TouchableOpacity>

              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: `${current.color}14` },
                ]}
              >
                <Ionicons
                  name={current.icon}
                  size={20}
                  color={current.color}
                />
              </View>

              {title ? <Text style={styles.title}>{title}</Text> : null}

              <Text style={styles.message}>{translatedMessage}</Text>

              <TouchableOpacity
                style={styles.button}
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
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 36,
  },
  card: {
    position: "relative",
    width: "100%",
    maxWidth: 310,
    backgroundColor: Palette.white,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Palette.surfaceGray,
    shadowColor: Palette.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  closeIconBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 4,
    zIndex: 1,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    textAlign: "center",
    marginBottom: 4,
  },
  message: {
    fontSize: FontSizes.sm,
    color: Palette.textSecondary,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 6,
  },
  button: {
    height: 38,
    paddingHorizontal: 24,
    borderRadius: 19,
    backgroundColor: Palette.primary,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 100,
  },
  buttonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semiBold,
    color: Palette.white,
  },
});