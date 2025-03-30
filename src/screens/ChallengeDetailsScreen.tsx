import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Surface, Text, useTheme } from "react-native-paper";
import { useSnackbar } from "../context/SnackbarContext";
import TaskList from "./TaskList"; // Ajuste o caminho conforme necessário
import RewardList from "./RewardList"; // Ajuste o caminho conforme necessário

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

  const handleLoadData = useCallback(() => {
    // Se precisarmos recarregar dados na tela de detalhes (além das abas),
    // a lógica ficaria aqui. Por enquanto, as abas carregam seus próprios dados.
  }, []);

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
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Recompensas">
          {() => (
            <RewardList
              challenge={challenge}
              showSnackbar={showSnackbar}
              loadData={handleLoadData} // Passamos a função (vazia por enquanto)
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