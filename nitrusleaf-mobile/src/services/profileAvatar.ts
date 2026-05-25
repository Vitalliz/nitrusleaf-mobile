import * as ImagePicker from "expo-image-picker";
import { getSupabase } from "@/services/supabase";

export type PickAvatarResult = {
  cancelled: boolean;
  localUri?: string;
};

/** Abre galeria ou câmera para escolher foto de perfil (quadrado). */
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

/**
 * Envia imagem ao Supabase Storage (bucket `avatars`) e retorna URL pública.
 * Se o bucket não existir, grava URI local em `usuarios.foto_perfil` (funciona no mesmo aparelho).
 */
export async function uploadProfileAvatar(
  userId: string,
  localUri: string
): Promise<string> {
  const supabase = getSupabase();
  const path = `user-${userId}-${Date.now()}.jpg`;

  try {
    const response = await fetch(localUri);
    const blob = await response.blob();

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, blob, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (!uploadError) {
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      if (data?.publicUrl) return data.publicUrl;
    }
  } catch (e) {
    console.warn("[avatar] upload storage:", e);
  }

  return localUri;
}
