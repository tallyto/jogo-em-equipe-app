import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Alert } from 'react-native';
import { Text, List, ActivityIndicator, useTheme } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';

interface TaskListScreenProps {
  route: any;
  navigation: any;
}

interface Task {
  id: string;
  descricao: string;
  pontos: number;
  status: string;
  // Outras propriedades da sua tarefa
}

const TaskListScreen: React.FC<TaskListScreenProps> = ({ route, navigation }) => {
  const { challengeId } = route.params;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    const token = await SecureStore.getItemAsync('userToken');
    if (!token) {
      Alert.alert('Não autenticado');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://10.0.2.2:3002/api/desafios/${challengeId}/tarefas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        const errorData = await response.json();
        setError(errorData?.message || 'Erro ao carregar tarefas.');
      }
    } catch (err: any) {
      console.error('Erro ao carregar tarefas:', err);
      setError('Erro de conexão ao carregar tarefas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [challengeId]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'concluida':
        return 'check-circle';
      case 'pendente':
        return 'clock-outline';
      case 'em_progresso':
        return 'loading';
      default:
        return 'help-circle-outline';
    }
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <View style={styles.listItem}>
      <List.Item
        title={item.descricao}
        description={`Pontos: ${item.pontos}`}
        left={(props) => <List.Icon {...props} icon={getStatusIcon(item.status)} color={colors.primary} />}
        right={(props) => <Text style={{ alignSelf: 'center', color: getStatusColor(item.status) }}>{item.status.replace(/_/g, ' ')}</Text>}
      />
    </View>
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'concluida':
        return 'green';
      case 'pendente':
        return 'orange';
      case 'em_progresso':
        return colors.primary;
      default:
        return 'gray';
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando tarefas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Erro ao carregar as tarefas:</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>
        Tarefas do Desafio {challengeId}
      </Text>
      {tasks.length > 0 ? (
        <FlatList
          data={tasks}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.centered}>
          <Text style={styles.emptyListText}>Nenhuma tarefa criada ainda.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f6f8', // Cor de fundo leve
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  listItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#555',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    marginVertical: 5,
  },
  emptyListText: {
    fontSize: 16,
    color: '#777',
  },
});

export default TaskListScreen;