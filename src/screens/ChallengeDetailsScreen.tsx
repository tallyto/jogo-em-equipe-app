import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Surface, Text, useTheme } from "react-native-paper";
import { useSnackbar } from "../context/SnackbarContext";
import { getUserPoints } from '../services/desafioService';
import ParticipantsTab from "./ParticipantsTab";
import RewardList from "./RewardList";
import TaskList from "./TaskList";

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

  const fetchUserPoints = useCallback(async () => {
    if (challenge?.id) {
      try {
        const response = await getUserPoints(challenge.id);
        if (response.ok) {
          const data = await response.json();
          setUserPoints(data);
        } else {
          throw new Error('Erro ao carregar pontos do usuário');
        }
      } catch (error) {
        console.error('Erro ao buscar pontos do usuário:', error);
        showSnackbar('Erro ao carregar seus pontos.', 'error');
        setUserPoints(null);
      }
    }
  }, [challenge?.id, showSnackbar]);

  useEffect(() => {
    fetchUserPoints();
  }, [fetchUserPoints]);

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
            {userPoints === null && (
              <Text variant="bodyMedium" style={{ color: colors.secondary }}>
                Carregando seus pontos...
              </Text>
            )}
            {userPoints !== null && (
              <Text variant="bodyMedium" style={{ color: colors.primary }}>
                Seus pontos: {userPoints}
              </Text>
            )}
            {userPoints === null && (
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
              onRewardRescued={onRewardRescued}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Participantes">
          {() => <ParticipantsTab challengeId={challenge.id} />}
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