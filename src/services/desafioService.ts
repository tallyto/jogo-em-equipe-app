import * as SecureStore from 'expo-secure-store';
import { fetchWithTimeout, getApiBaseUrl } from './api';

// Função utilitária para obter token e lançar erro se não autenticado
async function getAuthToken() {
  const token = await SecureStore.getItemAsync('userToken');
  if (!token) throw new Error('Usuário não autenticado');
  return token;
}

// Função utilitária para headers
async function authHeaders(extraHeaders: Record<string, string> = {}) {
  const token = await getAuthToken();
  return {
    Authorization: `Bearer ${token}`,
    ...extraHeaders,
  };
}

export const getActiveChallenges = async () => {
  const apiBaseUrl = getApiBaseUrl();
  return fetchWithTimeout(`${apiBaseUrl}/api/desafios`, {
    headers: await authHeaders(),
  }, 3000);
};

export const createChallenge = async (nome: string, descricao: string) => {
  const apiBaseUrl = getApiBaseUrl();
  return fetchWithTimeout(`${apiBaseUrl}/api/desafios`, {
    method: 'POST',
    headers: await authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ nome, descricao }),
  }, 3000);
};

export const getUserPoints = async (challengeId: string) => {
  const apiBaseUrl = getApiBaseUrl();
  return fetchWithTimeout(`${apiBaseUrl}/api/pontos-usuario/${challengeId}`, {
    headers: await authHeaders(),
  }, 3000);
};

export const getTasks = async (challengeId: string) => {
  const apiBaseUrl = getApiBaseUrl();
  return fetchWithTimeout(`${apiBaseUrl}/api/desafios/${challengeId}/tarefas`, {
    headers: await authHeaders(),
  }, 3000);
};

export const concludeTask = async (taskId: string) => {
  const apiBaseUrl = getApiBaseUrl();
  return fetchWithTimeout(`${apiBaseUrl}/api/tarefas/${taskId}/concluir`, {
    method: 'PUT',
    headers: await authHeaders(),
  }, 3000);
};

export const createTask = async (challengeId: string, descricao: string, pontos: number) => {
  const apiBaseUrl = getApiBaseUrl();
  return fetchWithTimeout(`${apiBaseUrl}/api/desafios/${challengeId}/tarefas`, {
    method: 'POST',
    headers: await authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ descricao, pontos }),
  }, 3000);
};

export const getRewards = async (challengeId: string) => {
  const apiBaseUrl = getApiBaseUrl();
  return fetchWithTimeout(`${apiBaseUrl}/api/recompensas/${challengeId}`, {
    headers: await authHeaders(),
  }, 3000);
};

export const rescueReward = async (rewardId: string) => {
  const token = await SecureStore.getItemAsync('userToken');
  if (!token) {
    throw new Error('Usuário não autenticado');
  }
  const apiBaseUrl = getApiBaseUrl();
  return fetchWithTimeout(`${apiBaseUrl}/api/recompensas/${rewardId}/resgatar`, {
    method: 'PUT',
    headers: await authHeaders(),
  }, 3000);
};

export const createReward = async (nome: string, custoPontos: number, desafioId: string) => {
  const apiBaseUrl = getApiBaseUrl();
  return fetchWithTimeout(`${apiBaseUrl}/api/recompensas`, {
    method: 'POST',
    headers: await authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ nome, custoPontos, desafioId }),
  }, 3000);
};

export const getParticipants = async (challengeId: string) => {
  const apiBaseUrl = getApiBaseUrl();
  return fetchWithTimeout(`${apiBaseUrl}/api/desafios/${challengeId}/participantes`, {
    headers: await authHeaders(),
  }, 3000);
};

export const addParticipant = async (challengeId: string, email: string) => {
  const apiBaseUrl = getApiBaseUrl();
  return fetchWithTimeout(`${apiBaseUrl}/api/desafios/${challengeId}/participante`, {
    method: 'POST',
    headers: await authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ email }),
  }, 3000);
};
