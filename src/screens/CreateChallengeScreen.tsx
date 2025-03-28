import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme, ActivityIndicator, Snackbar, Card } from "react-native-paper";
import * as SecureStore from "expo-secure-store";

const CreateChallengeScreen = ({ navigation }: any) => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { colors } = useTheme();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const onDismissSnackbar = () => setSnackbarVisible(false);

  const handleCreateChallenge = async () => {
    if (!nome || !descricao) {
      showSnackbar("Preencha todos os campos");
      return;
    }

    setIsCreating(true);
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) {
        showSnackbar("Usuário não autenticado");
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
        showSnackbar("Desafio criado com sucesso!");
        setNome("");
        setDescricao("");
        navigation.goBack(); // Voltar para a tela anterior após a criação
      } else {
        const errorData = await response.json();
        showSnackbar(`Falha ao criar desafio: ${errorData?.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error(error);
      setIsCreating(false);
      showSnackbar("Erro na comunicação com o servidor");
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>
            Criar Desafio
          </Text>

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
            style={styles.button}
            loading={isCreating}
            disabled={isCreating}
          >
            {isCreating ? "Criando..." : "Criar Desafio"}
          </Button>
        </Card.Content>
      </Card>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismissSnackbar}
        duration={Snackbar.DURATION_SHORT}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  card: {
    width: '100%',
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    borderRadius: 8,
  },
});

export default CreateChallengeScreen;