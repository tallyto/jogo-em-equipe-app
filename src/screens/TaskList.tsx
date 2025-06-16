import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Avatar,
  Badge,
  Button,
  Card,
  IconButton,
  Text,
  useTheme,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useFetchData from "../hooks/useFetchData";
import { concludeTask, getTasks } from "../services/desafioService";

interface TaskListProps {
  challenge: any;
  showSnackbar: (message: string, type: "success" | "error") => void;
  onRewardRescued: () => void; // Recebe a função de callback
}

interface Task {
  id: string;
  descricao: string;
  pontos: number;
  status: string;
  resgatada: boolean;
}

const TaskList: React.FC<TaskListProps> = ({
  challenge,
  showSnackbar,
  onRewardRescued,
}) => {
  const { colors } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {
    data: fetchedTasks,
    loading: loadingTasks,
    error: errorTasks,
    fetchData,
  } = useFetchData<Task[]>();

  const loadTasks = useCallback(async () => {
    try {
      const response = await getTasks(challenge.id);
      if (response.ok) {
        const data = await response.json();
        console.log("Tasks fetched:", data);
        setTasks(data);
      } else {
        setTasks([]);
        showSnackbar("Erro ao carregar tarefas.", "error");
      }
    } catch (error) {
      setTasks([]);
      showSnackbar("Erro de conexão ao carregar tarefas.", "error");
    }
  }, [challenge?.id, showSnackbar]);

  useFocusEffect(
    useCallback(() => {
      if (challenge?.id) {
        loadTasks();
      }
      return () => {
        // Opcional: limpeza
      };
    }, [challenge?.id, loadTasks])
  );

  useEffect(() => {
    if (fetchedTasks) {
      setTasks(fetchedTasks);
    }
  }, [fetchedTasks]);

  const onRefreshTasks = useCallback(async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  }, [loadTasks]);

  const rescueTask = useCallback(
    async (taskId: string) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, resgatada: true } : task
        )
      );

      try {
        const response = await concludeTask(taskId);
        if (response.ok) {
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === taskId
                ? { ...task, status: "CONCLUIDA", resgatada: false }
                : task
            )
          );
          showSnackbar("Tarefa concluída com sucesso!", "success");
          loadTasks();
          onRewardRescued();
        } else {
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === taskId ? { ...task, resgatada: false } : task
            )
          );
          showSnackbar("Erro ao resgatar tarefa.", "error");
        }
      } catch (error) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, resgatada: false } : task
          )
        );
        showSnackbar("Erro de conexão ao concluir tarefa.", "error");
      }
    },
    [loadTasks, onRewardRescued, showSnackbar]
  );

  const renderTaskCard = useCallback(
    (task: Task & { usuarioCriador?: any; usuarioConcluidor?: any }) => (
      <Card key={task.id} style={styles.itemCard}>
        <Card.Title
          title={task.descricao}
          titleStyle={styles.cardTitle}
          left={(props) => (
            <Avatar.Icon
              {...props}
              icon={
                task.status === "CONCLUIDA" ? "check-circle" : "circle-outline"
              }
              style={[
                styles.cardAvatar,
                {
                  backgroundColor:
                    task.status === "CONCLUIDA"
                      ? colors.primary
                      : colors.secondary,
                },
              ]}
            />
          )}
          right={(props) => (
            <View style={styles.cardRightContent}>
              <Text
                {...props}
                style={{ color: colors.secondary, marginRight: 8 }}
              >
                {task.pontos} pts
              </Text>
              {task.status === "PENDENTE" &&
                (task.resgatada ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Button
                    mode="contained"
                    onPress={() => rescueTask(task.id)}
                    style={styles.rescueButton}
                    compact
                  >
                    Resgatar
                  </Button>
                ))}
              {task.status === "CONCLUIDA" && (
                <Badge style={{ backgroundColor: colors.primary }}>
                  Concluída
                </Badge>
              )}
            </View>
          )}
        />
        <Card.Content>
          <Text style={{ color: "#888", fontSize: 13 }}>
            Criada por:{" "}
            {task.usuarioCriador?.name ||
              task.usuarioCriador?.nome ||
              "Desconhecido"}
          </Text>
          {task.usuarioConcluidor && (
            <Text style={{ color: "#888", fontSize: 13 }}>
              Concluída por:{" "}
              {task.usuarioConcluidor?.name ||
                task.usuarioConcluidor?.nome ||
                "Desconhecido"}
            </Text>
          )}
        </Card.Content>
      </Card>
    ),
    [colors.primary, colors.secondary, rescueTask]
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefreshTasks}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {loadingTasks ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : errorTasks ? (
          <View style={styles.errorContainer}>
            <Text style={{ color: colors.error }}>{errorTasks}</Text>
            <Button mode="contained" onPress={loadTasks}>
              Tentar Novamente
            </Button>
          </View>
        ) : tasks.length > 0 ? (
          <View style={styles.itemList}>{tasks.map(renderTaskCard)}</View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text variant="bodyLarge" style={{ textAlign: "center" }}>
              Nenhuma tarefa criada ainda.
            </Text>
          </View>
        )}
      </ScrollView>
      {navigation.isFocused() && (
        <View style={[styles.fabContainer, { bottom: insets.bottom + 16 }]}>
          <IconButton
            icon="plus"
            size={30}
            style={[styles.fab, { backgroundColor: colors.primary }]} // Garante a cor de fundo
            iconColor="white"
            onPress={() =>
              navigation.navigate("CreateTask", {
                challengeName: challenge.nome,
                challengeId: challenge.id,
              })
            }
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
  },
  itemList: {
    gap: 12,
    paddingHorizontal: 16,
  },
  itemCard: {
    marginBottom: 12,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 2,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 12,
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  cardTitle: {
    fontWeight: "bold",
  },
  cardAvatar: {
    marginRight: 16,
  },
  cardRightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  rescueButton: {
    marginLeft: 8,
  },
  fabContainer: {
    position: "absolute",
    right: 16,
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
  },
  fab: {
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    backgroundColor: "#6200ee", // Cor primária padrão, pode ser sobreescrita
  },
});

export default TaskList;
