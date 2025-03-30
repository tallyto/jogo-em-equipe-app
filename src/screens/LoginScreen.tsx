import React, { useState, useContext, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext'; // Importe o hook do contexto
import * as yup from 'yup';

// Validation schema
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('E-mail inválido')
    .required('E-mail é obrigatório'),
  password: yup
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .required('Senha é obrigatória')
});

const LoginScreen = ({ navigation }: any) => {
  const { login } = useContext(AuthContext);
  const { showSnackbar } = useSnackbar(); // Utilize o hook para acessar showSnackbar
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = useCallback(async () => {
    try {
      await loginSchema.validate({ email, password }, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err: any) {
      if (err instanceof yup.ValidationError) {
        const validationErrors: { email?: string; password?: string } = {};
        err.inner.forEach((error: any) => {
          if (error.path) {
            validationErrors[error.path as keyof typeof validationErrors] = error.message;
          }
        });
        setErrors(validationErrors);
      }
      return false;
    }
  }, [email, password]);

  const handleLogin = async () => {
    const isValid = await validateForm();

    if (!isValid) return;

    setIsLoading(true);
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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Credenciais inválidas');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro na comunicação com o servidor!';
      showSnackbar(errorMessage, 'error'); // Use o snackbar global
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.innerContainer}>
        <Text variant="headlineMedium" style={styles.title}>Login</Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          error={!!errors.email}
        />
        {errors.email && <HelperText type="error" visible={!!errors.email}>{errors.email}</HelperText>}

        <TextInput
          label="Senha"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry={!showPassword}
          error={!!errors.password}
          right={
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />
        {errors.password && <HelperText type="error" visible={!!errors.password}>{errors.password}</HelperText>}

        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Conectando...' : 'Login'}
        </Button>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPassword}>Esqueceu sua senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signup}>
            Não tem uma conta? Cadastre-se
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 15,
    padding: 5,
  },
  signup: {
    marginTop: 15,
    textAlign: 'center',
    color: '#6200ea',
  },
  forgotPassword: {
    marginTop: 10,
    textAlign: 'center',
    color: '#6200ea',
  },
});

export default LoginScreen;