import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Palette, FontSizes, FontWeights } from "@/constants/theme";

interface TalhaoEditModalProps {
  visible: boolean;
  talhaoName: string;
  onClose: () => void;
  onSave: (newName: string) => Promise<void>;
  onDelete: () => Promise<void>;
}

type Step = "edit" | "confirmDelete";

export function TalhaoEditModal({
  visible,
  talhaoName,
  onClose,
  onSave,
  onDelete,
}: TalhaoEditModalProps) {
  const [step, setStep] = useState<Step>("edit");
  const [name, setName] = useState(talhaoName);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (visible) {
      setName(talhaoName);
      setStep("edit");
      setError("");
    }
  }, [visible, talhaoName]);

  const handleSave = async () => {
    if (!name.trim()) {
      setError("O nome do talhão não pode estar vazio.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      await onSave(name.trim());
      onClose();
    } catch {
      setError("Falha ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await onDelete();
      onClose();
    } catch {
      setError("Falha ao excluir o talhão.");
      setStep("edit");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.sheetWrapper}
        pointerEvents="box-none"
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />

          {step === "edit" && (
            <>
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Editar Talhão</Text>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeButton}
                  activeOpacity={0.7}
                  hitSlop={10}
                >
                  <Ionicons name="close" size={20} color={Palette.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome do talhão</Text>
                <Input
                  placeholder="Ex: Talhão Norte 01"
                  value={name}
                  onChangeText={(v) => {
                    setName(v);
                    setError("");
                  }}
                  variant={error ? "error" : "default"}
                  size="full"
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </View>

              <Button
                title={saving ? "Salvando..." : "Salvar alterações"}
                variant="primary"
                size="full"
                onPress={handleSave}
                disabled={saving}
              />

              <View style={styles.divider} />

              <Button
                title="Excluir talhão"
                variant="danger"
                size="full"
                icon="trash-outline"
                onPress={() => setStep("confirmDelete")}
              />
            </>
          )}

          {step === "confirmDelete" && (
            <>
              <View style={styles.confirmIconWrapper}>
                <View style={styles.dangerCircle}>
                  <Ionicons name="warning" size={32} color={Palette.error} />
                </View>
              </View>

              <Text style={styles.confirmTitle}>Excluir talhão?</Text>
              <Text style={styles.confirmText}>
                Tem certeza que deseja excluir{" "}
                <Text style={styles.confirmBold}>&quot;{talhaoName}&quot;</Text>?{"\n"}
                Todas as árvores cadastradas nele e seus respectivos relatórios serão removidos. Essa ação é irreversível.
              </Text>

              {error ? <Text style={styles.errorTextCentered}>{error}</Text> : null}

              <Button
                title={deleting ? "Excluindo..." : "Sim, excluir talhão"}
                variant="danger"
                size="full"
                icon="trash"
                onPress={handleDelete}
                disabled={deleting}
              />

              <View style={styles.cancelSpacing} />

              <Button
                title="Voltar e cancelar"
                variant="outline"
                size="full"
                onPress={() => {
                  setStep("edit");
                  setError("");
                }}
              />
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheetWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: Palette.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    shadowColor: Palette.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  handle: {
    width: 44,
    height: 5,
    backgroundColor: Palette.borderDisabled,
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 24,
  },
  
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Palette.surfaceGray,
    alignItems: "center",
    justifyContent: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semiBold,
    color: Palette.textPrimary,
    marginBottom: 8,
  },
  errorText: {
    fontSize: FontSizes.xs,
    color: Palette.error,
    marginTop: -10,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Palette.surfaceGray,
    marginVertical: 8,
  },

  confirmIconWrapper: {
    alignItems: "center",
    marginBottom: 16,
  },
  dangerCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${Palette.error}15`,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    textAlign: "center",
    marginBottom: 12,
  },
  confirmText: {
    fontSize: FontSizes.base,
    color: Palette.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  confirmBold: {
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
  },
  errorTextCentered: {
    fontSize: FontSizes.sm,
    color: Palette.error,
    textAlign: "center",
    marginBottom: 16,
  },
  cancelSpacing: {
    height: 8,
  },
});