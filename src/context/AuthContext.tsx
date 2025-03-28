import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  userName: string | null; // Novo estado para o nome do usuário
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  userName: null, // Valor inicial para userName
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null); // Estado para o nome

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = await SecureStore.getItemAsync("userToken");
      if (token) {
        setIsAuthenticated(true);
        try {
          const decodedToken: any = jwtDecode(token);
          console.log("Token decodificado:", decodedToken);
          setUserName(decodedToken.nome); // Recupera o nome do claim 'nome'
        } catch (error) {
          console.error("Erro ao decodificar o token:", error);
          setUserName(null);
        }
      } else {
        setIsAuthenticated(false);
        setUserName(null);
      }
    };

    checkAuthentication();
  }, []);

  const login = async (token: string) => {
    await SecureStore.setItemAsync("userToken", token);
    setIsAuthenticated(true);
    try {
      const decodedToken: any = jwtDecode(token);
      setUserName(decodedToken.nome); // Define o nome ao logar
    } catch (error) {
      console.error("Erro ao decodificar o token durante o login:", error);
      setUserName(null);
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("userToken");
    setIsAuthenticated(false);
    setUserName(null); // Limpa o nome ao fazer logout
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, userName }}>
      {children}
    </AuthContext.Provider>
  );
};
