import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useAuth } from "@/contexts/AuthContext";
import { useProperty } from "@/contexts/PropertyContext";
import { DEFAULT_AVATAR } from "@/constants/profile";
import {
  getUsuarioDetails,
  type UsuarioDetails,
} from "@/repositories/profileRepository";

export function useProfileHeader() {
  const { user } = useAuth();
  const isFocused = useIsFocused();
  const {
    selectedProperty,
    loading: propertyLoading,
    refreshProperties,
    showPropertyPicker,
    canSwitchProperty,
  } = useProperty();
  const [dbUser, setDbUser] = useState<UsuarioDetails | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user?.id) {
        setUserLoading(false);
        return;
      }
      try {
        setUserLoading(true);
        const details = await getUsuarioDetails(user.id);
        setDbUser(details);
      } catch (err) {
        console.error("[useProfileHeader]", err);
      } finally {
        setUserLoading(false);
      }
    }
    if (isFocused) {
      void load();
      void refreshProperties();
    }
  }, [user?.id, isFocused, refreshProperties]);

  const loading = userLoading || propertyLoading;

  return {
    loading,
    dbUser,
    property: selectedProperty,
    userName: loading
      ? "Carregando..."
      : dbUser?.fullName || user?.name || "Usuário",
    userSubtitle: loading
      ? "Carregando..."
      : selectedProperty?.name || "Sem propriedade",
    userAvatar: dbUser?.avatarUrl || DEFAULT_AVATAR,
    showPropertyPicker,
    canSwitchProperty,
  };
}
