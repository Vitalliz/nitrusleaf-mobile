import React from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Palette, FontSizes, FontWeights } from "@/constants/theme";
import type { Talhao } from "@/types/talhao";

interface TalhaoSelectModalProps {
    visible: boolean;
    talhoes: Talhao[];
    selectedTalhaoId?: string;
    onSelect: (talhao: Talhao) => void;
    onAddNew?: () => void;
    onClose: () => void;
}

export function TalhaoSelectModal({
    visible,
    talhoes,
    selectedTalhaoId,
    onSelect,
    onAddNew,
    onClose,
}: TalhaoSelectModalProps) {
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
                <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={onClose}
                    hitSlop={12}
                    activeOpacity={0.6}
                >
                    <Ionicons name="close" size={18} color={Palette.textSecondary} />
                </TouchableOpacity>

                <View style={styles.iconCircle}>
                    <Ionicons name="map-outline" size={22} color={Palette.primary} />
                </View>

                <Text style={styles.title}>Selecionar Talhão</Text>
                <Text style={styles.subtitle}>
                    Escolha o talhão correspondente à amostra analisada:
                </Text>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {talhoes.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons
                        name="alert-circle-outline"
                        size={28}
                        color={Palette.textSecondary}
                        />
                        <Text style={styles.emptyText}>
                        Nenhum talhão encontrado para esta propriedade.
                        </Text>
                    </View>
                    ) : (
                    talhoes.map((item) => {
                        const isSelected = selectedTalhaoId === item.id;

                        return (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                            styles.talhaoRow,
                            isSelected && styles.talhaoRowSelected,
                            ]}
                            activeOpacity={0.7}
                            onPress={() => {
                            onSelect(item);
                            onClose();
                            }}
                        >
                            <View style={styles.talhaoInfo}>
                            <Ionicons
                                name="grid-outline"
                                size={18}
                                color={isSelected ? Palette.primary : Palette.textSecondary}
                            />
                            <Text
                                style={[
                                styles.talhaoName,
                                isSelected && styles.talhaoNameSelected,
                                ]}
                                numberOfLines={1}
                            >
                                {item.name}
                            </Text>
                            </View>

                            <Ionicons
                            name={
                                isSelected
                                ? "radio-button-on"
                                : "radio-button-off"
                            }
                            size={18}
                            color={isSelected ? Palette.primary : Palette.borderDisabled}
                            />
                        </TouchableOpacity>
                        );
                    })
                    )}
                </ScrollView>

                {onAddNew && (
                    <TouchableOpacity
                    style={styles.addNewButton}
                    activeOpacity={0.8}
                    onPress={() => {
                        onClose();
                        onAddNew();
                    }}
                    >
                    <Ionicons name="add" size={18} color={Palette.primary} />
                    <Text style={styles.addNewText}>Cadastrar novo talhão</Text>
                    </TouchableOpacity>
                )}
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
        maxWidth: 330,
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
        marginBottom: 14,
    },
    scrollView: {
        width: "100%",
        maxHeight: 220,
    },
    scrollContent: {
        gap: 8,
    },
    talhaoRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#F9FAFB",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 14,
    },
    talhaoRowSelected: {
        borderColor: Palette.primary,
        backgroundColor: `${Palette.primary}0D`,
    },
    talhaoInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        flex: 1,
    },
    talhaoName: {
        fontSize: 14,
        fontWeight: FontWeights.medium,
        color: Palette.textPrimary,
        flex: 1,
    },
    talhaoNameSelected: {
        fontWeight: FontWeights.bold,
        color: Palette.primary,
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 20,
        gap: 6,
    },
    emptyText: {
        fontSize: 12,
        color: Palette.textSecondary,
        textAlign: "center",
    },
    addNewButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        marginTop: 14,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#F3F4F6",
        width: "100%",
    },
    addNewText: {
        fontSize: 13,
        fontWeight: FontWeights.semiBold,
        color: Palette.primary,
    },
});