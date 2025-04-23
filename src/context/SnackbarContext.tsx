import React, { createContext, useState, useContext, ReactNode } from "react";

type SnackbarType = "success" | "error" | "info" | "warning";

interface SnackbarContextProps {
  snackbarVisible: boolean;
  snackbarMessage: string;
  snackbarType: SnackbarType;
  showSnackbar: (message: string, type?: SnackbarType) => void;
  hideSnackbar: () => void;
}

// Criando o contexto com um valor inicial tipado
const SnackbarContext = createContext<SnackbarContextProps>({
  snackbarVisible: false,
  snackbarMessage: "",
  snackbarType: "success",
  showSnackbar: () => {},
  hideSnackbar: () => {},
});

interface SnackbarProviderProps {
  children: ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarType, setSnackbarType] = useState<SnackbarType>("success");

  const showSnackbar = (message: string, type: SnackbarType = "error") => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  const hideSnackbar = () => setSnackbarVisible(false);

  return (
    <SnackbarContext.Provider
      value={{
        snackbarVisible,
        snackbarMessage,
        snackbarType,
        showSnackbar,
        hideSnackbar,
      }}
    >
      {children}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = (): SnackbarContextProps => useContext(SnackbarContext);