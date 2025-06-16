import { Platform } from 'react-native';

const localIp = '192.168.18.68'; // Altere para o IP do seu computador
const localPort = '3002';
const localUrl = `http://${localIp}:${localPort}`;
const emulatorUrl = 'http://10.0.2.2:3002';

export const getApiBaseUrl = () => {
  if (Platform.OS === 'android') {
    // No Android físico, use o IP local; no emulador, use 10.0.2.2
    // Heurística: se for device físico, normalmente o IP local funciona
    // Se quiser forçar, troque para localUrl
    return localUrl;
  }
  return emulatorUrl;
};

export const fetchWithTimeout = async (
  resource: string,
  options: RequestInit = {},
  timeout = 3000
) => {
  return Promise.race([
    fetch(resource, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error('Tempo de requisição excedido (timeout).')), timeout)
    ),
  ]);
};
