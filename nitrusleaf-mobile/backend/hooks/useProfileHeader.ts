import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useProperty } from "@/contexts/PropertyContext";
import { DEFAULT_AVATAR } from "@/constants/profile";
import {
  getUsuarioDetails,
  type UsuarioDetails,
} from "@/repositories/profileRepository";

export function useProfileHeader() {
  const { user } = useAuth();
  const {
    selectedProperty,
    loading: propertyLoading,
    refreshProperties,
    showPropertyPicker,
    canSwitchProperty,
  } = useProperty();
  const [dbUser, setDbUser] = useState<UsuarioDetails | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function load() {
        if (!user?.id) {
          if (isActive) setUserLoading(false);
          return;
        }
        try {
          if (isActive) setUserLoading(true);
          const details = await getUsuarioDetails(user.id);
          if (isActive) setDbUser(details);
        } catch (err) {
          console.error("[useProfileHeader]", err);
        } finally {
          if (isActive) setUserLoading(false);
        }
      }

      void load();
      void refreshProperties();

      return () => {
        isActive = false;
      };
    }, [user?.id, refreshProperties])
  );

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