import React from "react";
import { View, Text, StyleSheet } from "react-native";
import SubmitButton from "./button/SubmitButton";
import { Button } from "react-native-paper";


function ErrorView({ message, onRetry }) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorMessage}>{message}</Text>
      <Button title="Retry" onPress={onRetry} /><Button/>
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