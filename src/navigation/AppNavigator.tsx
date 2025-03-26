import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import TasksScreen from '../screens/TasksScreen';
import RewardsScreen from '../screens/RewardsScreen';
import { AuthContext, AuthProvider } from '../context/AuthContext';
import CreateChallengeScreen from '../screens/CreateChallengeScreen';
import ChallengeDetailsScreen from '../screens/ChallengeDetailsScreen';
import CreateTaskScreen from '../screens/CreateTaskScreen';
import TaskListScreen from '../screens/TaskListScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? "Home" : "Login"}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Tasks" component={TasksScreen} />
            <Stack.Screen name="Rewards" component={RewardsScreen} />
            <Stack.Screen name="CreateChallenge" component={CreateChallengeScreen} />
            <Stack.Screen name="ChallengeDetails" component={ChallengeDetailsScreen}/>

            <Stack.Screen name="CreateTask" component={CreateTaskScreen}/>
            <Stack.Screen name="TaskList" component={TaskListScreen} /> 
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
