// src/App.tsx
import "react-native-gesture-handler";
import React from "react";
import { PaperProvider } from "react-native-paper";
import AppNavigator from "./src/navigation/AppNavigator";
import { SnackbarProvider } from "./src/context/SnackbarContext"; // Importe seu Provider
import GlobalSnackbar from "./src/components/SnackBar";

export default function App() {
  return (
    <PaperProvider>
      <SnackbarProvider>
        <AppNavigator />
        <GlobalSnackbar /> 
      </SnackbarProvider>
    </PaperProvider>
  );
}