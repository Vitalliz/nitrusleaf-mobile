// components/modals/arvore-edit-modal.tsx
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
      setError("O nome não pode estar vazio.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      await onSave(name.trim());
      onClose();
    } catch {
      setError("Erro ao salvar. Tente novamente.");
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
      setError("Erro ao excluir. Tente novamente.");
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

          {/* ── Tela de edição ── */}
          {step === "edit" && (
            <>
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Editar Árvore</Text>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeButton}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Nome da árvore</Text>
              <Input
                placeholder="Nome da árvore"
                value={name}
                onChangeText={(v) => { setName(v); setError(""); }}
                variant={error ? "error" : "default"}
                size="full"
                rightIcon="create-outline"
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <Button
                title={saving ? "Salvando..." : "Salvar alterações"}
                variant="primary"
                size="full"
                onPress={handleSave}
                disabled={saving}
              />

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

          {/* ── Confirmação de exclusão ── */}
          {step === "confirmDelete" && (
            <>
              <View style={styles.confirmIconWrapper}>
                <Ionicons name="warning-outline" size={40} color="#D32F2F" />
              </View>

              <Text style={styles.confirmTitle}>Excluir árvore?</Text>
              <Text style={styles.confirmText}>
                Tem certeza que deseja excluir{" "}
                <Text style={styles.confirmBold}>&quot;{arvoreName}&quot;</Text>?{"\n"}
                Todas as análises desta árvore também serão removidas. Essa ação não pode ser desfeita.
              </Text>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <Button
                title={deleting ? "Excluindo..." : "Sim, excluir"}
                variant="danger"
                size="full"
                icon="trash-outline"
                onPress={handleDelete}
                disabled={deleting}
              />

              <View style={styles.cancelSpacing} />

              <Button
                title="Cancelar"
                variant="secondary"
                size="full"
                onPress={() => { setStep("edit"); setError(""); }}
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheetWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A2C3E",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#58B741",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
    marginBottom: 4,
  },
  errorText: {
    fontSize: 12,
    color: "#FF5C5C",
    marginTop: -10,
    marginBottom: 8,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#c3c3c3",
    marginVertical: 12,
  },
  cancelSpacing: { height: 8 },
  confirmIconWrapper: {
    alignItems: "center",
    marginBottom: 12,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A2C3E",
    textAlign: "center",
    marginBottom: 10,
  },
  confirmText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  confirmBold: {
    fontWeight: "700",
    color: "#1A2C3E",
  },
});