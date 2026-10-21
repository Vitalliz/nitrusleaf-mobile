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

export type TreeStatus = "Não informado" | "Não tratado" | "Em tratamento" | "Tratado";

interface StatusSelectModalProps {
    visible: boolean;
    currentStatus?: string;
    onSelect: (status: TreeStatus) => void;
    onClose: () => void;
}

const STATUS_OPTIONS: {
    id: TreeStatus;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    backgroundColor: string;
    textColor: string;
    iconColor: string;
}[] = [
    {
        id: "Não informado",
        label: "Não informado",
        icon: "remove-outline",
        backgroundColor: "#EEEEEE",
        textColor: "#1A1A1A",
        iconColor: "#555555",
    },
    {
        id: "Não tratado",
        label: "Não tratado",
        icon: "remove-circle-outline",
        backgroundColor: "#E04842",
        textColor: Palette.white,
        iconColor: Palette.white,
    },
    {
        id: "Em tratamento",
        label: "Em tratamento",
        icon: "time-outline",
        backgroundColor: "#EAB032",
        textColor: "#1F2937",
        iconColor: "#1F2937",
    },
    {
        id: "Tratado",
        label: "Tratado",
        icon: "checkmark",
        backgroundColor: "#83C570",
        textColor: Palette.white,
        iconColor: Palette.white,
    },
];

export function StatusSelectModal({
    visible,
    currentStatus,
    onSelect,
    onClose,
}: StatusSelectModalProps) {
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
                {/* Botão Fechar */}
                <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={onClose}
                    hitSlop={12}
                    activeOpacity={0.6}
                >
                    <Ionicons name="close" size={18} color={Palette.textSecondary} />
                </TouchableOpacity>

                {/* Ícone Central Superior */}
                <View style={styles.iconCircle}>
                    <Ionicons name="swap-horizontal" size={22} color={Palette.primary} />
                </View>

                <Text style={styles.title}>Alterar Status</Text>
                <Text style={styles.subtitle}>
                    Selecione a situação atual da amostra analisada:
                </Text>

                {/* Lista dos Botões de Status (conforme a imagem) */}
                <View style={styles.optionsList}>
                    {STATUS_OPTIONS.map((item) => {
                    const isSelected = currentStatus === item.id;

                    return (
                        <TouchableOpacity
                        key={item.id}
                        style={[
                            styles.statusButton,
                            { backgroundColor: item.backgroundColor },
                            isSelected && styles.statusButtonSelected,
                        ]}
                        activeOpacity={0.85}
                        onPress={() => {
                            onSelect(item.id);
                            onClose();
                        }}
                        >
                        <Ionicons
                            name={item.icon}
                            size={20}
                            color={item.iconColor}
                            style={styles.statusIcon}
                        />
                        <Text
                            style={[
                            styles.statusText,
                            { color: item.textColor },
                            ]}
                        >
                            {item.label}
                        </Text>
                        {isSelected && (
                            <View style={styles.checkIndicator}>
                            <Ionicons
                                name="checkmark-circle"
                                size={16}
                                color={item.textColor}
                            />
                            </View>
                        )}
                        </TouchableOpacity>
                    );
                    })}
                </View>
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
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 28,
    },
    card: {
        position: "relative",
        width: "100%",
        maxWidth: 320,
        backgroundColor: Palette.white,
        borderRadius: 18,
        paddingHorizontal: 20,
        paddingTop: 22,
        paddingBottom: 20,
        alignItems: "center",
        borderWidth: 1,
        borderColor: Palette.surfaceGray,
        shadowColor: Palette.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 4,
    },
    closeBtn: {
        position: "absolute",
        top: 14,
        right: 14,
        padding: 4,
        zIndex: 1,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: `${Palette.primary}18`,
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
    subtitle: {
        fontSize: 12,
        color: Palette.textSecondary,
        textAlign: "center",
        lineHeight: 16,
        marginBottom: 16,
    },
    optionsList: {
        width: "100%",
        gap: 10,
    },
    statusButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 46,
        borderRadius: 8,
        paddingHorizontal: 16,
        position: "relative",
    },
    statusButtonSelected: {
        borderWidth: 2,
        borderColor: "#1A1A1A",
    },
    statusIcon: {
        marginRight: 8,
    },
    statusText: {
        fontSize: 15,
        fontWeight: FontWeights.bold,
    },
    checkIndicator: {
        position: "absolute",
        right: 14,
    },
});