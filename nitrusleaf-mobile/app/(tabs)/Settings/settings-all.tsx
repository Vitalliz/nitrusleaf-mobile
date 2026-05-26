// app/(tabs)/Settings/settings-all.tsx — Tela de Configurações do Usuário
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { openAddProperty } from '@/utils/navigation';
import { Background } from '@/components/ui/background';
import BottomNavbar from '@/components/ui/tab-bar';
import { useAuth } from '@/contexts/AuthContext';

import { useIsFocused } from '@react-navigation/native';
import { getUsuarioDetails } from '@/repositories/profileRepository';
import { getPropertiesByUser } from '@/repositories/propertyRepository';

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle: string;
  route?: string;
  danger?: boolean;
};

const MENU_ITEMS: MenuItem[] = [
  {
    icon: 'person-outline',
    label: 'Dados Pessoais',
    subtitle: 'Nome, telefone e e-mail',
    route: '/(tabs)/Settings/personal-dates',
  },
  {
    icon: 'business-outline',
    label: 'Dados da Propriedade',
    subtitle: 'Fazenda, área e localização',
    route: '/(tabs)/Settings/property-dates',
  },
  {
    icon: 'add-circle-outline',
    label: 'Nova propriedade',
    subtitle: 'Cadastrar outra fazenda ou sítio',
    route: '/(tabs)/add-property',
  },
  {
    icon: 'pencil-outline',
    label: 'Editar Perfil',
    subtitle: 'Altere foto e informações',
    route: '/(tabs)/Settings/profile-edit',
  },
  {
    icon: 'notifications-outline',
    label: 'Notificações',
    subtitle: 'Alertas e preferências',
  },
  {
    icon: 'help-circle-outline',
    label: 'Ajuda e Suporte',
    subtitle: 'Contate nossa equipe',
  },
  {
    icon: 'settings-outline',
    label: 'Configurações da Conta',
    subtitle: 'Verifique seu email e senha',
    route: '/(tabs)/Settings/profile-new'
  },
];