import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, RefreshControl } from "react-native";
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

interface ChallengeDetailsScreenProps {
  route: any;
  navigation: any;
}

interface Task {
  id: string;
  descricao: string;
  pontos: number;
  status: string;
}

interface Reward {
  id: string;
  nome: string;
  custoPontos: number;
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
        fetch(`http://10.0.2.2:3002/api/desafios/${challenge.id}/tarefas`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://10.0.2.2:3002/api/recompensas/${challenge.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const tasksData = await tasksResponse.json();
      const rewardsData = await rewardsResponse.json();

      if (tasksResponse.ok) {
        setTasks(tasksData);
      } else {
        setErrorTasks(tasksData?.message || "Erro ao carregar tarefas.");
      }

      if (rewardsResponse.ok) {
        setRewards(rewardsData);
      } else {
        setErrorRewards(rewardsData?.message || "Erro ao carregar recompensas.");
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

  const renderTaskCard = (task: Task) => (
    <Card
      key={task.id}
      style={styles.itemCard}
      onPress={() => {/* Optional: Navigate to task details */}}
    >
      <Card.Title
        title={task.descricao}
        left={(props) => (
          <Avatar.Icon
            {...props}
            icon={task.status === "CONCLUIDA" ? "check-circle" : "circle-outline"}
            style={{ 
              backgroundColor: 
                task.status === "CONCLUIDA" ? colors.primary : colors.disabled 
            }}
          />
        )}
        right={(props) => (
          <View style={styles.cardRightContent}>
            <Text {...props} style={{ color: colors.secondary, marginRight: 8 }}>
              {task.pontos} pts
            </Text>
            {task.status === "PENDENTE" && (
              <Badge style={{ backgroundColor: colors.accent }}>
                Pendente
              </Badge>
            )}
          </View>
        )}
      />
    </Card>
  );

  const renderRewardCard = (reward: Reward) => (
    <Card
      key={reward.id}
      style={styles.itemCard}
      onPress={() => {/* Optional: Navigate to reward details */}}
    >
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
          <Text {...props} style={{ color: colors.secondary }}>
            {reward.custoPontos} pts
          </Text>
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
                  challenge.status === 'completed' ? colors.primary : 
                  challenge.status === 'pending' ? colors.disabled : 
                  colors.accent
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
              <Text variant="bodyLarge" style={{ textAlign: 'center' }}>
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
              <Text variant="bodyLarge" style={{ textAlign: 'center' }}>
                Nenhuma recompensa criada ainda.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomButtons}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('CreateTask', {
            challengeName: challenge.nome,
            challengeId: challenge.id,
          })}
          style={styles.actionButton}
          icon="plus"
        >
          Nova Tarefa
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('CreateReward', {
            challengeName: challenge.nome,
            challengeId: challenge.id,
          })}
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
    flexDirection: 'row',
    alignItems: 'center',
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  cardRightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ChallengeDetailsScreen;