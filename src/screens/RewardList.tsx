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
import { getRewards, rescueReward } from "../services/desafioService";

interface RewardListProps {
  challenge: any;
  showSnackbar: (message: string, type: "success" | "error") => void;
  onRewardRescued: () => void;
}

interface Reward {
  id: string;
  nome: string;
  custoPontos: number;
  resgatada: boolean;
}

const RewardList: React.FC<RewardListProps> = ({
  challenge,
  showSnackbar,
  onRewardRescued,
}) => {
  const { colors } = useTheme();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {
    data: fetchedRewards,
    loading: loadingRewards,
    error: errorRewards,
    fetchData,
  } = useFetchData<Reward[]>();

  const loadRewards = useCallback(async () => {
    try {
      const response = await getRewards(challenge.id);
      if (response.ok) {
        const data = await response.json();
        setRewards(data);
      } else {
        setRewards([]);
        showSnackbar("Erro ao carregar recompensas.", "error");
      }
    } catch (error) {
      setRewards([]);
      showSnackbar("Erro de conexão ao carregar recompensas.", "error");
    }
  }, [challenge?.id, showSnackbar]);

  useFocusEffect(
    useCallback(() => {
      if (challenge?.id) {
        loadRewards();
      }
      return () => {
        // Opcional: limpeza
      };
    }, [challenge?.id, loadRewards])
  );

  useEffect(() => {
    if (fetchedRewards) {
      setRewards(fetchedRewards);
    }
  }, [fetchedRewards]);

  const onRefreshRewards = useCallback(async () => {
    setRefreshing(true);
    await loadRewards();
    setRefreshing(false);
  }, [loadRewards]);

  const rescueRewardHandler = useCallback(
    async (rewardId: string) => {
      setRewards((prevRewards) =>
        prevRewards.map((reward) =>
          reward.id === rewardId ? { ...reward, resgatada: true } : reward
        )
      );
      try {
        const response = await rescueReward(rewardId);
        if (response.ok) {
          setRewards((prevRewards) =>
            prevRewards.map((reward) =>
              reward.id === rewardId ? { ...reward, resgatada: true } : reward
            )
          );
          showSnackbar("Recompensa resgatada com sucesso!", "success");
          loadRewards();
          onRewardRescued();
        } else {
          setRewards((prevRewards) =>
            prevRewards.map((reward) =>
              reward.id === rewardId ? { ...reward, resgatada: false } : reward
            )
          );
          showSnackbar("Não foi possível resgatar a recompensa.", "error");
        }
      } catch (error) {
        setRewards((prevRewards) =>
          prevRewards.map((reward) =>
            reward.id === rewardId ? { ...reward, resgatada: false } : reward
          )
        );
        showSnackbar("Erro de conexão ao resgatar recompensa.", "error");
      }
    },
    [loadRewards, onRewardRescued, showSnackbar]
  );

  const renderRewardCard = useCallback(
    (reward: Reward) => (
      <Card key={reward.id} style={styles.itemCard}>
        <Card.Title
          title={reward.nome}
          titleStyle={styles.cardTitle}
          left={(props) => (
            <Avatar.Icon
              {...props}
              icon="gift"
              style={[styles.cardAvatar, { backgroundColor: colors.primary }]}
            />
          )}
          right={(props) => (
            <View style={styles.cardRightContent}>
              <Text {...props} style={{ color: colors.secondary, marginRight: 8 }}>
                {reward.custoPontos} pts
              </Text>
              {reward.resgatada ? (
                <Badge style={{ backgroundColor: colors.primary }}>
                  Resgatada
                </Badge>
              ) : (
                <Button
                  mode="contained"
                  onPress={() => rescueRewardHandler(reward.id)}
                  style={styles.rescueButton}
                  loading={reward.resgatada}
                  disabled={reward.resgatada}
                  compact
                >
                  Resgatar
                </Button>
              )}
            </View>
          )}
        />
      </Card>
    ),
    [colors.primary, colors.secondary, rescueRewardHandler]
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefreshRewards}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {loadingRewards ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : errorRewards ? (
          <View style={styles.errorContainer}>
            <Text style={{ color: colors.error }}>{errorRewards}</Text>
            <Button mode="contained" onPress={loadRewards}>
              Tentar Novamente
            </Button>
          </View>
        ) : rewards.length > 0 ? (
          <View style={styles.itemList}>{rewards.map(renderRewardCard)}</View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text variant="bodyLarge" style={{ textAlign: "center" }}>
              Nenhuma recompensa criada ainda.
            </Text>
          </View>
        )}
      </ScrollView>
      {navigation.isFocused() && (
        <View style={[styles.fabContainer, { bottom: insets.bottom + 16 }]}>
          <IconButton
            icon="gift"
            size={30}
            style={[styles.fab, { backgroundColor: colors.primary }]} // Garante a cor de fundo
            iconColor="white"
            onPress={() =>
              navigation.navigate("CreateReward", {
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

export default RewardList;