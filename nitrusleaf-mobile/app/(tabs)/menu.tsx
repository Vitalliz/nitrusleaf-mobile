// // app/(tabs)/menu.tsx - Tela da câmera real favor não apagar
// import React, { useState, useRef, useEffect } from 'react';
// import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import { CameraView, useCameraPermissions } from 'expo-camera';
// import { Background } from '@/components/ui/background';

// export default function MenuScreen() {
//   const router = useRouter();
//   const cameraRef = useRef(null);
//   const [facing, setFacing] = useState<'back'>('back');
//   const [permission, requestPermission] = useCameraPermissions();
//   const [isCameraReady, setIsCameraReady] = useState(false);

//   useEffect(() => {
//     if (permission && !permission.granted) {
//       requestPermission();
//     }
//   }, [permission]);

//   const handleBack = () => {
//     router.back();
//   };

//   const handleCapture = async () => {
//     if (!cameraRef.current || !isCameraReady) return;
    
//     try {
//       const photo = await cameraRef.current.takePictureAsync({
//         quality: 0.8,
//         skipProcessing: true,
//       });
      
//       // Aqui você pode salvar a foto ou processá-la
//       console.log('Foto capturada:', photo.uri);
      
//       // Mostrar feedback visual
//       Alert.alert('Sucesso!', 'Foto capturada com sucesso!', [
//         { text: 'OK' }
//       ]);
      
//     } catch (error) {
//       console.error('Erro ao capturar foto:', error);
//       Alert.alert('Erro', 'Não foi possível capturar a foto.');
//     }
//   };

//   const handleLocation = () => {
//     router.push('/(tabs)/analysis');
//   };

//   if (!permission) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#6BC24A" />
//         <Text style={styles.loadingText}>Carregando câmera...</Text>
//       </View>
//     );
//   }

//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.permissionText}>Precisamos de permissão para acessar a câmera</Text>
//         <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//           <Text style={styles.permissionButtonText}>Conceder Permissão</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <Background>
//       <CameraView
//         ref={cameraRef}
//         style={styles.camera}
//         facing={facing}
//         onCameraReady={() => setIsCameraReady(true)}
//       >
//         {/* Overlay com grade para auxiliar o enquadramento */}
//         <View style={styles.overlay}>
//           <View style={styles.gridContainer}>
//             <View style={styles.gridLineHorizontal} />
//             <View style={styles.gridLineVertical} />
//           </View>
//         </View>

//         {/* Badge superior "ESCANEANDO" */}
//         <View style={styles.topBadgeContainer}>
//           <View style={styles.badge}>
//             <Text style={styles.badgeText}>ESCANEANDO</Text>
//             <ActivityIndicator color="#FFFFFF" style={{ marginLeft: 8 }} />
//           </View>
//         </View>

//         {/* Controles inferiores */}
//         <View style={styles.bottomControls}>
//           <TouchableOpacity style={styles.sideButton} onPress={handleBack}>
//             <Ionicons name="return-down-back" size={28} color="#2B2B2B" />
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={[
//               styles.captureButton,
//               !isCameraReady && styles.captureButtonDisabled
//             ]} 
//             onPress={handleCapture}
//             disabled={!isCameraReady}
//           >
//             <Ionicons name="camera" size={36} color="#FFFFFF" />
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.sideButton} onPress={handleLocation}>
//             <Ionicons name="location" size={28} color="#2B2B2B" />
//           </TouchableOpacity>
//         </View>
//       </CameraView>
//     </Background>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   camera: {
//     flex: 1,
//     width: '100%',
//   },
//   overlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   gridContainer: {
//     width: '80%',
//     height: '60%',
//     position: 'relative',
//   },
//   gridLineHorizontal: {
//     position: 'absolute',
//     top: '50%',
//     left: 0,
//     right: 0,
//     height: 1,
//     backgroundColor: 'rgba(255, 255, 255, 0.5)',
//   },
//   gridLineVertical: {
//     position: 'absolute',
//     left: '50%',
//     top: 0,
//     bottom: 0,
//     width: 1,
//     backgroundColor: 'rgba(255, 255, 255, 0.5)',
//   },
//   topBadgeContainer: {
//     position: 'absolute',
//     top: 40,
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//   },
//   badge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#57B33E',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 12,
//   },
//   badgeText: {
//     color: '#FFFFFF',
//     fontWeight: '700',
//     letterSpacing: 0.5,
//     fontSize: 14,
//   },
//   bottomControls: {
//     position: 'absolute',
//     bottom: 24,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 24,
//   },
//   sideButton: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: '#FFFFFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 4,
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
//     elevation: 6,
//     borderWidth: 4,
//     borderColor: 'rgba(255, 255, 255, 0.8)',
//   },
//   captureButtonDisabled: {
//     backgroundColor: '#CCCCCC',
//     borderColor: 'rgba(255, 255, 255, 0.4)',
//   },
//   loadingText: {
//     color: '#FFFFFF',
//     marginTop: 16,
//     fontSize: 16,
//   },
//   permissionText: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     textAlign: 'center',
//     marginBottom: 20,
//     paddingHorizontal: 20,
//   },
//   permissionButton: {
//     backgroundColor: '#6BC24A',
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   permissionButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// app/(tabs)/menu.tsx - Tela do menuzinho com background da análise
import React from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MenuScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleCapture = () => {
    // Ação principal (ex.: abrir câmera real no futuro)
    console.log('Capturar');
  };

  const handleLocation = () => {
    router.push('/(tabs)/analysis');
  };

  return (
    <ImageBackground
      source={require('@/assets/images/icons/analise_exemplo.png')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Badge superior "ESCANEANDO" */}
      <View style={styles.topBadgeContainer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>ESCANEANDO</Text>
          <ActivityIndicator color="#FFFFFF" style={{ marginLeft: 8 }} />
        </View>
      </View>

      {/* Controles inferiores */}
      <View style={styles.bottomControls}>
        <TouchableOpacity style={styles.sideButton} onPress={handleBack}>
          <Ionicons name="return-down-back" size={28} color="#2B2B2B" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
          <Ionicons name="camera" size={36} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.sideButton} onPress={handleLocation}>
          <Ionicons name="location" size={28} color="#2B2B2B" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#000',
  },
  topBadgeContainer: {
    paddingTop: 40,
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#57B33E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  sideButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
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
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});

