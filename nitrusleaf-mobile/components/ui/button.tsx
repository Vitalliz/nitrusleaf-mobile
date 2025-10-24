import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Variant = "primary" | "secondary" | "accent" | "text" | "outline" | "google" | "googleTwo" | "navigation" | "solid-green";
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
  secondary: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#6BC24A",
  },
  accent: {
    backgroundColor: "#FFA62B",
    borderWidth: 0,
  },
  text: {
    backgroundColor: "transparent",
    borderWidth: 0,
    shadowColor: "transparent",
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#6BC24A",
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
  "solid-green": {
    backgroundColor: "#6BC24A",
    borderWidth: 0,
    borderRadius: 20,
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
  secondary: { 
    color: "#6BC24A",
    fontWeight: "600",
  },
  accent: { 
    color: "#FFFFFF",
    fontWeight: "600",
  },
  text: { 
    color: "#6BC24A",
    fontWeight: "400",
  },
  outline: { 
    color: "#6BC24A",
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
  "solid-green": { 
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});

const sizeStyles = StyleSheet.create({
  "328": {
    width: 328,
    height: 50,
    borderRadius: 25,
  },
  "151": {
    width: 151,
    height: 45,
    borderRadius: 22,
  },
  "142": {
    width: 142,
    height: 45,
    borderRadius: 22,
  },
  "143": {
    width: 143,
    height: 45,
    borderRadius: 22,
  },
  "241": {
    width: 241,
    height: 50,
    borderRadius: 25,
  },
  "56": {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  "111": {
    width: 111,
    height: 36,
    borderRadius: 18,
    paddingVertical: 8,
  },
  "206": {
    width: 206,
    height: 45,
    borderRadius: 22,
  },
  "full": {
    width: "100%",
    height: 50,
    borderRadius: 25,
  },
  "auto": {
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

// Componentes específicos baseados nas telas - ATUALIZADOS
export const ContinueButton = ({ onPress }: { onPress?: () => void }) => (
  <Button 
    title="Continuar" 
    variant="primary" 
    size="328" 
    onPress={onPress} 
  />
);

export const GoogleButton = ({ onPress }: { onPress?: () => void }) => (
  <Button 
    title="Cadastrar-se com o Google" 
    variant="google" 
    size="328" 
    onPress={onPress}
    icon="logo-google"
  />
);

export const GoogleButton2 = ({ onPress }: { onPress?: () => void }) => (
  <Button 
    title="Entrar com o Google" 
    variant="googleTwo" 
    size="328" 
    onPress={onPress}
    icon="logo-google"
  />
);

export const LoginButton = ({ onPress }: { onPress?: () => void }) => (
  <Button 
    title="Entrar" 
    variant="primary" 
    size="328" 
    onPress={onPress} 
  />
);

export const NextButton = ({ onPress }: { onPress?: () => void }) => (
  <Button 
    title="Próxima" 
    variant="primary" 
    size="206" 
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

export const DetailButton = ({ onPress }: { onPress?: () => void }) => (
  <Button 
    title="Detalhar" 
    variant="solid-green" 
    size="111" 
    onPress={onPress} 
  />
);

export const ExpandButton = ({ onPress }: { onPress?: () => void }) => (
  <Button 
    title="Expandir" 
    variant="solid-green" 
    size="111" 
    onPress={onPress} 
  />
);

export const FinishButton = ({ onPress }: { onPress?: () => void }) => (
  <Button 
    title="Finalizar" 
    variant="primary" 
    size="206" 
    onPress={onPress} 
  />
);

export const AddTreeButton = ({ onPress }: { onPress?: () => void }) => (
  <Button 
    title="+ Adicionar pé" 
    variant="solid-green" 
    size="auto" 
    onPress={onPress} 
  />
);

export const ViewPercentageButton = ({ onPress }: { onPress?: () => void }) => (
  <Button 
    title="Ver %" 
    variant="solid-green" 
    size="auto" 
    onPress={onPress} 
  />
);

export const SeeMoreButton = ({ onPress, title = "Clique para saber mais" }: { onPress?: () => void; title?: string }) => (
  <Button 
    title={title}
    variant="text" 
    size="auto" 
    onPress={onPress} 
  />
);

export const DirectlyButton = ({ onPress }: { onPress?: () => void }) => (
  <Button 
    title="A diretamente" 
    variant="text" 
    size="auto" 
    onPress={onPress} 
  />
);

export const ViewMapsButton = ({ onPress }: { onPress?: () => void }) => (
  <Button 
    title="Ver mapas" 
    variant="text" 
    size="auto" 
    onPress={onPress} 
  />
);