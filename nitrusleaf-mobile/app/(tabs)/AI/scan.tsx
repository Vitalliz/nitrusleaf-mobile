// // app/camera/RealCameraScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';

export default function RealCameraScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleBack = () => {
    router.back();
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

      console.log('Foto capturada:', photo?.uri);

      // Aqui você pode enviar a foto para a API de análise
      // Por enquanto, vamos simular um resultado
      
      // Simular processamento da imagem
      setTimeout(() => {
        setIsProcessing(false);
        // Navegar para a tela de resultado com dados mock
        router.push({
          pathname: '/(tabs)/AI/result',
          params: {
            analysisId: Date.now().toString(),
            percentage: Math.floor(Math.random() * 100),
            deficiencyType: Math.random() > 0.5 ? 'Cobre' : 'Manganês',
            probability: Math.floor(Math.random() * 100),
          },
        });
      }, 1500);
    } catch (error) {
      console.error('Erro ao capturar foto:', error);
      Alert.alert('Erro', 'Não foi possível capturar a foto. Tente novamente.');
      setIsProcessing(false);
    }
  };

  const handleLocation = () => {
    router.push('/(tabs)/AI/analysis-summary');
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
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        onCameraReady={() => setIsCameraReady(true)}
      >
        {/* Overlay com grade para auxiliar o enquadramento */}
        <View style={styles.overlay}>
          <View style={styles.gridContainer}>
            <View style={styles.gridLineHorizontal} />
            <View style={styles.gridLineVertical} />
            <View style={styles.gridCornerTL} />
            <View style={styles.gridCornerTR} />
            <View style={styles.gridCornerBL} />
            <View style={styles.gridCornerBR} />
          </View>
        </View>

        {/* Badge superior "ESCANEANDO" */}
        <View style={styles.topBadgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>ESCANEANDO</Text>
            <ActivityIndicator color="#FFFFFF" size="small" style={styles.badgeIndicator} />
          </View>
        </View>

        {/* Botão de trocar câmera (canto superior direito) */}
        <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
          <Ionicons name="camera-reverse-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Texto instrucional */}
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>
            Centralize a folha no centro da grade
          </Text>
        </View>

        {/* Processando overlay */}
        {isProcessing && (
          <View style={styles.processingOverlay}>
            <View style={styles.processingCard}>
              <ActivityIndicator size="large" color="#6BC24A" />
              <Text style={styles.processingText}>Processando imagem...</Text>
            </View>
          </View>
        )}

        {/* Controles inferiores */}
        <View style={styles.bottomControls}>
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
            <Ionicons name="camera" size={36} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.sideButton} onPress={handleLocation}>
            <Ionicons name="map-outline" size={28} color="#2B2B2B" />
          </TouchableOpacity>
        </View>
      </CameraView>
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
    bottom: -20,
    left: -20,
    width: 40,
    height: 40,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#FFFFFF',
  },
  gridCornerBR: {
    position: 'absolute',
    bottom: -20,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
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
    bottom: 100,
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  captureButton: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#6BC24A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.9)',
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

// app/camera/DemoCameraScreen.tsx
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   StyleSheet,
//   ImageBackground,
//   TouchableOpacity,
//   Text,
//   ActivityIndicator,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';

// export default function DemoCameraScreen() {
//   const router = useRouter();
//   const [isScanning, setIsScanning] = useState(true);

//   useEffect(() => {
//     // Simula o escaneamento por 3 segundos
//     const timer = setTimeout(() => {
//       setIsScanning(false);
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, []);

//   const handleBack = () => {
//     router.back();
//   };

//   const handleCapture = () => {
//     // Simular captura e navegar para resultado
//     console.log('Simulando captura de folha');
//     router.push({
//       pathname: '/(tabs)/AI/analysis-summary',
//       params: {
//         analysisId: '007',
//         percentage: 87,
//         deficiencyType: 'Manganês',
//         probability: 87,
//       },
//     });
//   };

//   const handleLocation = () => {
//     router.push('/(tabs)/AI/analysis-summary');
//   };

//   return (
//     <ImageBackground
//       source={require('@/assets/images/icons/analise_exemplo.png')}
//       style={styles.background}
//       resizeMode="cover"
//     >
//       {/* Overlay escuro para melhor visibilidade dos elementos */}
//       <View style={styles.overlay}>
//         {/* Grid de enquadramento */}
//         <View style={styles.gridContainer}>
//           <View style={styles.gridLineHorizontal} />
//           <View style={styles.gridLineVertical} />
//           <View style={styles.gridCornerTL} />
//           <View style={styles.gridCornerTR} />
//           <View style={styles.gridCornerBL} />
//           <View style={styles.gridCornerBR} />
//         </View>

//         {/* Badge superior "ESCANEANDO" */}
//         <View style={styles.topBadgeContainer}>
//           <View style={styles.badge}>
//             <Text style={styles.badgeText}>ESCANEANDO</Text>
//             <ActivityIndicator color="#FFFFFF" size="small" style={styles.badgeIndicator} />
//           </View>
//         </View>

//         {/* Texto instrucional */}
//         <View style={styles.instructionContainer}>
//           <Text style={styles.instructionText}>
//             Centralize a câmera para realizar escaneamento
//           </Text>
//         </View>

//         {/* Controles inferiores */}
//         <View style={styles.bottomControls}>
//           <TouchableOpacity style={styles.sideButton} onPress={handleBack}>
//             <Ionicons name="arrow-back" size={28} color="#2B2B2B" />
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
//             <Ionicons name="camera" size={36} color="#FFFFFF" />
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.sideButton} onPress={handleLocation}>
//             <Ionicons name="map-outline" size={28} color="#2B2B2B" />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.3)',
//   },
//   gridContainer: {
//     position: 'absolute',
//     top: '20%',
//     left: '10%',
//     right: '10%',
//     bottom: '20%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   gridLineHorizontal: {
//     position: 'absolute',
//     top: '50%',
//     left: 0,
//     right: 0,
//     height: 1,
//     backgroundColor: 'rgba(255, 255, 255, 0.6)',
//   },
//   gridLineVertical: {
//     position: 'absolute',
//     left: '50%',
//     top: 0,
//     bottom: 0,
//     width: 1,
//     backgroundColor: 'rgba(255, 255, 255, 0.6)',
//   },
//   gridCornerTL: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: 30,
//     height: 30,
//     borderTopWidth: 2,
//     borderLeftWidth: 2,
//     borderColor: '#FFFFFF',
//   },
//   gridCornerTR: {
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     width: 30,
//     height: 30,
//     borderTopWidth: 2,
//     borderRightWidth: 2,
//     borderColor: '#FFFFFF',
//   },
//   gridCornerBL: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     width: 30,
//     height: 30,
//     borderBottomWidth: 2,
//     borderLeftWidth: 2,
//     borderColor: '#FFFFFF',
//   },
//   gridCornerBR: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     width: 30,
//     height: 30,
//     borderBottomWidth: 2,
//     borderRightWidth: 2,
//     borderColor: '#FFFFFF',
//   },
//   topBadgeContainer: {
//     position: 'absolute',
//     top: 60,
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//   },
//   badge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#6BC24A',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 30,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   badgeText: {
//     color: '#FFFFFF',
//     fontWeight: '700',
//     letterSpacing: 1,
//     fontSize: 14,
//   },
//   badgeIndicator: {
//     marginLeft: 8,
//   },
//   instructionContainer: {
//     position: 'absolute',
//     bottom: 100,
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//   },
//   instructionText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     textAlign: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//     borderRadius: 20,
//     overflow: 'hidden',
//   },
//   bottomControls: {
//     position: 'absolute',
//     bottom: 30,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'space-evenly',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   sideButton: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: '#FFFFFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 8,
//   },
//   captureButton: {
//     width: 84,
//     height: 84,
//     borderRadius: 42,
//     backgroundColor: '#6BC24A',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 10,
//     borderWidth: 4,
//     borderColor: 'rgba(255, 255, 255, 0.9)',
//   },
// });
