import React from "react";
import { Image, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Label } from "@/components/ui/label";
import { Ionicons } from "@expo/vector-icons";
import { Palette } from "@/constants/theme";

type Variant = "primary" | "secondary" | "accent" | "text" | "outline" | "google" | "googleTwo" | "navigation" | "solid-green" | "danger";
type Size = "328" | "151" | "142" | "143" | "241" | "56" | "111" | "206" | "full" | "auto";

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
  size = "328",
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
        {(variant === "google" || variant === "googleTwo") ? (
          <Image
            source={require("@/assets/images/google-logo.png")}
            style={styles.googleIcon}
          />
        ) : (
          icon && (
            <Ionicons
              name={icon}
              size={20}
              color={textColor.color}
              style={styles.icon}
            />
          )
        )}

        <Label
          text={title}
          size={15}
          variant={
            variant === "google" || variant === "googleTwo"
              ? "regular"
              : "semibold"
          }
          color={
            variant === "google" || variant === "googleTwo"
              ? "secondary"
              : variant === "secondary" || variant === "outline" || variant === "text"
              ? "accent"
              : "white"
          }
          style={{
            ...styles.text,
            ...(variant === "danger" && { color: Palette.error }),
            ...(disabled && styles.disabledText),
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: Palette.primary,
    borderWidth: 0,
    elevation: 3,
  },
  secondary: {
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.primary,
  },
  accent: {
    backgroundColor: Palette.orangePrimary,
    borderWidth: 0,
  },
  text: {
    backgroundColor: "transparent",
    borderWidth: 0,
    elevation: 0,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Palette.primary,
  },
  google: {
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.borderDisabled,
    elevation: 2,
  },
  googleTwo: {
    backgroundColor: Palette.white,
    borderWidth: 0.9,
    borderColor: Palette.borderDisabled,
    elevation: 2,
  },
  navigation: {
    backgroundColor: Palette.primary,
    borderWidth: 0,
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    marginVertical: 2,
    borderRadius: 18,
    elevation: 2,
  },
  "solid-green": {
    backgroundColor: Palette.primary,
    borderWidth: 0,
    borderRadius: 20,
    elevation: 2,
  },
  danger: {
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.error,
    elevation: 3,
  },
});

const textStyles = StyleSheet.create({
  primary: { color: Palette.white, fontWeight: "600" },
  secondary: { color: Palette.primary, fontWeight: "600" },
  accent: { color: Palette.white, fontWeight: "600" },
  text: { color: Palette.primary, fontWeight: "400" },
  outline: { color: Palette.primary, fontWeight: "600" },
  google: { color: Palette.textPrimary, fontWeight: "500" },
  googleTwo: { color: Palette.textPrimary, fontWeight: "500" },
  navigation: { color: Palette.white, fontWeight: "600", fontSize: 14 },
  "solid-green": { color: Palette.white, fontWeight: "600", fontSize: 14 },
  danger: { color: Palette.error, fontWeight: "600" },
});

const sizeStyles = StyleSheet.create({
  "328": { width: 328, maxWidth: "100%", height: 44, borderRadius: 22 },
  "151": { width: 151, height: 40, borderRadius: 20 },
  "142": { width: 142, height: 40, borderRadius: 20 },
  "143": { width: 143, height: 40, borderRadius: 20 },
  "241": { width: 241, maxWidth: "100%", height: 44, borderRadius: 22 },
  "56":  { width: 48,  height: 48, borderRadius: 24 },
  "111": { width: 111, height: 32, borderRadius: 16, paddingVertical: 6 },
  "206": { width: 206, height: 40, borderRadius: 20 },
  "full": { width: "100%", height: 44, borderRadius: 22 },
  "auto": { paddingHorizontal: 14, height: 32, minWidth: 72, borderRadius: 16, paddingVertical: 6 },
});

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
  },
  googleIcon: {
    position: "absolute",
    left: -10,
    width: 20,
    height: 20,
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: "100%",
  },
  icon: {
    marginRight: 8,
  },
  disabled: {
    backgroundColor: Palette.borderDisabled,
    borderColor: Palette.borderDisabled,
    opacity: 0.6,
  },
  disabledText: {
    color: Palette.textSecondary,
  },
});

export const ContinueButton = ({ onPress }: { onPress?: () => void }) => (
  <Button title="Continuar" variant="primary" size="328" onPress={onPress} />
);

export const GoogleButton = ({ onPress }: { onPress?: () => void }) => (
  <Button title="Cadastrar-se com o Google" variant="google" size="full" onPress={onPress} icon="logo-google" />
);

export const GoogleButton2 = ({ onPress }: { onPress?: () => void }) => (
  <Button title="Entrar com o Google" variant="googleTwo" size="full" onPress={onPress} icon="logo-google" />
);

export const LoginButton = ({ onPress, disabled = false, title = "Entrar" }: { onPress?: () => void; disabled?: boolean; title?: string }) => (
  <Button title={title} variant="primary" size="full" onPress={onPress} disabled={disabled} />
);

export const AddTalhaoButton = ({ onPress }: { onPress?: () => void }) => (
  <Button title="Cadastrar Talhão" variant="primary" size="full" icon="add" onPress={onPress} />
);

export const NextButton = ({ onPress }: { onPress?: () => void }) => (
  <Button title="Próxima" variant="primary" size="206" onPress={onPress} />
);

export const BackButton = ({ onPress }: { onPress?: () => void }) => (
  <Button title="Voltar" variant="navigation" size="auto" onPress={onPress} icon="arrow-back" />
);

export const DetailButton = ({ onPress }: { onPress?: () => void }) => (
  <Button title="Detalhar" variant="solid-green" size="111" onPress={onPress} />
);

export const ExpandButton = ({ onPress }: { onPress?: () => void }) => (
  <Button title="Expandir" variant="solid-green" size="111" onPress={onPress} />
);

export const FinishButton = ({ onPress }: { onPress?: () => void }) => (
  <Button title="Finalizar" variant="primary" size="206" onPress={onPress} />
);

export const AddTreeButton = ({ onPress }: { onPress?: () => void }) => (
  <Button title="+ Adicionar pé" variant="solid-green" size="auto" onPress={onPress} />
);

export const ViewPercentageButton = ({ onPress }: { onPress?: () => void }) => (
  <Button title="Ver %" variant="solid-green" size="auto" onPress={onPress} />
);

export const SeeMoreButton = ({ onPress, title = "Clique para saber mais" }: { onPress?: () => void; title?: string }) => (
  <Button title={title} variant="text" size="auto" onPress={onPress} />
);

export const DirectlyButton = ({ onPress }: { onPress?: () => void }) => (
  <Button title="A diretamente" variant="text" size="auto" onPress={onPress} />
);

export const ViewMapsButton = ({ onPress }: { onPress?: () => void }) => (
  <Button title="Ver mapas" variant="text" size="auto" onPress={onPress} />
);

export const SignUpButton = ({ onPress, disabled = false, title = "Cadastrar-se" }: { onPress?: () => void; disabled?: boolean; title?: string }) => (
  <Button title={title} variant="secondary" size="full" onPress={onPress} disabled={disabled} />
);