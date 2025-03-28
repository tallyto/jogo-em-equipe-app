import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import HomeScreen from "../screens/HomeScreen";
import TasksScreen from "../screens/TasksScreen";
import { AuthContext, AuthProvider } from "../context/AuthContext";
import CreateChallengeScreen from "../screens/CreateChallengeScreen";
import CreateTaskScreen from "../screens/CreateTaskScreen";
import TaskListScreen from "../screens/TaskListScreen";
import CreateRewardScreen from "../screens/CreateRewardScreen";
import ChallengeDetailsScreen from "../screens/ChallengeDetailsScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? "Home" : "Login"}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: "Entrar" }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ title: "Cadastrar" }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: "Página Inicial" }}
            />
            <Stack.Screen
              name="Tasks"
              component={TasksScreen}
              options={{ title: "Minhas Tarefas" }}
            />
            <Stack.Screen
              name="CreateChallenge"
              component={CreateChallengeScreen}
              options={{ title: "Criar Desafio" }}
            />
            <Stack.Screen
              name="ChallengeDetails"
              component={ChallengeDetailsScreen}
              options={{ title: "Detalhes do Desafio" }}
            />
            <Stack.Screen
              name="CreateTask"
              component={CreateTaskScreen}
              options={{ title: "Criar Tarefa" }}
            />
            <Stack.Screen
              name="TaskList"
              component={TaskListScreen}
              options={{ title: "Lista de Tarefas" }}
            />
            <Stack.Screen
              name="CreateReward"
              component={CreateRewardScreen}
              options={{ title: "Criar Recompensa" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Envolve com o AuthProvider para gerenciar o estado global de autenticação
const App = () => (
  <AuthProvider>
    <AppNavigator />
  </AuthProvider>
);

export default App;
