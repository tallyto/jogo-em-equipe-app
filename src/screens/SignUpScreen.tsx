// src/screens/SignUpScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';

const SignUpScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch('http://10.0.2.2:3002/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
          'Accept': 'application/json',   
        },
        body: JSON.stringify({ email, name, password }),
      });

      if (response.ok) {
        // Navega para a tela de login após registro bem-sucedido
        Alert.alert('Cadastro realizado com sucesso', 'Você pode agora fazer o login!');
        navigation.replace('Login');
      } else {
        Alert.alert('Erro no cadastro', 'Verifique seus dados e tente novamente');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro na comunicação com o servidor!');
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Cadastro</Text>
      <TextInput
        label="Nome"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        Cadastrar
      </Button>
      <Text onPress={() => navigation.navigate('Login')} style={styles.login}>
        Já tem uma conta? Faça login
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 12,
  },
  login: {
    marginTop: 12,
    textAlign: 'center',
    color: '#6200ea',
  },
});

export default SignUpScreen;
