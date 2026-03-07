// components/Input.tsx
import * as React from "react";
import { TextInput, StyleSheet, DimensionValue, KeyboardTypeOptions } from "react-native";

type InputVariant = "default" | "error" | "readonly";
type InputSize =
  | "size-327"
  | "size-199"
  | "size-364"
  | "size-287"
  | "size-286"
  | "medium"
  | "full";

interface InputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  variant?: InputVariant;
  size?: InputSize;
  width?: DimensionValue;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
}

export const Input = ({
  placeholder,
  value,
  onChangeText,
  variant = "default",
  size = "medium",
  width,
  secureTextEntry = false,
  keyboardType = "default",
}: InputProps) => {
  const sizeStyle = inputSizes[size];
  const customWidth = width ? { width } : {};

  return (
    <TextInput
      style={[styles.input, sizeStyle, inputVariants[variant], customWidth]}
      placeholder={placeholder}
      placeholderTextColor="#8B5E3C"
      value={value}
      onChangeText={onChangeText}
      editable={variant !== "readonly"}
      multiline={size === "size-364" || size === "size-287"}
      numberOfLines={size === "size-364" || size === "size-287" ? 3 : 1}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#2B2B2B",
    borderWidth: 1,
    borderColor: "#A3D99F",
    marginVertical: 6,
    textAlignVertical: "center",
  },
});

// Variantes de tamanho com medidas específicas
const inputSizes = StyleSheet.create({
  // Tamanhos específicos solicitados
  "size-327": {
    height: 48,
    paddingVertical: 12,
    fontSize: 16,
    width: 327,
  },
  "size-199": {
    height: 48,
    paddingVertical: 12,
    fontSize: 16,
    width: 199,
  },
  "size-364": {
    height: 80,
    paddingVertical: 16,
    fontSize: 16,
    width: 364,
    textAlignVertical: "top",
  },
  "size-287": {
    height: 64,
    paddingVertical: 14,
    fontSize: 16,
    width: 287,
    textAlignVertical: "top",
  },
  "size-286": {
    height: 48,
    paddingVertical: 12,
    fontSize: 16,
    width: 286,
  },
  // Tamanhos padrão mantidos para compatibilidade
  medium: {
    height: 48,
    paddingVertical: 12,
    fontSize: 16,
    maxWidth: 200,
  },
  full: {
    height: 48,
    paddingVertical: 12,
    fontSize: 16,
    width: "100%",
  },
});

const inputVariants = StyleSheet.create({
  default: {
    borderColor: "#A3D99F",
    backgroundColor: "#FFFFFF",
  },
  error: {
    borderColor: "#FF5C5C",
    backgroundColor: "#FFECEC",
  },
  readonly: {
    opacity: 0.7,
    backgroundColor: "#F5F5F5",
  },
});