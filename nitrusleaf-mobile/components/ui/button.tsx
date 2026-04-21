// Button.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Variant = "primary" | "google" | "googleTwo" | "navigation";
type Size = "378" | "56" | "full" | "auto";

interface ButtonProps {
  title: string;
  variant?: Variant;
  size?: Size;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
}

export const Button = ({
  title,
  variant = "primary",
  size = "378",
  onPress,
  icon,
  disabled = false,
}: ButtonProps) => {
  const stylesVariant = buttonStyles[variant];
  const textColor = textStyles[variant];
  const sizeStyle = sizeStyles[size];
  const disabledStyle = disabled ? styles.disabled : {};

  return (
    <TouchableOpacity
      style={[styles.button, stylesVariant, sizeStyle, disabledStyle]}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.content}>
        {icon && <Ionicons name={icon} size={20} color={textColor.color} style={styles.icon} />}
        <Text style={[styles.text, textColor, disabled && styles.disabledText]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: "#6BC24A",
    borderWidth: 0,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  google: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D1D1",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  googleTwo: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D1D1",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  navigation: {
    backgroundColor: "#6BC24A",
    borderWidth: 0,
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
});

const textStyles = StyleSheet.create({
  primary: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  google: {
    color: "#333333",
    fontWeight: "500",
  },
  googleTwo: {
    color: "#333333",
    fontWeight: "500",
  },
  navigation: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});

const sizeStyles = StyleSheet.create({
  "378": {
    width: 378,
    height: 50,
    borderRadius: 25,
  },
  "56": {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  full: {
    width: "100%",
    height: 50,
    borderRadius: 25,
  },
  auto: {
    paddingHorizontal: 16,
    height: 36,
    minWidth: 80,
    borderRadius: 18,
    paddingVertical: 8,
  },
});

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 10,
  },
  disabled: {
    backgroundColor: "#CCCCCC",
    borderColor: "#CCCCCC",
    opacity: 0.6,
  },
  disabledText: {
    color: "#666666",
  },
});

// Componentes específicos
export const ContinueButton = ({ onPress }: { onPress?: () => void }) => (
  <Button
    title="Continuar"
    variant="primary"
    size="378"
    onPress={onPress}
  />
);

export const GoogleButton = ({ onPress }: { onPress?: () => void }) => (
  <Button
    title="Cadastrar-se com o Google"
    variant="google"
    size="378"
    onPress={onPress}
    icon="logo-google"
  />
);

export const GoogleButton2 = ({ onPress }: { onPress?: () => void }) => (
  <Button
    title="Entrar com o Google"
    variant="googleTwo"
    size="378"
    onPress={onPress}
    icon="logo-google"
  />
);

export const LoginButton = ({ onPress }: { onPress?: () => void }) => (
  <Button
    title="Entrar"
    variant="primary"
    size="378"
    onPress={onPress}
  />
);

export const BackButton = ({ onPress }: { onPress?: () => void }) => (
  <Button
    title="Voltar"
    variant="navigation"
    size="auto"
    onPress={onPress}
    icon="arrow-back"
  />
);

export const SquareButton = ({ onPress, title = "✓" }: { onPress?: () => void; title?: string }) => (
  <Button
    title={title}
    variant="primary"
    size="56"
    onPress={onPress}
  />
);