import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  userName: string;
  userSubtitle?: string;
  userAvatar?: string;
  subtitleIcon?: keyof typeof Ionicons.glyphMap;
  onMenuPress?: () => void;
  onAvatarPress?: () => void;
  onPropertyPress?: () => void;
  showPropertyChevron?: boolean;
}

export const Header = ({
  userName,
  userSubtitle,
  userAvatar,
  subtitleIcon = 'location-outline',
  onMenuPress,
  onAvatarPress,
  onPropertyPress,
  showPropertyChevron = false,
}: HeaderProps) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const getInitial = () => userName.charAt(0).toUpperCase();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}><TouchableOpacity
        onPress={onAvatarPress}
        style={styles.avatarButton}
        activeOpacity={0.7}
      >
        {userAvatar ? (
          <Image source={{ uri: userAvatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>{getInitial()}</Text>
          </View>
        )}
      </TouchableOpacity><View style={styles.textContainer}>
        <Text style={styles.name}>{userName}</Text>

        {userSubtitle && (
          onPropertyPress ? (
            <TouchableOpacity
              style={styles.subtitleRow}
              onPress={onPropertyPress}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Trocar propriedade"
            >
              <Ionicons name={subtitleIcon} size={13} color="#888" style={styles.subtitleIcon} />
              <Text style={styles.subtitle} numberOfLines={1}>{userSubtitle}</Text>
              {showPropertyChevron && (
                <Ionicons name="chevron-down" size={14} color="#888" style={styles.propertyChevron} />
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.subtitleRow}>
              <Ionicons name={subtitleIcon} size={13} color="#888" style={styles.subtitleIcon} />
              <Text style={styles.subtitle} numberOfLines={1}>{userSubtitle}</Text>
            </View>
          )
        )}
      </View><TouchableOpacity
        onPress={() => router.push('/(tabs)/Settings/settings-all')}
        style={styles.configButton}
        activeOpacity={0.7}
      >
        <Ionicons name="settings-outline" size={28} color="#2D2D2D" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    marginTop: 12,
  },
  avatarButton: { marginRight: 12 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
  },
  textContainer: { flex: 1 },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  subtitleIcon: { marginRight: 3 },
  subtitle: {
    fontSize: 12,
    color: '#888888',
    flexShrink: 1,
  },
  propertyChevron: { marginLeft: 2 },
  configButton: { padding: 4 },
});
