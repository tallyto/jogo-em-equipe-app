import React, { useState, useEffect } from "react";
import { StyleSheet, View, Alert, FlatList, TouchableOpacity } from "react-native";
import { Button, Text, TextInput, List, useTheme, ActivityIndicator } from "react-native-paper";
import * as SecureStore from "expo-secure-store";

const CreateChallengeScreen = ({ navigation }: any) => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [challenges, setChallenges] = useState<any[]>([]);
  const { colors } = useTheme();

  const loadChallenges = async () => {
    setIsLoading(true);
    const token = await SecureStore.getItemAsync("userToken");
    if (!token) {
      Alert.alert("Usuário não autenticado");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://10.0.2.2:3002/api/desafios", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setChallenges(data);
      } else {
        Alert.alert("Falha ao carregar desafios");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro na comunicação com o servidor");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChallenges();
  }, []);

  const handleCreateChallenge = async () => {
    if (!nome || !descricao) {
      Alert.alert("Preencha todos os campos");
      return;
    }

    setIsCreating(true);
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) {
        Alert.alert("Usuário não autenticado");
        return;
      }

      const response = await fetch("http://10.0.2.2:3002/api/desafios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome, descricao }),
      });

      setIsCreating(false);
      if (response.ok) {
        Alert.alert("Desafio criado com sucesso!");
        loadChallenges();
        setNome("");
        setDescricao("");
      } else {
        Alert.alert("Falha ao criar desafio");
      }
    } catch (error) {
      console.error(error);
      setIsCreating(false);
      Alert.alert("Erro na comunicação com o servidor");
    }
  };

  const renderChallengeItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ChallengeDetails', { challenge: item })} style={styles.challengeItem}>
      <List.Item
        title={item.nome}
        description={item.descricao}
        left={(props) => <List.Icon {...props} icon="trophy" color={colors.primary} />}
        style={styles.listItem}
      />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando desafios...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Criar Desafio
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          label="Nome do Desafio"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Descrição do Desafio"
          value={descricao}
          onChangeText={setDescricao}
          style={styles.input}
          multiline
          mode="outlined"
        />

        <Button
          mode="contained"
          onPress={handleCreateChallenge}
          style={styles.createButton}
          loading={isCreating}
        >
          {isCreating ? "Criando..." : "Criar Desafio"}
        </Button>
      </View>

      <Text variant="titleLarge" style={styles.challengeListTitle}>
        Desafios Existentes
      </Text>

      {challenges.length > 0 ? (
        <FlatList
          data={challenges}
          renderItem={renderChallengeItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <Text style={styles.emptyListText}>Nenhum desafio criado ainda.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f6f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#555',
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 32,
  },
  input: {
    marginBottom: 16,
  },
  createButton: {
    marginTop: 16,
    borderRadius: 8,
  },
  challengeListTitle: {
    marginTop: 32,
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  challengeItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  listItem: {
    paddingVertical: 12,
  },
  emptyListText: {
    textAlign: 'center',
    color: '#777',
    fontSize: 16,
  },
});

export default CreateChallengeScreen;