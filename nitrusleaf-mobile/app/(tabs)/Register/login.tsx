// // app/login.tsx - LOGIN PAGE
// import React, { useState } from "react";
// import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
// import { useRouter } from "expo-router";

// // Importações dos componentes
// import { Background } from "@/components/ui/background";
// import { Input } from "@/components/ui/input";
// import { LoginButton, GoogleButton2 } from "@/components/ui/button";

// export default function LoginScreen() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = () => {
//     if (email.trim() && password.trim()) {
//       console.log("Login:", { email, password });
//       // Aqui você faria a autenticação
//       // Para teste, vamos redirecionar para a home
//       router.replace("/(tabs)/home");
//     } else {
//       alert("Por favor, preencha email e senha");
//     }
//   };

//   const handleGoogleLogin = () => {
//     console.log("Login com Google");
//     // Implementar login com Google aqui
//   };

//   const handleRegister = () => {
//     router.push("/register");
//   };

//   return (
//     <Background>
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <Text style={styles.welcomeText}>Bem vindo!</Text>
//           <Text style={styles.subtitle}>Entre na sua conta</Text>
//         </View>

//         <View style={styles.form}>
//           <Text style={styles.label}>E-mail ou número:</Text>
//           <Input
//             placeholder="Email ou número de telefone"
//             size="size-327"
//             variant="default"
//             value={email}
//             onChangeText={setEmail}
//             keyboardType="email-address"
//           />

//           <Text style={styles.label}>Senha:</Text>
//           <Input
//             placeholder="Digite sua senha"
//             size="size-327"
//             variant="default"
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry={true}
//           />

//           <TouchableOpacity style={styles.forgotPassword}>
//             <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
//           </TouchableOpacity>

//           <LoginButton onPress={handleLogin} />
          
//           <View style={styles.divider}>
//             <View style={styles.dividerLine} />
//             <Text style={styles.dividerText}>ou</Text>
//             <View style={styles.dividerLine} />
//           </View>

//           <GoogleButton2 onPress={handleGoogleLogin} />

//           <View style={styles.registerContainer}>
//             <Text style={styles.registerText}>
//               Não possui uma conta?{" "}
//             </Text>
//             <TouchableOpacity onPress={handleRegister}>
//               <Text style={styles.registerLink}>Fazer cadastro</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Background>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 24,
//   },
//   header: {
//     alignItems: "center",
//     marginBottom: 40,
//   },
//   welcomeText: {
//     fontSize: 32,
//     fontWeight: "bold",
//     color: "#2B2B2B",
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#666",
//   },
//   form: {
//     width: "100%",
//     alignItems: "center",
//   },
//   label: {
//     fontSize: 14,
//     color: "#2B2B2B",
//     marginBottom: 4,
//     alignSelf: "flex-start",
//     left: 50,
//     marginLeft: 8,
//     fontWeight: "500",
//   },
//   forgotPassword: {
//     alignSelf: "center",
//     marginBottom: 20,
//     marginTop: 4,
//   },
//   forgotPasswordText: {
//     fontSize: 12,
//     color: "#6BC24A",
//     fontWeight: "500",
//   },
//   divider: {
//     flexDirection: "row",
//     alignItems: "center",
//     width: "100%",
//     marginVertical: 20,
//   },
//   dividerLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: "#E5E5E5",
//   },
//   dividerText: {
//     marginHorizontal: 16,
//     color: "#999",
//     fontSize: 12,
//   },
//   registerContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 24,
//   },
//   registerText: {
//     fontSize: 14,
//     color: "#666",
//   },
//   registerLink: {
//     fontSize: 14,
//     color: "#6BC24A",
//     fontWeight: "600",
//   },
// });