import Footer from "@/components/footer";
import { Background } from "@/components/ui/background";
import React from "react";
import { Image, StyleSheet } from "react-native";


export default function HomeScreen() {
  return (
      <Background>
        <Image
          source={require("@/assets/images/icons/Logo.png")}
          style={styles.logo}
        />
        <Image
          source={require("@/assets/images/icons/orange.png")}
          style={styles.orange}
        />
        <Footer />
      </Background>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 316,
    height: 100,
    resizeMode: "contain",
    top: 150,
  },
  orange: {
    width: 320,
    height: 400,
    resizeMode: "contain",
    position: "relative", 
    top: 270,
    right: 70,
  },
});


