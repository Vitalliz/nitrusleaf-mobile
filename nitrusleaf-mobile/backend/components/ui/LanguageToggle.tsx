import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useLanguage } from "@/i18n/LanguageContext";
import { Palette, FontWeights } from "@/constants/theme";

interface LanguageToggleProps {
  compact?: boolean;
}

export const LanguageToggle = ({ compact = false }: LanguageToggleProps) => {
  const { language, setLanguage, toggleLanguage } = useLanguage();
  const isEn = language === "en";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={toggleLanguage}
      style={[styles.container, compact && styles.compactContainer]}
      accessibilityRole="switch"
      accessibilityLabel={`Alternar idioma. Atual: ${isEn ? "Inglês" : "Português"}`}
    >
      <View style={[styles.option, !isEn && styles.activeOption]}>
        <Text style={[styles.text, !isEn && styles.activeText]}>PT</Text>
      </View>
      <View style={[styles.option, isEn && styles.activeOption]}>
        <Text style={[styles.text, isEn && styles.activeText]}>EN</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Palette.surfaceGray,
    borderRadius: 16,
    padding: 2,
    borderWidth: 1,
    borderColor: Palette.borderDisabled,
  },
  compactContainer: {
    borderRadius: 14,
    padding: 2,
  },
  option: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    minWidth: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  activeOption: {
    backgroundColor: Palette.primary,
    shadowColor: Palette.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    fontSize: 11,
    fontWeight: FontWeights.bold,
    color: Palette.textSecondary,
  },
  activeText: {
    color: Palette.white,
  },
});

