// components/UserList.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { useDatabase } from '../hooks/useDatabase';
import { User } from '../types/database';

export const UserList = () => {
  // 🎣 USA O HOOK DO BANCO - pega estados e operações
  const { isInitialized, isLoading, getUsers, createUser } = useDatabase();
  
  // 📊 ESTADO LOCAL: Armazena lista de usuários
  const [users, setUsers] = useState<User[]>([]);

  // 🔄 EFEITO: Carrega usuários quando banco estiver pronto
  useEffect(() => {
    if (isInitialized) {
      loadUsers();  // Banco pronto, pode carregar dados
    }
  }, [isInitialized]);  // Executa quando isInitialized mudar

  // 📥 FUNÇÃO: Busca usuários do banco
  const loadUsers = async () => {
    try {
      // ⚡ CHAMA OPERAÇÃO DO BANCO ⚡
      const usersData = await getUsers();
      
      // 🗂️ ATUALIZA ESTADO COM DADOS RECEBIDOS
      setUsers(usersData);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  // ➕ FUNÇÃO: Adiciona novo usuário
  const handleAddUser = async () => {
    try {
      // ⚡ CHAMA OPERAÇÃO DE CRIAÇÃO ⚡
      await createUser({
        name: `Usuário ${Date.now()}`,  // Nome único
        email: `user${Date.now()}@email.com`
      });
      
      // 🔄 RECARREGA LISTA PARA MOSTRAR NOVO USUÁRIO
      await loadUsers();
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
    }
  };

  // 🎯 RENDERIZAÇÃO CONDICIONAL
  if (isLoading) {
    return <Text>Inicializando banco de dados...</Text>;
  }

  if (!isInitialized) {
    return <Text>Erro ao inicializar banco de dados</Text>;
  }

  // 🖥️ INTERFACE PRINCIPAL
  return (
    <View style={{ padding: 16 }}>
      {/* BOTÃO PARA ADICIONAR USUÁRIO */}
      <Button title="Adicionar Usuário" onPress={handleAddUser} />
      
      {/* LISTA DE USUÁRIOS */}
      <FlatList
        data={users}  // Dados para a lista
        keyExtractor={item => item.id.toString()}  // Chave única
        renderItem={({ item }) => (  // Renderiza cada item
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
            <Text>{item.email}</Text>
            <Text style={{ fontSize: 12, color: 'gray' }}>
              Criado em: {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
};