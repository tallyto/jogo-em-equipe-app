import { useCallback, useState } from "react";
import * as SecureStore from "expo-secure-store";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetchData<T = any>() {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchData = useCallback(
    async (url: string, method: string = "GET", body: any = null) => {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      const token = await SecureStore.getItemAsync("userToken");

      if (!token) {
        setState((prevState) => ({
          ...prevState,
          loading: false,
          error: "Usuário não autenticado.",
        }));
        return null;
      }

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const config: RequestInit = {
        method,
        headers,
      };
      if (body) {
        config.body = JSON.stringify(body);
      }

      try {
        const response = await fetch(url, config);

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage =
            errorData?.message || `Erro na requisição: ${response.status}`;
          setState((prevState) => ({ ...prevState, loading: false, error: errorMessage }));
          return null;
        }

        const json = await response.json();
        setState({ data: json as T, loading: false, error: null });
        return json;
      } catch (error: any) {
        setState((prevState) => ({
          ...prevState,
          loading: false,
          error: error.message || "Erro inesperado.",
        }));
        return null;
      }
    },
    []
  );

  return { ...state, fetchData };
}

export default useFetchData;