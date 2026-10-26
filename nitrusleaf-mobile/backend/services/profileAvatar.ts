import * as ImagePicker from "expo-image-picker";
import { getSupabase } from "@/services/supabase";

export type PickAvatarResult = {
  cancelled: boolean;
  localUri?: string;
};

export async function pickProfileImageFromDevice(
  useCamera = false
): Promise<PickAvatarResult> {
  const permission = useCamera
    ? await ImagePicker.requestCameraPermissionsAsync()
    : await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    throw new Error(
      useCamera
        ? "Permissão da câmera negada. Ative nas configurações do dispositivo."
        : "Permissão da galeria negada. Ative nas configurações do dispositivo."
    );
  }

  const result = useCamera
    ? await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      })
    : await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

  if (result.canceled || !result.assets?.[0]?.uri) {
    return { cancelled: true };
  }

  return { cancelled: false, localUri: result.assets[0].uri };
}

export async function uploadProfileAvatar(
  userId: string,
  localUri: string
): Promise<string> {
  const supabase = getSupabase();
  const path = `user-${userId}-${Date.now()}.jpg`;

  const response = await fetch(localUri);
  if (!response.ok) {
    throw new Error("Não foi possível ler a imagem selecionada.");
  }
  const blob = await response.blob();

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, blob, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Não foi possível enviar a foto de perfil: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  if (!data.publicUrl) {
    throw new Error("O upload foi concluído, mas não foi possível obter a URL da foto.");
  }
  return data.publicUrl;
}
