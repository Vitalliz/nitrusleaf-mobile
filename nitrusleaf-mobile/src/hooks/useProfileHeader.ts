import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useAuth } from "@/contexts/AuthContext";
import { DEFAULT_AVATAR } from "@/constants/profile";
import {
  getUsuarioDetails,
  type UsuarioDetails,
} from "@/repositories/profileRepository";
import { getPropertiesByUser } from "@/repositories/propertyRepository";
import type { Property } from "@/types/property";

export function useProfileHeader() {
  const { user } = useAuth();
  const isFocused = useIsFocused();
  const [dbUser, setDbUser] = useState<UsuarioDetails | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const details = await getUsuarioDetails(user.id);
        setDbUser(details);
        const props = await getPropertiesByUser(user.id);
        setProperty(props?.[0] ?? null);
      } catch (err) {
        console.error("[useProfileHeader]", err);
      } finally {
        setLoading(false);
      }
    }
    if (isFocused) void load();
  }, [user?.id, isFocused]);

  return {
    loading,
    dbUser,
    property,
    userName: loading
      ? "Carregando..."
      : dbUser?.fullName || user?.name || "Usuário",
    userSubtitle: loading
      ? "Carregando..."
      : property?.name || "Sem propriedade",
    userAvatar: dbUser?.avatarUrl || DEFAULT_AVATAR,
  };
}
