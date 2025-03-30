import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState, useEffect } from "react";
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

interface RewardListProps {
  challenge: any;
  showSnackbar: (message: string, type: "success" | "error") => void;
  loadData: () => void; // Manter por enquanto, veremos se ainda é necessário
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
  loadData,
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
    fetchData(`http://10.0.2.2:3002/api/recompensas/${challenge.id}`);
  }, [challenge?.id, fetchData]);

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

  const rescueReward = useCallback(
    async (rewardId: string) => {
      setRewards((prevRewards) =>
        prevRewards.map((reward) =>
          reward.id === rewardId ? { ...reward, resgatada: true } : reward
        )
      );

      const success = await fetchData(
        `http://10.0.2.2:3002/api/recompensas/${rewardId}/resgatar`,
        "PUT"
      );

      if (success) {
        setRewards((prevRewards) =>
          prevRewards.map((reward) =>
            reward.id === rewardId ? { ...reward, resgatada: true } : reward
          )
        );
        showSnackbar("Recompensa resgatada com sucesso!", "success");
        loadRewards(); // <---- RECARREGAR A LISTA AQUI
      } else {
        showSnackbar(
          errorRewards || "Não foi possível resgatar a recompensa.",
          "error"
        );
        setRewards((prevRewards) =>
          prevRewards.map((reward) =>
            reward.id === rewardId ? { ...reward, resgatada: false } : reward
          )
        );
      }
    },
    [fetchData, showSnackbar, errorRewards, loadRewards] // Adicione loadRewards como dependência
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
                  onPress={() => rescueReward(reward.id)}
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
    [colors.primary, colors.secondary, rescueReward]
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