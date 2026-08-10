import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ROUTES, exitAnalysisFlow } from '@/utils/navigation';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useIsFocused } from '@react-navigation/native';
import Constants from 'expo-constants';
const getApiUrl = () => {
  const hostUri = Constants.expoConfig?.hostUri;
  const hostIp = hostUri ? hostUri.split(':')[0] : null;

  if (hostIp) {
    return `http://${hostIp}:5000/predict`;
  }
  if (__DEV__) {
    return 'http://10.0.2.2:5000/predict';
  }
  return 'http://192.168.1.37:5000/predict';
};

export default function RealCameraScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  const sendImageToApi = async (uri: string) => {
    const API_URL = getApiUrl();

    const formData = new FormData();
    formData.append('imagem', {
      uri,
      type: 'image/jpeg',
      name: 'folha.jpg',
    } as any);

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const resultado = await response.json();

    if (resultado.status === 'sucesso') {
      router.push({
        pathname: ROUTES.analysisSummary,
        params: {
          analysisId: Date.now().toString(),
          probability: String(resultado.probabilidade),
          deficiencyType: String(resultado.classe_nome ?? ''),
          imageUri: uri,
        },
      });
      return;
    }

    Alert.alert('Erro', resultado.mensagem || 'Erro ao analisar imagem');
    setIsProcessing(false);
  };

  const handleCapture = async () => {
    if (!cameraRef.current || !isCameraReady || isProcessing) {
      Alert.alert('Aguarde', 'A câmera ainda não está pronta.');
      return;
    }

    setIsProcessing(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });

      if (!photo?.uri) {
        Alert.alert('Erro', 'Não foi possível capturar a foto.');
        setIsProcessing(false);
        return;
      }

      await sendImageToApi(photo.uri);
    } catch (error) {
      console.error('Erro ao capturar/enviar foto:', error);
      Alert.alert('Erro', 'Não foi possível processar a foto. Verifique sua conexão.');
      setIsProcessing(false);
    }
  };

  const handleLocation = async () => {
    if (isProcessing) return;

    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permissão necessária',
          'Precisamos acessar suas fotos para escolher uma imagem da galeria.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.[0]?.uri) return;

      setIsProcessing(true);
      await sendImageToApi(result.assets[0].uri);
    } catch (error) {
      console.error('Erro ao selecionar/enviar imagem:', error);
      Alert.alert('Erro', 'Não foi possível processar a imagem. Verifique sua conexão.');
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    exitAnalysisFlow(router);
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6BC24A" />
        <Text style={styles.loadingText}>Carregando câmera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Ionicons name="camera-outline" size={64} color="#FFFFFF" />
        <Text style={styles.permissionText}>
          Precisamos de permissão para acessar a câmera
        </Text>
        <Text style={styles.permissionSubtext}>
          Isso é necessário para escanear as folhas e detectar deficiências
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Conceder Permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && (
        <>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
            onCameraReady={() => setIsCameraReady(true)}
          /><View style={styles.overlay}>
            <View style={styles.gridContainer}>
              <View style={styles.gridLineHorizontal} />
              <View style={styles.gridLineVertical} />
              <View style={styles.gridCornerTL} />
              <View style={styles.gridCornerTR} />
              <View style={styles.gridCornerBL} />
              <View style={styles.gridCornerBR} />
            </View>
          </View><View style={styles.topBadgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>ESCANEANDO</Text>
              <ActivityIndicator color="#FFFFFF" size="small" style={styles.badgeIndicator} />
            </View>
          </View><TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse-outline" size={28} color="#FFFFFF" />
          </TouchableOpacity><View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>
              Centralize a folha no centro da grade
            </Text>
          </View>{isProcessing && (
            <View style={styles.processingOverlay}>
              <View style={styles.processingCard}>
                <ActivityIndicator size="large" color="#6BC24A" />
                <Text style={styles.processingText}>Processando imagem...</Text>
              </View>
            </View>
          )}<View style={[styles.bottomControls, { bottom: insets.bottom + 5 }]}>
            <TouchableOpacity style={styles.sideButton} onPress={handleBack}>
              <Ionicons name="arrow-back" size={28} color="#2B2B2B" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.captureButton,
                (!isCameraReady || isProcessing) && styles.captureButtonDisabled,
              ]}
              onPress={handleCapture}
              disabled={!isCameraReady || isProcessing}
            >
              <Ionicons name="camera-outline" size={36} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.sideButton} onPress={handleLocation}>
              <Ionicons name="images-outline" size={28} color="#2B2B2B" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    right: '10%',
    bottom: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridLineHorizontal: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  gridLineVertical: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  gridCornerTL: {
    position: 'absolute',
    top: -20,
    left: -20,
    width: 40,
    height: 40,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#FFFFFF',
  },
  gridCornerTR: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 40,
    height: 40,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#FFFFFF',
  },
  gridCornerBL: {
    position: 'absolute',
    bottom: -5,
    left: -20,
    width: 40,
    height: 40,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#FFFFFF',
  },
  gridCornerBR: {
    position: 'absolute',
    bottom: -5,
    right: -20,
    width: 40,
    height: 40,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#FFFFFF',
  },
  topBadgeContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6BC24A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 5,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 1,
    fontSize: 14,
  },
  badgeIndicator: {
    marginLeft: 8,
  },
  flipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  processingText: {
    fontSize: 16,
    color: '#1A2C3E',
    fontWeight: '500',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  sideButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 5,
  },
  captureButton: {
    width: 75,
    height: 75,
    borderRadius: 42,
    backgroundColor: '#6BC24A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 5,
  },
  captureButtonDisabled: {
    backgroundColor: '#CCCCCC',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 16,
    fontSize: 16,
  },
  permissionText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  permissionSubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  permissionButton: {
    backgroundColor: '#6BC24A',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
