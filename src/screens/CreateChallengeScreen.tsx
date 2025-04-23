import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Text, TextInput, useTheme } from "react-native-paper";
import { useSnackbar } from "../context/SnackbarContext"; // Ajuste o caminho conforme sua estrutura de pastas

const CreateChallengeScreen = ({ navigation }: any) => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { colors } = useTheme();

  // Usando o hook do contexto de Snackbar
  const { showSnackbar } = useSnackbar();

  // Separate validation state
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const handleCreateChallenge = async () => {
    // Check form validity
    if (!nome || !descricao) {
      setShowValidationErrors(true);
      showSnackbar("Preencha todos os campos", "error");
      return;
    }

    setIsCreating(true);
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) {
        showSnackbar("Usuário não autenticado", "error");
        setIsCreating(false);
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
        // On success, clear validation errors
        setShowValidationErrors(false);
        showSnackbar("Desafio criado com sucesso!", "success");

        // Clear the form
        setNome("");
        setDescricao("");

        // Navigate after a short delay without showing validation errors
        navigation.navigate("Home");
      } else {
        const errorData = await response.json();
        showSnackbar(
          `Falha ao criar desafio: ${
            errorData?.message || "Erro desconhecido"
          }`,
          "error"
        );
      }
    } catch (error) {
      console.error(error);
      setIsCreating(false);
      showSnackbar("Erro na comunicação com o servidor", "error");
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
            onChangeText={(text) => {
              setNome(text);
              if (text) setShowValidationErrors(false);
            }}
            style={styles.input}
            mode="outlined"
            error={showValidationErrors && !nome}
          />

          <TextInput
            label="Descrição do Desafio"
            value={descricao}
            onChangeText={(text) => {
              setDescricao(text);
              if (text) setShowValidationErrors(false);
            }}
            style={styles.input}
            multiline
            numberOfLines={4}
            mode="outlined"
            error={showValidationErrors && !descricao}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  card: {
    width: "100%",
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
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
