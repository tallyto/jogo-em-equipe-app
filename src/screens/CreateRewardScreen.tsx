import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
    ActivityIndicator,
    Button,
    Card,
    Text,
    TextInput,
    useTheme,
} from "react-native-paper";

interface CreateRewardScreenProps {
  route: any;
  navigation: any;
}

const CreateRewardScreen: React.FC<CreateRewardScreenProps> = ({ route, navigation }) => {
  const { challengeId, challengeName } = route.params;
  const { colors } = useTheme();
  const [nome, setNome] = useState<string>("");
  const [custoPontos, setCustoPontos] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [nomeError, setNomeError] = useState<string | null>(null);
  const [custoPontosError, setCustoPontosError] = useState<string | null>(null);

  const handleCreateReward = async () => {
    let isValid = true;

    if (!nome.trim()) {
      setNomeError("O nome da recompensa é obrigatório.");
      isValid = false;
    } else {
      setNomeError(null);
    }

    if (!custoPontos.trim()) {
      setCustoPontosError("O custo em pontos é obrigatório.");
      isValid = false;
    } else {
      const pontos = parseInt(custoPontos, 10);
      if (isNaN(pontos) || pontos <= 0) {
        setCustoPontosError("O custo deve ser um número maior que zero.");
        isValid = false;
      } else {
        setCustoPontosError(null);
      }
    }

    if (!isValid) {
      return;
    }

    setLoading(true);

    const token = await SecureStore.getItemAsync("userToken");
    if (!token) {
      alert("Não autenticado");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://10.0.2.2:3002/api/recompensas`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          custoPontos: parseInt(custoPontos, 10),
          desafioId: challengeId,
        }),
      });

      if (response.ok) {
        alert("Recompensa criada!");
        navigation.goBack();
      } else {
        const errorData = await response.json();
        alert(`Erro ao criar recompensa: ${errorData?.message || "Verifique os dados."}`);
      }
    } catch (error: any) {
      console.error("Erro ao criar recompensa:", error);
      alert("Erro de conexão ao criar recompensa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>
            Criar Recompensa
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Desafio: {challengeName}
          </Text>
          <TextInput
            label="Nome da Recompensa"
            value={nome}
            onChangeText={setNome}
            style={styles.input}
            mode="outlined"
            error={!!nomeError}
          />
          {!!nomeError && <Text style={styles.errorText}>{nomeError}</Text>}
          <TextInput
            label="Custo em Pontos"
            value={custoPontos}
            onChangeText={setCustoPontos}
            style={styles.input}
            keyboardType="number-pad"
            mode="outlined"
            error={!!custoPontosError}
          />
          {!!custoPontosError && (
            <Text style={styles.errorText}>{custoPontosError}</Text>
          )}
          {loading ? (
            <ActivityIndicator size="large" style={styles.loader} />
          ) : (
            <Button
              mode="contained"
              onPress={handleCreateReward}
              style={styles.button}
              disabled={loading}
            >
              Criar Recompensa
            </Button>
          )}
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
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    marginBottom: 16,
    color: "#555",
    textAlign: "center",
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
  },
  loader: {
    marginTop: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 8,
  },
});

export default CreateRewardScreen;