import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { testDatabaseConnection } from "./src/database/testConnection";

export default function App() {
  const [message, setMessage] = useState("Testando conexão...");

  useEffect(() => {
    testDatabaseConnection()
      .then((msg) => setMessage(msg))
      .catch((err) => setMessage("Falha: " + err));
  }, []);

  return (
    <View style={{ padding: 32 }}>
      <Text style={{ fontSize: 20 }}>{message}</Text>
    </View>
  );
}
