import React from "react";
import { View, Text, StyleSheet } from "react-native";
import SubmitButton from "./button/SubmitButton";


function ErrorView({ message, onRetry }) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorMessage}>{message}</Text>
      <SubmitButton title="Retry" onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 90,
  },
  errorMessage: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});

export default ErrorView;