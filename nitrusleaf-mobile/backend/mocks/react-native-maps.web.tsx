import React from "react";
import { Text, View } from "react-native";

type MapViewProps = React.ComponentProps<typeof View> & {
  children?: React.ReactNode;
};

function MapView({ children, style, ...rest }: MapViewProps) {
  return (
    <View style={[{ minHeight: 200, backgroundColor: "#E8E8E8" }, style]} {...rest}>
      <Text style={{ padding: 12, color: "#666", textAlign: "center" }}>
        Mapa disponível apenas no app nativo (Android/iOS)
      </Text>
      {children}
    </View>
  );
}

function Marker(_props: Record<string, unknown>) {
  return null;
}

function Circle(_props: Record<string, unknown>) {
  return null;
}

const PROVIDER_GOOGLE = "google";

export default MapView;
export { Circle, Marker, PROVIDER_GOOGLE };
