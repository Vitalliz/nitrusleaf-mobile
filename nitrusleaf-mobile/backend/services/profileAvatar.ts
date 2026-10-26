import * as ImagePicker from "expo-image-picker";
import { decode } from "base64-arraybuffer";
import { getSupabase } from "@/services/supabase";

export type PickAvatarResult = {
  cancelled: boolean;
  localUri?: string;
  base64?: string;
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
        base64: true,
      })
    : await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
        base64: true,
      });

  if (result.canceled || !result.assets?.[0]?.uri) {
    return { cancelled: true };
  }

  return {
    cancelled: false,
    localUri: result.assets[0].uri,
    base64: result.assets[0].base64 ?? undefined,
  };
}

export async function uploadProfileAvatar(
  userId: string,
  localUri: string,
  base64?: string
): Promise<string> {
  const supabase = getSupabase();
  const path = `${userId}/${Date.now()}.jpg`;

  let base64Data = base64;

  if (!base64Data && localUri.startsWith("data:")) {
    const commaIndex = localUri.indexOf(",");
    if (commaIndex !== -1) {
      base64Data = localUri.slice(commaIndex + 1);
    }
  }

  if (!base64Data) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const FileSystem = require("expo-file-system");
      if (FileSystem?.readAsStringAsync) {
        base64Data = await FileSystem.readAsStringAsync(localUri, {
          encoding: FileSystem.EncodingType?.Base64 ?? "base64",
        });
      }
    } catch {
      // Fallback below
    }
  }

  if (!base64Data) {
    try {
      const response = await fetch(localUri);
      // In React Native, local URIs (file://, content://) have status === 0, so response.ok is false.
      if (!response.ok && response.status !== 0) {
        throw new Error("Falha na resposta ao obter imagem local.");
      }
      const blob = await response.blob();
      base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const res = reader.result as string;
          const commaIdx = res.indexOf(",");
          resolve(commaIdx !== -1 ? res.slice(commaIdx + 1) : res);
        };
        reader.onerror = () => reject(new Error("Não foi possível ler a imagem selecionada."));
        reader.readAsDataURL(blob);
      });
    } catch {
      throw new Error("Não foi possível ler a imagem selecionada.");
    }
  }

  if (!base64Data) {
    throw new Error("Não foi possível ler a imagem selecionada.");
  }

  const arrayBuffer = decode(base64Data);

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, arrayBuffer, {
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
