import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';

interface CreateTaskScreenProps {
  route: any;
  navigation: any;
}

const CreateTaskScreen: React.FC<CreateTaskScreenProps> = ({ route, navigation }) => {
  const { challengeId } = route.params;
  const [taskName, setTaskName] = useState('');
  const [taskPoints, setTaskPoints] = useState<string>(''); // Estado para os pontos

  const handleCreateTask = async () => {
    const token = await SecureStore.getItemAsync('userToken');
    if (!token) {
      Alert.alert('Não autenticado');
      return;
    }

    if (!taskName.trim() || !taskPoints.trim()) {
      Alert.alert('Preencha o nome e os pontos da tarefa.');
      return;
    }

    const points = parseInt(taskPoints, 10);
    if (isNaN(points) || points <= 0) {
      Alert.alert('Os pontos da tarefa devem ser um número maior que zero.');
      return;
    }

    try {
      const response = await fetch(`http://10.0.2.2:3002/api/desafios/${challengeId}/tarefas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ descricao: taskName, pontos: points }), // Inclui a descrição e os pontos
      });

      if (response.ok) {
        Alert.alert('Tarefa criada!');
        navigation.goBack(); // Ou navegue para outra tela
      } else {
        const errorData = await response.json();
        Alert.alert('Erro ao criar tarefa', errorData?.message || 'Verifique os dados e tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      Alert.alert('Erro de conexão');
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">Criar Tarefa para o Desafio {challengeId}</Text>
      <TextInput
        label="Nome da Tarefa"
        value={taskName}
        onChangeText={setTaskName}
        style={styles.input}
      />
      <TextInput
        label="Pontos da Tarefa"
        value={taskPoints}
        onChangeText={setTaskPoints}
        style={styles.input}
        keyboardType="number-pad" // Sugere teclado numérico
      />
      <Button mode="contained" onPress={handleCreateTask} style={styles.button}>
        Criar Tarefa
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
});

export default CreateTaskScreen;