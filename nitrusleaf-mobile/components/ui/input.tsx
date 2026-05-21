import * as React from "react";
import { TextInput, StyleSheet, DimensionValue, KeyboardTypeOptions, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type InputVariant = "default" | "error" | "readonly";
type InputSize = "size-327" | "size-199" | "size-364" | "size-287" | "size-286" | "medium" | "full";

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
  size = "full",
  width,
  secureTextEntry = false,
  keyboardType = "default",
}: InputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  const containerStyle = [
    styles.container,
    inputSizes[size],
    width ? { width } : {}
  ];

  return (
    <View style={containerStyle}>
      <TextInput
        style={[
          styles.input,
          inputVariants[variant],
          secureTextEntry && { paddingRight: 48 } 
        ]}
        placeholder={placeholder}
        placeholderTextColor="#747474"
        value={value}
        onChangeText={onChangeText}
        editable={variant !== "readonly"}
        multiline={size === "size-364" || size === "size-287"}
        numberOfLines={size === "size-364" || size === "size-287" ? 3 : 1}
        secureTextEntry={secureTextEntry ? !isPasswordVisible : false}
        keyboardType={keyboardType}
      />

      {secureTextEntry && (
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Ionicons
            name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
            size={22}
            color="#98979F"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 6,
    marginBottom: 16,
    justifyContent: "center",
    position: "relative",
  },
  input: {
    width: "100%",
    height: "100%", 
    backgroundColor: "white",
    borderRadius: 6,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#2B2B2B",
    borderWidth: 1,
  },
  eyeIcon: {
    position: "absolute",
    right: 15,

  },
});

const inputSizes = StyleSheet.create({
  "size-327": { height: 48, width: 327 },
  "size-199": { height: 48, width: 199 },
  "size-364": { height: 80, width: 364 },
  "size-287": { height: 64, width: 287 },
  "size-286": { height: 48, width: 286 },
  medium: { height: 48, width: 200 },
  full: { height: 48, width: "100%" },
});

const inputVariants = StyleSheet.create({
  default: {
    borderColor: "#A3D99F",
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