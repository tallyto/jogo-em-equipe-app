import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button, Text, useTheme, List } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import * as SecureStore from 'expo-secure-store';

interface HomeScreenProps {
  navigation: any;
}

interface Challenge {
  id: string;
  nome: string;
  descricao?: string;
  // Outras propriedades do seu desafio
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { logout } = useContext(AuthContext);
  const { colors } = useTheme();
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [errorChallenges, setErrorChallenges] = useState<string | null>(null);

  const loadActiveChallenges = async () => {
    setLoadingChallenges(true);
    setErrorChallenges(null);
    const token = await SecureStore.getItemAsync('userToken');
    if (!token) {
      setErrorChallenges('Usuário não autenticado.');
      setLoadingChallenges(false);
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:3002/api/desafios', { // Seu novo endpoint
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setActiveChallenges(data);
      } else {
        const errorData = await response.json();
        setErrorChallenges(errorData?.message || 'Erro ao carregar desafios ativos.');
      }
    } catch (error: any) {
      console.error('Erro ao carregar desafios ativos:', error);
      setErrorChallenges('Erro de conexão ao carregar desafios ativos.');
    } finally {
      setLoadingChallenges(false);
    }
  };

  useEffect(() => {
    loadActiveChallenges();
  }, []);

  const renderChallengeItem = ({ item }: { item: Challenge }) => (
    <TouchableOpacity
      style={styles.challengeItem}
      onPress={() => navigation.navigate('ChallengeDetails', { challenge: item })}
    >
      <List.Item
        title={item.nome}
        description={item.descricao}
        left={(props) => <List.Icon {...props} icon="trophy" color={colors.primary} />}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="displaySmall" style={styles.title}>
          Bem-vindos ao Casais App!
        </Text>
        <Text style={styles.subtitle}>
          Seus desafios ativos estão aqui.
        </Text>
      </View>

      <View style={styles.dashboard}>
        <Text variant="titleLarge" style={styles.dashboardTitle}>
          Desafios Ativos
        </Text>
        {loadingChallenges ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : errorChallenges ? (
          <Text style={styles.errorText}>{errorChallenges}</Text>
        ) : activeChallenges.length > 0 ? (
          <FlatList
            data={activeChallenges}
            renderItem={renderChallengeItem}
            keyExtractor={(item) => item.id}
            horizontal={true} // Layout horizontal para o dashboard
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.challengeListContent}
          />
        ) : (
          <Text style={styles.emptyListText}>Nenhum desafio ativo no momento.</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('CreateChallenge')}
          style={[styles.button, { backgroundColor: colors.tertiaryContainer }]}
          labelStyle={[styles.buttonLabel, { color: colors.onTertiaryContainer }]}
        >
          Criar Desafio
        </Button>
        <Button
          mode="outlined"
          onPress={logout}
          style={styles.logoutButton}
          labelStyle={{ color: colors.error }}
          icon="logout"
        >
          Sair
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f6f8',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
  },
  dashboard: {
    width: '100%',
    marginBottom: 30,
  },
  dashboardTitle: {
    marginBottom: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  challengeListContent: {
    paddingHorizontal: 10,
  },
  challengeItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginRight: 10,
    width: 200, // Largura dos cards de desafio no dashboard
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    paddingVertical: 20,
  },
  emptyListText: {
    color: '#777',
    textAlign: 'center',
    paddingVertical: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    marginTop: 16,
    width: '90%',
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 32,
    width: '90%',
    borderRadius: 8,
    borderColor: '#e74c3c',
  },
});

export default HomeScreen;