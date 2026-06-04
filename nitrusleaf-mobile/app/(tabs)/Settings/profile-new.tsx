// app/(tabs)/Settings/profile.tsx — Tela de Configurações do Usuário
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Image,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { openAddProperty } from '@/utils/navigation';
import { Background } from '@/components/ui/background';
import BottomNavbar from '@/components/ui/tab-bar';
import { useAuth } from '@/contexts/AuthContext';
import { useIsFocused } from '@react-navigation/native';
import { getUsuarioDetails, updateUsuarioAvatar } from '@/repositories/profileRepository';
import { useProperty } from '@/contexts/PropertyContext';
import { getRelatorioCountByUsuario } from '@/repositories/relatorioRepository';
import {
    pickProfileImageFromDevice,
    uploadProfileAvatar,
} from '@/services/profileAvatar';

type MenuItem = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    subtitle?: string;
    route?: string;
};

const MENU_ITEMS: MenuItem[] = [
    {
        icon: 'settings-outline',
        label: 'Configurações',
        route: '/(tabs)/Settings/settings-all',
    },
    {
        icon: 'add-circle-outline',
        label: 'Nova Propriedade',
        subtitle: 'Cadastrar nova propriedade',
        route: '/(tabs)/add-property',
    },
];

export default function ProfileScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const isFocused = useIsFocused();

    const { selectedProperty } = useProperty();
    const [dbUser, setDbUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [totalAnalyses, setTotalAnalyses] = useState<number>(0);
    const [avatarUri, setAvatarUri] = useState<string | null>(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    useEffect(() => {
        async function loadData() {
            if (!user?.id) return;
            try {
                const details = await getUsuarioDetails(user.id);
                setDbUser(details);
                if (details?.avatarUrl) setAvatarUri(details.avatarUrl);
                const count = await getRelatorioCountByUsuario(user.id);
                setTotalAnalyses(count);
            } catch (err) {
                console.error('Erro ao carregar dados no menu do perfil:', err);
            } finally {
                setLoading(false);
            }
        }
        if (isFocused) {
            void loadData();
        }
    }, [user, isFocused]);

    const applyPickedAvatar = async (useCamera: boolean) => {
        if (!user?.id) return;
        try {
            const picked = await pickProfileImageFromDevice(useCamera);
            if (picked.cancelled || !picked.localUri) return;

            setUploadingAvatar(true);
            setAvatarUri(picked.localUri);

            const storedUrl = await uploadProfileAvatar(user.id, picked.localUri);
            await updateUsuarioAvatar(user.id, storedUrl);
            setAvatarUri(storedUrl);
            Alert.alert('Sucesso', 'Foto de perfil atualizada.');
        } catch (error: unknown) {
            console.error('Erro ao alterar foto:', error);
            const msg =
                error instanceof Error
                    ? error.message
                    : 'Não foi possível atualizar a foto de perfil.';
            Alert.alert('Erro', msg);
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleChangePhoto = () => {
        Alert.alert('Foto de perfil', 'Escolha de onde enviar a imagem', [
            { text: 'Galeria', onPress: () => void applyPickedAvatar(false) },
            { text: 'Câmera', onPress: () => void applyPickedAvatar(true) },
            { text: 'Cancelar', style: 'cancel' },
        ]);
    };

    const handleLogout = () => {
        Alert.alert('Sair da conta', 'Tem certeza que deseja sair?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Sair',
                style: 'destructive',
                onPress: async () => {
                    await logout();
                    router.replace('/login');
                },
            },
        ]);
    };

    const handleMenuPress = (item: MenuItem) => {
        if (!item.route) return;
        if (item.route === '/(tabs)/add-property') {
            openAddProperty(router);
            return;
        }
        router.push(item.route as any);
    };

    return (
        <Background>
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="dark-content" backgroundColor="#FAF1E5" />

                <ScrollView
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                >
                    {/* TOPO LARANJA */}
                    <View style={styles.header}>
                        <View style={styles.headerRow}>
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => router.back()}
                            >
                                <Ionicons name="chevron-back" size={22} color="#1A2C3E" />
                            </TouchableOpacity>

                            <Text style={styles.headerTitle}>Meu Perfil</Text>

                            <View style={{ width: 42 }} />
                        </View>
                    </View>

                    {/* CARD BRANCO */}
                    <View style={styles.profileCard}>
                        {/* AVATAR */}
                        <TouchableOpacity
                            style={styles.avatarWrapper}
                            onPress={handleChangePhoto}
                            disabled={uploadingAvatar}
                            activeOpacity={0.8}
                        >
                            {avatarUri ? (
                                <Image
                                    source={{ uri: avatarUri }}
                                    style={styles.avatar}
                                />
                            ) : (
                                <View style={styles.defaultAvatar}>
                                    <Ionicons name="person" size={45} color="#BDBDBD" />
                                </View>
                            )}
                            <View style={styles.avatarEdit}>
                                {uploadingAvatar ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <Ionicons name="camera" size={22} color="#FFF" />
                                )}
                            </View>
                        </TouchableOpacity>

                        {/* NOME */}
                        <Text style={styles.userName}>
                            {loading ? 'Carregando...' : dbUser?.fullName || user?.name || 'Usuário'}
                        </Text>

                        {/* EMAIL */}
                        <Text style={styles.userEmail}>
                            {loading ? '' : dbUser?.email || user?.email || ''}
                        </Text>

                        {/* PROPRIEDADE */}
                        <View style={styles.propertyBadge}>
                            <Ionicons name="business-outline" size={14} color="#6BC24A" />
                            <Text style={styles.propertyText}>
                                {loading ? '...' : selectedProperty?.name || 'Sem propriedade'}
                            </Text>
                        </View>

                        {/* TOTAL DE ANÁLISES */}
                        <View style={styles.analysesCard}>
                            <Text style={styles.analysesLabel}>Total de Análises Feitas</Text>
                            <View style={styles.analysesBadge}>
                                <Text style={styles.analysesValue}>{totalAnalyses}</Text>
                            </View>
                        </View>
                    </View>

                    {/* TÍTULO */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Configurações</Text>
                    </View>

                    {/* MENU */}
                    <View style={styles.menuCard}>
                        {MENU_ITEMS.map((item, index) => (
                            <TouchableOpacity
                                key={item.label}
                                style={[
                                    styles.menuItem,
                                    index < MENU_ITEMS.length - 1 && styles.menuItemBorder,
                                ]}
                                activeOpacity={0.7}
                                onPress={() => handleMenuPress(item)}
                            >
                                <View style={styles.menuIcon}>
                                    <Ionicons name={item.icon} size={20} color="#6BC24A" />
                                </View>

                                <View style={styles.menuContent}>
                                    <Text style={styles.menuLabel}>{item.label}</Text>
                                    {item.subtitle && (
                                        <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                                    )}
                                </View>

                                <Ionicons name="chevron-forward" size={18} color="#BDBDBD" />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* BOTÃO EDITAR */}
                    <TouchableOpacity
                        style={styles.editButton}
                        activeOpacity={0.8}
                        onPress={() => router.push('/(tabs)/Settings/profile-edit')}
                    >
                        <Ionicons name="pencil-outline" size={18} color="#FFF" />
                        <Text style={styles.editButtonText}>Editar Perfil</Text>
                    </TouchableOpacity>

                    {/* BOTÃO SAIR */}
                    <TouchableOpacity
                        style={styles.logoutButton}
                        activeOpacity={0.8}
                        onPress={handleLogout}
                    >
                        <Ionicons name="log-out-outline" size={18} color="#E53E3E" />
                        <Text style={styles.logoutText}>Sair da Conta</Text>
                    </TouchableOpacity>
                </ScrollView>

                <BottomNavbar />
            </SafeAreaView>
        </Background>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        paddingBottom: 40,
        backgroundColor: '#F5F5F5',
    },

    /* HEADER */
    header: {
        backgroundColor: '#FFA62B',
        height: 260,
        paddingTop: 45,
        paddingHorizontal: 20,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFF',
    },

    /* CARD PERFIL */
    profileCard: {
        backgroundColor: '#FFF',
        marginHorizontal: 20,
        marginTop: -80,
        borderRadius: 12,
        alignItems: 'center',
        paddingTop: 70,
        paddingBottom: 25,
        paddingHorizontal: 20,
    },

    /* AVATAR */
    avatarWrapper: {
        position: 'absolute',
        top: -55,
    },
    defaultAvatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: '#F3F4F6',
        borderWidth: 3,
        borderColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 3,
        borderColor: '#FFF',
    },
    avatarEdit: {
        position: 'absolute',
        bottom: -3,
        right: -8,
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#6BC24A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A2C3E',
    },
    userEmail: {
        fontSize: 13,
        color: '#777',
        marginTop: 2,
    },
    propertyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 10,
        backgroundColor: '#F0FDF4',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 12,
    },
    propertyText: {
        fontSize: 13,
        color: '#6BC24A',
        fontWeight: '600',
    },

    /* CARD ANÁLISES */
    analysesCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: '#FFF',
        borderRadius: 14,
        marginTop: 16,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        elevation: 1,
    },
    analysesLabel: {
        fontSize: 14,
        color: '#1A2C3E',
        fontWeight: '500',
    },
    analysesBadge: {
        backgroundColor: '#6BC24A',
        borderRadius: 8,
        paddingHorizontal: 18,
        paddingVertical: 8,
        minWidth: 48,
        alignItems: 'center',
    },
    analysesValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFF',
    },

    /* SECTION */
    sectionHeader: {
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A2C3E',
    },

    /* MENU */
    menuCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        marginHorizontal: 20,
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        gap: 12,
    },
    menuItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    menuIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#F0FDF4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuContent: {
        flex: 1,
    },
    menuLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1A2C3E',
    },
    menuSubtitle: {
        fontSize: 12,
        color: '#888',
        marginTop: 1,
    },

    /* BOTÃO EDITAR */
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#6BC24A',
        borderRadius: 25,
        paddingVertical: 14,
        marginHorizontal: 20,
        marginTop: 20,
    },
    editButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFF',
    },

    /* BOTÃO SAIR */
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#fff4f4',
        borderRadius: 25,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: '#FED7D7',
        marginHorizontal: 20,
        marginTop: 12,
    },
    logoutText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#E53E3E',
    },
});