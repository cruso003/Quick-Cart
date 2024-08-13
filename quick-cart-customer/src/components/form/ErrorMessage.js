import React from 'react';
import { StyleSheet, Text } from 'react-native';
import colors from '../../../theme/colors';

function ErrorMessage({ error, touch }) {
  if (!touch || !error) return null;

  return (
    <Text testID="error-message" style={styles.error}>{error}</Text>
  );
}

const styles = StyleSheet.create({
  error: {
    color: colors.error,
  }
});

export default ErrorMessage;
