import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/contexts/AuthContext";
import { getPropertiesByUser } from "@/repositories/propertyRepository";
import type { Property } from "@/types/property";

const SELECTED_PROPERTY_KEY = "@nitrusleaf/selected_property_id";

type PropertyContextValue = {
  properties: Property[];
  selectedProperty: Property | null;
  loading: boolean;
  refreshProperties: () => Promise<void>;
  selectProperty: (propertyId: string) => Promise<void>;
  showPropertyPicker: () => void;
  canSwitchProperty: boolean;
};

const PropertyContext = createContext<PropertyContextValue | null>(null);

export function PropertyProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const selectedProperty = useMemo(
    () =>
      properties.find((p) => p.id === selectedPropertyId) ??
      properties[0] ??
      null,
    [properties, selectedPropertyId]
  );

  const refreshProperties = useCallback(async () => {
    if (!user?.id) {
      setProperties([]);
      setSelectedPropertyId(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const props = await getPropertiesByUser(user.id);
      setProperties(props);

      const storageKey = `${SELECTED_PROPERTY_KEY}_${user.id}`;
      const stored = await AsyncStorage.getItem(storageKey);

      if (stored && props.some((p) => p.id === stored)) {
        setSelectedPropertyId(stored);
      } else if (props[0]) {
        setSelectedPropertyId(props[0].id);
        await AsyncStorage.setItem(storageKey, props[0].id);
      } else {
        setSelectedPropertyId(null);
        await AsyncStorage.removeItem(storageKey);
      }
    } catch (err) {
      console.error("[PropertyContext] refresh:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void refreshProperties();
  }, [refreshProperties]);

  const selectProperty = useCallback(
    async (propertyId: string) => {
      if (!properties.some((p) => p.id === propertyId)) return;
      setSelectedPropertyId(propertyId);
      if (user?.id) {
        await AsyncStorage.setItem(
          `${SELECTED_PROPERTY_KEY}_${user.id}`,
          propertyId
        );
      }
    },
    [properties, user?.id]
  );

  const showPropertyPicker = useCallback(() => {
    if (properties.length === 0) {
      Alert.alert(
        "Sem propriedade",
        "Cadastre uma propriedade no seu perfil para começar."
      );
      return;
    }

    if (properties.length === 1) {
      Alert.alert(
        "Propriedade ativa",
        `Você está usando: ${properties[0].name}`
      );
      return;
    }

    Alert.alert(
      "Trocar propriedade",
      "Selecione a propriedade que deseja visualizar:",
      [
        ...properties.map((p) => ({
          text: p.id === selectedPropertyId ? `${p.name} ✓` : p.name,
          onPress: () => void selectProperty(p.id),
        })),
        { text: "Cancelar", style: "cancel" as const },
      ]
    );
  }, [properties, selectedPropertyId, selectProperty]);

  const value = useMemo(
    () => ({
      properties,
      selectedProperty,
      loading,
      refreshProperties,
      selectProperty,
      showPropertyPicker,
      canSwitchProperty: properties.length > 1,
    }),
    [
      properties,
      selectedProperty,
      loading,
      refreshProperties,
      selectProperty,
      showPropertyPicker,
    ]
  );

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperty(): PropertyContextValue {
  const ctx = useContext(PropertyContext);
  if (!ctx) {
    throw new Error("useProperty deve ser usado dentro de PropertyProvider");
  }
  return ctx;
}
