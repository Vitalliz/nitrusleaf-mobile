import { useState } from "react";
import { userRepository } from "../repositories/userRepository";

export function useRegisterViewModel() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function register() {
    try {
      setLoading(true);
      setError("");

      if (!name || !email || !password) {
        setError("Preencha todos os campos");
        return;
      }

      await userRepository.create({
        name,
        email,
        password,
      });

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Erro ao cadastrar usuário");
    } finally {
      setLoading(false);
    }
  }

  return {
    name,
    email,
    password,
    loading,
    error,
    success,

    setName,
    setEmail,
    setPassword,
    register,
  };
}
