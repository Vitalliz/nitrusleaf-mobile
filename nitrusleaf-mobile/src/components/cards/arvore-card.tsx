    import React from "react";
    import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    } from "react-native";
    import { Ionicons } from "@expo/vector-icons";

    interface ArvoreData {
    id: string;
    name: string;
    deficiency: string | null;
    status: string;
    date: string;
    }

    interface ArvoreCardProps {
    arvore: ArvoreData;
    onPress: () => void;
    }

    const getStatusColor = (status: string) => {
    switch (status) {
        case "Tratado":
        return "#4CAF50";

        case "Não-Tratado":
        case "Não tratado":
        return "#F44336";

        case "Em tratamento":
        return "#FF9800";

        default:
        return "#9E9E9E";
    }
    };

    const getStatusBg = (status: string) => {
    switch (status) {
        case "Tratado":
        return "#E8F5E9";

        case "Não-Tratado":
        case "Não tratado":
        return "#FFEBEE";

        case "Em tratamento":
        return "#FFF3E0";

        default:
        return "#F5F5F5";
    }
    };

    const ArvoreCard: React.FC<ArvoreCardProps> = React.memo(
    ({ arvore, onPress }) => {
        return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.content}>
            <View style={styles.header}>
                <Text style={styles.name}>{arvore.name}</Text>

                <View
                style={[
                    styles.statusBadge,
                    {
                    backgroundColor: getStatusBg(arvore.status),
                    },
                ]}
                >
                <Text
                    style={[
                    styles.statusText,
                        {
                            color: getStatusColor(arvore.status),
                        },
                    ]}
                >
                    {arvore.status}
                </Text>
                </View>
            </View>

            <View style={styles.footer}>
                <View style={styles.dateContainer}>
                <Text style={styles.dateLabel}>Criado em:</Text>

                <Ionicons
                    name="calendar-outline"
                    size={14}
                    color="#777"
                />

                <Text style={styles.date}>
                    {arvore.date}
                </Text>
                </View>

                {arvore.deficiency && (
                <View style={styles.deficientBadge}>
                    <Text style={styles.deficientText}>
                    ⚠️ {arvore.deficiency}
                    </Text>
                </View>
                )}
            </View>
            </View>

            <Ionicons
            name="chevron-forward"
            size={30}
            color="#757575"
            style={styles.chevron}
            />
        </TouchableOpacity>
        );
    }
    );

    ArvoreCard.displayName = "ArvoreCard";

    const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#D9D9D9",
        borderRadius: 6,
        paddingHorizontal: 20,
        paddingVertical: 18,
        marginBottom: 12,
    },

    content: {
        flex: 1,
        minWidth: 0,
    },

    header: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        marginBottom: 10,
        minWidth: 0,
    },

    name: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1A1A1A",
        flex: 1,
        flexShrink: 1,
    },

    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 14,
    },

    statusText: {
        fontSize: 12,
        fontWeight: "700",
    },

    footer: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 8,
        width: "100%",
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

    deficientBadge: {
        backgroundColor: "#FFF4E5",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        alignSelf: "flex-start",
        maxWidth: "100%",
    },

    deficientText: {
        fontSize: 11,
        fontWeight: "600",
        color: "#FF9800",
        flexShrink: 1,
    },

    chevron: {
        marginLeft: 14,
    },
    });

    export default ArvoreCard;
