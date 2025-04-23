import React, { useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TextInput, Button, Card, ActivityIndicator } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import { useSnackbar } from '../context/SnackbarContext'; // Importe o hook do contexto

interface CreateTaskScreenProps {
  route: any;
  navigation: any;
}

const CreateTaskScreen: React.FC<CreateTaskScreenProps> = ({ route, navigation }) => {
  const { challengeId, challengeName } = route.params;
  const { showSnackbar } = useSnackbar(); // Utilize o hook para acessar showSnackbar
  const [taskName, setTaskName] = useState('');
  const [taskPoints, setTaskPoints] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [taskNameError, setTaskNameError] = useState('');
  const [taskPointsError, setTaskPointsError] = useState('');

  const validateInputs = useCallback(() => {
    let isValid = true;
    if (!taskName.trim()) {
      setTaskNameError('O nome da tarefa é obrigatório.');
      isValid = false;
    } else {
      setTaskNameError('');
    }

    if (!taskPoints.trim()) {
      setTaskPointsError('Os pontos da tarefa são obrigatórios.');
      isValid = false;
    } else {
      const points = parseInt(taskPoints, 10);
      if (isNaN(points) || points <= 0) {
        setTaskPointsError('Os pontos devem ser um número maior que zero.');
        isValid = false;
      } else {
        setTaskPointsError('');
      }
    }
    return isValid;
  }, [taskName, taskPoints]);

  const handleCreateTask = useCallback(async () => {
    if (!validateInputs()) {
      return;
    }

    const token = await SecureStore.getItemAsync('userToken');
    if (!token) {
      showSnackbar('Não autenticado', 'error'); // Use o snackbar global
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://10.0.2.2:3002/api/desafios/${challengeId}/tarefas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ descricao: taskName, pontos: parseInt(taskPoints, 10) }),
      });

      if (response.ok) {
        showSnackbar('Tarefa criada com sucesso!', 'success'); // Use o snackbar global
        setTaskName('');
        setTaskPoints('');
        navigation.goBack();
      } else {
        const errorData = await response.json();
        showSnackbar('Erro ao criar tarefa: ' + (errorData?.message || 'Verifique os dados e tente novamente.'), 'error'); // Use o snackbar global
      }
    } catch (error: any) {
      console.error('Erro ao criar tarefa:', error);
      showSnackbar('Erro de conexão ao criar tarefa.', 'error'); // Use o snackbar global
    } finally {
      setLoading(false);
    }
  }, [challengeId, navigation, taskName, taskPoints, validateInputs, showSnackbar]);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>Criar Tarefa</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>Desafio: {challengeName}</Text>
          <TextInput
            label="Nome da Tarefa"
            value={taskName}
            onChangeText={setTaskName}
            style={styles.input}
            mode="outlined"
            error={!!taskNameError}
          />
          {!!taskNameError && <Text style={styles.errorText}>{taskNameError}</Text>}
          <TextInput
            label="Pontos da Tarefa"
            value={taskPoints}
            onChangeText={setTaskPoints}
            style={styles.input}
            keyboardType="number-pad"
            mode="outlined"
            error={!!taskPointsError}
          />
          {!!taskPointsError && <Text style={styles.errorText}>{taskPointsError}</Text>}
          {loading ? (
            <ActivityIndicator size="large" style={styles.loader} />
          ) : (
            <Button
              mode="contained"
              onPress={handleCreateTask}
              style={styles.button}
              disabled={loading}
            >
              Criar Tarefa
            </Button>
          )}
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  card: {
    width: '100%',
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 16,
    color: '#555',
    textAlign: 'center',
  },
  input: {
    marginBottom: 8, // Reduzi um pouco o margin para dar espaço à mensagem de erro
  },
  button: {
    marginTop: 16,
  },
  loader: {
    marginTop: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
});

export default CreateTaskScreen;