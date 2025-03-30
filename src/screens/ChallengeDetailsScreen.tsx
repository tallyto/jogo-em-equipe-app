import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import {
  Text,
  Button,
  useTheme,
  Card,
  Surface,
  Avatar,
  Badge,
  ActivityIndicator,
} from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import axios from 'axios';

interface ChallengeDetailsScreenProps {
  route: any;
  navigation: any;
}

interface Task {
  id: string;
  descricao: string;
  pontos: number;
  status: string;
  resgatada: boolean;
}

interface Reward {
  id: string;
  nome: string;
  custoPontos: number;
  resgatada: boolean;
}

const ChallengeDetailsScreen: React.FC<ChallengeDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const { challenge } = route.params;
  const { colors } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingRewards, setLoadingRewards] = useState(true);
  const [errorTasks, setErrorTasks] = useState<string | null>(null);
  const [errorRewards, setErrorRewards] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);


  const loadData = async () => {
    setLoadingTasks(true);
    setLoadingRewards(true);
    setErrorTasks(null);
    setErrorRewards(null);

    const token = await SecureStore.getItemAsync("userToken");
    if (!token) {
      setErrorTasks("Usuário não autenticado.");
      setErrorRewards("Usuário não autenticado.");
      setLoadingTasks(false);
      setLoadingRewards(false);
      return;
    }

    try {
      const [tasksResponse, rewardsResponse] = await Promise.all([
        axios.get(`http://10.0.2.2:3002/api/desafios/${challenge.id}/tarefas`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://10.0.2.2:3002/api/recompensas/${challenge.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (tasksResponse.status === 200) {
        setTasks(tasksResponse.data);
      } else {
        setErrorTasks(tasksResponse.data?.message || "Erro ao carregar tarefas.");
      }

      if (rewardsResponse.status === 200) {
        setRewards(rewardsResponse.data);
      } else {
        setErrorRewards(rewardsResponse.data?.message || "Erro ao carregar recompensas.");
      }
    } catch (error: any) {
      console.error("Erro ao carregar dados:", error);
      setErrorTasks("Erro de conexão ao carregar tarefas.");
      setErrorRewards("Erro de conexão ao carregar recompensas.");
    } finally {
      setLoadingTasks(false);
      setLoadingRewards(false);
    }
  };

  useEffect(() => {
    if (challenge?.id) {
      loadData();
    }
  }, [challenge?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const rescueTask = async (taskId: string) => {
    const token = await SecureStore.getItemAsync("userToken");
    if (!token) {
      console.error("Usuário não autenticado.");
      return;
    }

    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, resgatada: true } : task
      )
    );

    try {
      const response = await axios.put(
        `http://10.0.2.2:3002/api/tarefas/${taskId}/concluir`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? { ...task, status: "CONCLUIDA", resgatada: false } : task
          )
        );
        // Opcional: Recarregar os dados do usuário para atualizar os pontos
      } else {
        console.error("Erro ao resgatar tarefa:", response.data?.message || "Erro desconhecido");
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? { ...task, resgatada: false } : task
          )
        );
        Alert.alert("Erro", response.data?.message || "Erro ao resgatar tarefa.");
      }
    } catch (error: any) {
      console.error("Erro ao conectar para resgatar tarefa:", error);
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, resgatada: false } : task
        )
      );
      Alert.alert("Erro de Conexão", "Não foi possível resgatar a tarefa.");
    }
  };

  const rescueReward = async (rewardId: string) => {
    const token = await SecureStore.getItemAsync("userToken");
    if (!token) {
      console.error("Usuário não autenticado.");
      return;
    }

    setRewards(prevRewards =>
      prevRewards.map(reward =>
        reward.id === rewardId ? { ...reward, resgatada: true } : reward
      )
    );

    try {
      const response = await axios.put(
        `http://10.0.2.2:3002/api/recompensas/${rewardId}/resgatar`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setRewards(prevRewards =>
          prevRewards.map(reward =>
            reward.id === rewardId ? { ...reward, resgatada: true } : reward
          )
        );
        Alert.alert("Sucesso", "Recompensa resgatada com sucesso!");
        loadData(); // Recarrega para atualizar a lista
      } else if (response.status === 400) {
        Alert.alert("Erro", response.data?.message || "Não foi possível resgatar a recompensa.");
        setRewards(prevRewards =>
          prevRewards.map(reward =>
            reward.id === rewardId ? { ...reward, resgatada: false } : reward
          )
        );
      } else {
        console.error("Erro ao resgatar recompensa:", response.data?.message || "Erro desconhecido");
        Alert.alert("Erro", "Erro ao resgatar recompensa.");
        setRewards(prevRewards =>
          prevRewards.map(reward =>
            reward.id === rewardId ? { ...reward, resgatada: false } : reward
          )
        );
      }
    } catch (error: any) {
      console.error("Erro ao conectar para resgatar recompensa:", error);
      Alert.alert("Erro de Conexão", "Não foi possível resgatar a recompensa.");
      setRewards(prevRewards =>
        prevRewards.map(reward =>
          reward.id === rewardId ? { ...reward, resgatada: false } : reward
        )
      );
    }
  };

  const renderTaskCard = (task: Task) => (
    <Card key={task.id} style={styles.itemCard}>
      <Card.Title
        title={task.descricao}
        left={(props) => (
          <Avatar.Icon
            {...props}
            icon={task.status === "CONCLUIDA" ? "check-circle" : "circle-outline"}
            style={{
              backgroundColor:
                task.status === "CONCLUIDA" ? colors.primary : colors.secondary,
            }}
          />
        )}
        right={(props) => (
          <View style={styles.cardRightContent}>
            <Text {...props} style={{ color: colors.secondary, marginRight: 4 }}>
              {task.pontos} pts
            </Text>
            {task.status === "PENDENTE" && (
              task.resgatada ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Button
                  mode="contained"
                  onPress={() => rescueTask(task.id)}
                  style={styles.rescueButton}
                >
                  Resgatar
                </Button>
              )
            )}
            {task.status === "CONCLUIDA" && (
              <Badge style={{ backgroundColor: colors.primary }}>
                Concluída
              </Badge>
            )}
          </View>
        )}
      />
    </Card>
  );

  const renderRewardCard = (reward: Reward) => (
    <Card key={reward.id} style={styles.itemCard}>
      <Card.Title
        title={reward.nome}
        left={(props) => (
          <Avatar.Icon
            {...props}
            icon="gift"
            style={{ backgroundColor: colors.primary }}
          />
        )}
        right={(props) => (
          <View style={styles.cardRightContent}>
            <Text {...props} style={{ color: colors.secondary }}>
              {reward.custoPontos} pts
            </Text>
            {reward.resgatada ? (
              <Badge style={{ backgroundColor: colors.primary }}>
                Resgatada
              </Badge>
            ) : (
              <Button
                mode="contained"
                onPress={() => rescueReward(reward.id)}
                style={styles.rescueButton}
                loading={reward.resgatada}
                disabled={reward.resgatada}
              >
                Resgatar
              </Button>
            )}
          </View>
        )}
      />
    </Card>
  );

  if (!challenge) {
    return (
      <View style={styles.errorContainer}>
        <Text style={{ color: colors.error }}>Desafio não encontrado!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ backgroundColor: colors.background }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        <Surface style={styles.header} elevation={1}>
          <View style={styles.headerContent}>
            <Avatar.Icon
              size={60}
              icon="trophy"
              style={{
                backgroundColor:
                  challenge.status === "completed"
                    ? colors.primary
                    : challenge.status === "pending"
                    ? colors.secondary
                    : colors.primary,
              }}
            />
            <View>
              <Text variant="headlineSmall">{challenge.nome}</Text>
              <Text variant="bodyMedium" style={{ color: colors.secondary }}>
                {challenge.descricao}
              </Text>
            </View>
          </View>
        </Surface>

        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Tarefas
          </Text>

          {loadingTasks ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : errorTasks ? (
            <View style={styles.errorContainer}>
              <Text style={{ color: colors.error }}>{errorTasks}</Text>
              <Button mode="contained" onPress={loadData}>
                Tentar Novamente
              </Button>
            </View>
          ) : tasks.length > 0 ? (
            <View style={styles.itemList}>
              {tasks.map(renderTaskCard)}
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text variant="bodyLarge" style={{ textAlign: "center" }}>
                Nenhuma tarefa criada ainda.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Recompensas
          </Text>

          {loadingRewards ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : errorRewards ? (
            <View style={styles.errorContainer}>
              <Text style={{ color: colors.error }}>{errorRewards}</Text>
              <Button mode="contained" onPress={loadData}>
                Tentar Novamente
              </Button>
            </View>
          ) : rewards.length > 0 ? (
            <View style={styles.itemList}>
              {rewards.map(renderRewardCard)}
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text variant="bodyLarge" style={{ textAlign: "center" }}>
                Nenhuma recompensa criada ainda.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomButtons}>
        <Button
          mode="contained"
          onPress={() =>
            navigation.navigate("CreateTask", {
              challengeName: challenge.nome,
              challengeId: challenge.id,
            })
          }
          style={styles.actionButton}
          icon="plus"
        >
          Nova Tarefa
        </Button>
        <Button
          mode="contained"
          onPress={() =>
            navigation.navigate("CreateReward", {
              challengeName: challenge.nome,
              challengeId: challenge.id,
            })
          }
          style={styles.actionButton}
          icon="gift"
        >
          Nova Recompensa
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 70,
  },
  header: {
    padding: 16,
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  itemList: {
    gap: 12,
  },
  itemCard: {
    marginBottom: 12,
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
  bottomButtons: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  cardRightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  rescueButton: {
    marginHorizontal: 4,
    backgroundColor: '#6200ee', // Use a cor primária do seu tema
  },
});

export default ChallengeDetailsScreen;