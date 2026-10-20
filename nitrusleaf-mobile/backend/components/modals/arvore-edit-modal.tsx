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

interface ArvoreEditModalProps {
  visible: boolean;
  arvoreName: string;
  onClose: () => void;
  onSave: (newName: string) => Promise<void>;
  onDelete: () => Promise<void>;
}

type Step = "edit" | "confirmDelete";

export function ArvoreEditModal({
  visible,
  arvoreName,
  onClose,
  onSave,
  onDelete,
}: ArvoreEditModalProps) {
  const [step, setStep] = useState<Step>("edit");
  const [name, setName] = useState(arvoreName);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (visible) {
      setName(arvoreName);
      setStep("edit");
      setError("");
    }
  }, [visible, arvoreName]);

  const handleSave = async () => {
    if (!name.trim()) {
      setError("O nome da árvore não pode estar vazio.");
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
      setError("Falha ao excluir a árvore.");
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
                <Text style={styles.headerTitle}>Editar Árvore</Text>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeButton}
                  activeOpacity={0.7}
                  hitSlop={10}
                >
                  <Ionicons name="close" size={18} color={Palette.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome da árvore</Text>
                <Input
                  placeholder="Ex: Árvore Norte 02"
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

              {/* Divisor com espaçamento reduzido */}
              <View style={styles.divider} />

              <Button
                title="Excluir árvore"
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
                  <Ionicons name="warning" size={30} color={Palette.error} />
                </View>
              </View>

              <Text style={styles.confirmTitle}>Excluir árvore?</Text>
              <Text style={styles.confirmText}>
                Tem certeza que deseja excluir{" "}
                <Text style={styles.confirmBold}>&quot;{arvoreName}&quot;</Text>?{"\n"}
                Todas as análises e histórico foliar vinculados a ela serão perdidos.
              </Text>

              {error ? <Text style={styles.errorTextCentered}>{error}</Text> : null}

              <Button
                title={deleting ? "Excluindo..." : "Sim, excluir árvore"}
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    shadowColor: Palette.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: Palette.borderDisabled,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Palette.surfaceGray,
    alignItems: "center",
    justifyContent: "center",
  },
  inputGroup: {
    marginBottom: 10,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semiBold,
    color: Palette.textPrimary,
    marginBottom: 4,
  },
  errorText: {
    fontSize: FontSizes.xs,
    color: Palette.error,
    marginTop: -10,
    marginLeft: 4,
  },
  /* Espaçamento compacto entre os botões */
  divider: {
    height: 1,
    backgroundColor: Palette.surfaceGray,
    marginVertical: 8,
  },
  cancelSpacing: {
    height: 8,
  },
  confirmIconWrapper: {
    alignItems: "center",
    marginBottom: 10,
  },
  dangerCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: `${Palette.error}15`,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
    textAlign: "center",
    marginBottom: 8,
  },
  confirmText: {
    fontSize: FontSizes.sm,
    color: Palette.textSecondary,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 16,
  },
  confirmBold: {
    fontWeight: FontWeights.bold,
    color: Palette.textPrimary,
  },
  errorTextCentered: {
    fontSize: FontSizes.xs,
    color: Palette.error,
    textAlign: "center",
    marginBottom: 12,
  },
});