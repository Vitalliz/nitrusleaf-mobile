// components/cards/analysisCard.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface AnalysisData {
    id: string;
    label: string;
    status: "Tratado" | "Em tratamento" | "Não tratado" | "Não-Tratado" | string;
    date: string;
    /** Preenchido a partir de `relatorios.observacoes` (scan IA). */
    probability?: number;
    deficiencyType?: string;
}

// ── StatusBadge ───────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
    const config: Record<string, { bg: string; text: string; icon: string }> = {
        "Em tratamento": { bg: "#FBBF24", text: "#92400E", icon: "time-outline" },
        Tratado:         { bg: "#10B981", text: "#FFFFFF", icon: "checkmark-done-outline" },
        "Não tratado":   { bg: "#F44336", text: "#FFFFFF", icon: "close-circle-outline" },
        "Não-Tratado":   { bg: "#F44336", text: "#FFFFFF", icon: "close-circle-outline" },
        "Sem-informações": { bg: "#9E9E9E", text: "#FFFFFF", icon: "help-circle-outline" },
    };

    const { bg, text, icon } = config[status] ?? {
        bg: "#9E9E9E", text: "#FFFFFF", icon: "help-circle-outline",
    };

    return (
        <View style={[styles.statusBadge, { backgroundColor: bg }]}>
            <Ionicons name={icon as any} size={14} color={text} />
            <Text style={[styles.statusText, { color: text }]}>{status}</Text>
        </View>
    );
};

// ── AnalysisCard ──────────────────────────────────────────────────────────────
const AnalysisCard = React.memo(({
        analysis,
        onPress,
        }: {
        analysis: AnalysisData;
        onPress: () => void;
    }) => (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.7}
        >
        <View style={styles.contentRow}>
            <View style={styles.content}>
                {/* Título + chevron */}
                <View style={styles.header}>
                    <Text style={styles.label}>{analysis.label}</Text>
                    
                </View>

                {/* Badge de status abaixo do título */}
                <StatusBadge status={analysis.status} />

                {/* Data */}
                <View style={styles.dateContainer}>
                    <Text style={styles.dateLabel}>Criado em:</Text>
                    <Ionicons name="calendar-outline" size={14} color="#777" />
                    <Text style={styles.date}>{analysis.date}</Text>
                </View>
            </View>
            <Ionicons name="chevron-forward" size={30} color="#757575" />
        </View>
        </TouchableOpacity>
));

AnalysisCard.displayName = "AnalysisCard";

export default AnalysisCard;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#D9D9D9",
        borderRadius: 6,
        paddingHorizontal: 20,
        paddingVertical: 14,
        marginBottom: 12,
    },
    content: {
        flex: 1,
    },
    contentRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 3,
    },
    label: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1A1A1A",
        flex: 1,
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",   // badge não ocupa largura total
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 14,
        marginBottom: 10,
    },
    statusText: {
        fontSize: 12,
        fontWeight: "700",
    },
    dateContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    dateLabel: {
        fontSize: 14,
        fontWeight: "700",
        color: "#666",
    },
    date: {
        fontSize: 14,
        color: "#777",
    },
});