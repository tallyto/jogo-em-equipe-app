import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Surface, Text, useTheme } from "react-native-paper";
import { useSnackbar } from "../context/SnackbarContext";
import TaskList from "./TaskList";
import RewardList from "./RewardList";
import useFetchData from "../hooks/useFetchData"; // Certifique-se que o caminho está correto

interface ChallengeDetailsScreenProps {
  route: any;
  navigation: any;
}

const Tab = createMaterialTopTabNavigator();

const ChallengeDetailsScreen: React.FC<ChallengeDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const { challenge } = route.params;
  const { colors } = useTheme();
  const { showSnackbar } = useSnackbar();
  const [userPoints, setUserPoints] = useState<number | null>(null);
  const API_BASE_URL = 'http://10.0.2.2:3002'; // Substitua pelo seu IP e porta

  const {
    data: fetchedPoints,
    loading: loadingPoints,
    error: errorPoints,
    fetchData: fetchUserPointsData,
  } = useFetchData<number>();

  const fetchUserPoints = useCallback(async () => {
    if (challenge?.id) {
      fetchUserPointsData(`${API_BASE_URL}/api/pontos-usuario/${challenge.id}`);
    }
  }, [challenge?.id, fetchUserPointsData, API_BASE_URL]);

  useEffect(() => {
    fetchUserPoints();
  }, [fetchUserPoints]);

  useEffect(() => {
    if (fetchedPoints !== undefined) {
      setUserPoints(fetchedPoints);
    } else if (errorPoints) {
      console.error('Erro ao buscar pontos do usuário:', errorPoints);
      showSnackbar('Erro ao carregar seus pontos.', 'error');
      setUserPoints(null);
    }
  }, [fetchedPoints, errorPoints, showSnackbar]);

  const onRewardRescued = useCallback(() => {
    fetchUserPoints();
  }, [fetchUserPoints]);


  if (!challenge) {
    return (
      <View style={styles.errorContainer}>
        <Text style={{ color: colors.error }}>Desafio não encontrado!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
            {loadingPoints && (
              <Text variant="bodyMedium" style={{ color: colors.secondary }}>
                Carregando seus pontos...
              </Text>
            )}
            {!loadingPoints && userPoints !== null && (
              <Text variant="bodyMedium" style={{ color: colors.primary }}>
                Seus pontos: {userPoints}
              </Text>
            )}
            {!loadingPoints && userPoints === null && errorPoints && (
              <Text variant="bodyMedium" style={{ color: colors.error }}>
                Erro ao carregar pontos.
              </Text>
            )}
          </View>
        </View>
      </Surface>

      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.secondary,
          tabBarIndicatorStyle: { backgroundColor: colors.primary },
        }}
      >
        <Tab.Screen name="Tarefas">
          {() => (
            <TaskList
              challenge={challenge}
              showSnackbar={showSnackbar}
              onRewardRescued={onRewardRescued} 
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Recompensas">
          {() => (
            <RewardList
              challenge={challenge}
              showSnackbar={showSnackbar}
              onRewardRescued={onRewardRescued} // Passamos a função (vazia por enquanto)
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    marginBottom: 0,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});

export default ChallengeDetailsScreen;