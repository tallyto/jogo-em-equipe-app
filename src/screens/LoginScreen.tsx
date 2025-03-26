import React, { useState, useContext } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({ navigation }: any) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://10.0.2.2:3002/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        await login(data.accessToken);
      } else {
        Alert.alert('Login falhou!', 'Credenciais inválidas');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro na comunicação com o servidor!');
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Login</Text>
      <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
      <TextInput label="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>
      <Text onPress={() => navigation.navigate('SignUp')} style={styles.signup}>
        Don't have an account? Sign up
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
  signup: {
    marginTop: 12,
    textAlign: 'center',
    color: '#6200ea',
  },
});

export default LoginScreen;
