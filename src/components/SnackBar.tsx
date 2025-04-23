import React from "react";
import { Snackbar } from "react-native-paper";
import { useTheme } from "react-native-paper";
import { useSnackbar } from "../context/SnackbarContext";

const GlobalSnackbar = () => {
  const { snackbarVisible, snackbarMessage, snackbarType, hideSnackbar } = useSnackbar();
  const { colors } = useTheme();

  return (
    <Snackbar
      visible={snackbarVisible}
      onDismiss={hideSnackbar}
      duration={3000}
      style={{
        backgroundColor: snackbarType === "success" ? colors.primary : colors.error,
      }}
      action={{
        label: "OK",
        onPress: hideSnackbar,
      }}
    >
      {snackbarMessage}
    </Snackbar>
  );
};

export default GlobalSnackbar;