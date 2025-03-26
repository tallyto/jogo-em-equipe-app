// src/screens/TasksScreen.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button } from 'react-native-paper';

const TasksScreen = () => {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Tarefas</Text>
      {/* Aqui você pode mapear as tarefas vindas da API ou banco de dados */}
      <Button mode="contained" onPress={() => alert('Tarefa concluída')}>
        Marcar tarefa como concluída
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default TasksScreen;
