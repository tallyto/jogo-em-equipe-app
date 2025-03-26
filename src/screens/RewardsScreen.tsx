// src/screens/RewardsScreen.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button } from 'react-native-paper';

const RewardsScreen = () => {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Recompensas</Text>
      <Button mode="contained" onPress={() => alert('Recompensa resgatada')}>
        Resgatar Recompensa
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

export default RewardsScreen;
