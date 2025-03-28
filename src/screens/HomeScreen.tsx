import React, { useContext, useState, useCallback } from 'react';
import { StyleSheet, View, RefreshControl, ScrollView } from 'react-native';
import { Button, Text, useTheme, Card, Surface, Avatar, Badge } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';

interface HomeScreenProps {
  navigation: any;
}

interface Challenge {
  id: string;
  nome: string;
  descricao?: string;
  pontos?: number;
  status?: 'active' | 'completed' | 'pending';
  deadline?: string;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { logout, userName } = useContext(AuthContext);
  const { colors } = useTheme();
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [errorChallenges, setErrorChallenges] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadActiveChallenges = async () => {
    setLoadingChallenges(true);
    setErrorChallenges(null);

    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) {
        throw new Error('Usuário não autenticado');
      }

      const response = await fetch('http://10.0.2.2:3002/api/desafios', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || 'Erro ao carregar desafios ativos');
      }

      const data = await response.json();
      setActiveChallenges(data);
    } catch (error: any) {
      console.error('Erro ao carregar desafios ativos:', error);
      setErrorChallenges(error.message || 'Erro de conexão ao carregar desafios ativos');
    } finally {
      setLoadingChallenges(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadActiveChallenges();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadActiveChallenges();
    setRefreshing(false);
  }, []);

  const renderChallengeCard = (challenge: Challenge) => (
    <Card
      key={challenge.id}
      style={styles.challengeCard}
      onPress={() => navigation.navigate('ChallengeDetails', { challenge })}
    >
      <Card.Title
        title={challenge.nome}
        subtitle={challenge.descricao}
        left={(props) => (
          <Avatar.Icon
            {...props}
            icon="trophy"
            style={{ 
              backgroundColor: 
                challenge.status === 'completed' ? colors.primary : 
                challenge.status === 'pending' ? colors.disabled : 
                colors.accent
            }}
          />
        )}
        right={(props) => (
          <View style={styles.cardRightContent}>
            <Text {...props} style={{ color: colors.secondary, marginRight: 8 }}>
              {challenge.pontos} pts
            </Text>
            {challenge.status === 'active' && (
              <Badge style={{ backgroundColor: colors.primary }}>
                Ativo
              </Badge>
            )}
          </View>
        )}
      />
      <Card.Content>
        {challenge.deadline && (
          <Text variant="bodySmall">
            Prazo: {new Date(challenge.deadline).toLocaleDateString()}
          </Text>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.outerContainer}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        <Surface style={styles.header} elevation={1}>
          <View style={styles.headerContent}>
            <Avatar.Text
              size={60}
              label={userName?.[0] ?? 'U'}
              style={{ backgroundColor: colors.primary }}
            />
            <View style={styles.headerText}>
              <Text variant="headlineSmall">
                Olá, {userName ?? 'Usuário'}!
              </Text>
              <Text variant="bodyMedium" style={{ color: colors.secondary }}>
                Bem-vindo ao Casais App
              </Text>
            </View>
          </View>
        </Surface>

        <View style={styles.dashboardSection}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Desafios Ativos
          </Text>

          {loadingChallenges ? (
            <View style={styles.loadingContainer}>
              <Text>Carregando desafios...</Text>
            </View>
          ) : errorChallenges ? (
            <View style={styles.errorContainer}>
              <Text style={{ color: colors.error }}>{errorChallenges}</Text>
              <Button mode="contained" onPress={loadActiveChallenges}>
                Tentar Novamente
              </Button>
            </View>
          ) : activeChallenges.length > 0 ? (
            <View style={styles.challengeList}>
              {activeChallenges.map(renderChallengeCard)}
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text variant="bodyLarge" style={{ textAlign: 'center' }}>
                Nenhum desafio ativo no momento.
              </Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('CreateChallenge')}
                style={styles.emptyStateButton}
              >
                Criar Primeiro Desafio
              </Button>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomButtons}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('CreateChallenge')}
          style={styles.actionButton}
          icon="plus"
        >
          Novo Desafio
        </Button>
        <Button
          mode="outlined"
          onPress={logout}
          style={styles.logoutButton}
          icon="logout"
        >
          Sair
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 70,
  },
  header: {
    padding: 16,
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerText: {
    flexDirection: 'column',
  },
  dashboardSection: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  challengeList: {
    gap: 12,
  },
  challengeCard: {
    marginBottom: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 16,
  },
  emptyStateButton: {
    width: '70%',
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  logoutButton: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  cardRightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default HomeScreen;