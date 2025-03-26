import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, Alert } from "react-native";
import {
  Text,
  Button,
  useTheme,
  List,
  ActivityIndicator,
} from "react-native-paper";
import * as SecureStore from "expo-secure-store";

interface ChallengeDetailsScreenProps {
  route: any;
  navigation: any;
}

interface Task {
  id: string;
  descricao: string;
  pontos: number;
  status: string;
  // Outras propriedades da sua tarefa
}

const ChallengeDetailsScreen: React.FC<ChallengeDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const { challenge } = route.params;
  const { colors } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [errorTasks, setErrorTasks] = useState<string | null>(null);

  const loadTasks = async () => {
    setLoadingTasks(true);
    setErrorTasks(null);
    const token = await SecureStore.getItemAsync("userToken");
    if (!token) {
      setErrorTasks("Usuário não autenticado.");
      setLoadingTasks(false);
      return;
    }

    try {
      const response = await fetch(
        `http://10.0.2.2:3002/api/desafios/${challenge.id}/tarefas`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        const errorData = await response.json();
        setErrorTasks(errorData?.message || "Erro ao carregar tarefas.");
      }
    } catch (error: any) {
      console.error("Erro ao carregar tarefas:", error);
      setErrorTasks("Erro de conexão ao carregar tarefas.");
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    if (challenge?.id) {
      loadTasks();
    }
  }, [challenge?.id]);

  const renderTaskItem = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <List.Item
        title={item.descricao}
        description={`Pontos: ${item.pontos} - Status: ${item.status.replace(
          /_/g,
          " "
        )}`}
        left={(props) => (
          <List.Icon
            {...props}
            icon="check-circle-outline"
            color={colors.primary}
          />
        )}
      />
    </View>
  );

  if (!challenge) {
    return <Text style={styles.notFoundText}>Desafio não encontrado!</Text>;
  }

  const handleCreateTask = () => {
    navigation.navigate("CreateTask", { challengeId: challenge.id });
  };

  const handleCreateReward = () => {
    navigation.navigate("CreateReward", { challengeId: challenge.id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineLarge" style={styles.title}>
          {challenge.nome}
        </Text>
        <Text style={styles.description}>{challenge.descricao}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleCreateTask}
          style={[styles.button, { backgroundColor: colors.primary }]}
          labelStyle={styles.buttonLabel}
        >
          Criar Tarefa
        </Button>
        <Button
          mode="contained"
          onPress={handleCreateReward}
          style={[
            styles.button,
            { backgroundColor: colors.secondaryContainer },
          ]}
          labelStyle={[
            styles.buttonLabel,
            { color: colors.onSecondaryContainer },
          ]}
        >
          Criar Recompensa
        </Button>
      </View>

      <View style={styles.tasksSection}>
        <Text variant="titleLarge" style={styles.tasksTitle}>
          Tarefas
        </Text>
        {loadingTasks ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : errorTasks ? (
          <Text style={styles.errorText}>{errorTasks}</Text>
        ) : tasks.length > 0 ? (
          <FlatList
            data={tasks}
            renderItem={renderTaskItem}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <Text style={styles.emptyTasksText}>
            Nenhuma tarefa criada para este desafio ainda.
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f6f8",
    justifyContent: "space-between", // Ajustado para melhor espaçamento
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: 10,
  },
  description: {
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center",
    color: "#555",
    fontSize: 16,
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  button: {
    marginTop: 16,
    width: "90%",
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
  },
  notFoundText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontSize: 18,
    color: "red",
  },
  tasksSection: {
    flex: 1, // Para que a lista de tarefas possa ocupar o espaço restante
    marginTop: 20,
  },
  tasksTitle: {
    marginBottom: 16,
    color: "#333",
    fontWeight: "bold",
    textAlign: "center",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  emptyTasksText: {
    color: "#777",
    textAlign: "center",
  },
  taskItem: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
});

export default ChallengeDetailsScreen;
