import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../screens/checkout/styles';

const ProgressBar = ({ steps, currentStep}) => {
  return (
    <View style={styles.progressBar}>
      <View style={styles.progressBarInner}>
        <View style={{ alignItems: 'center' }}>
          <View style={styles.progressLine} />
        </View>
        <View style={styles.stepContainer}>
          {steps.map((label, i) => (
            <View key={i} style={styles.stepItem}>
              {i > currentStep && (
                <View style={styles.stepCircle}>
                  <Text style={styles.stepText}>{i + 1}</Text>
                </View>
              )}
              {i < currentStep && (
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="#fff"
                  />
                </View>
              )}
              {i == currentStep && (
                <View style={styles.selected}>
                  <Text style={{ fontSize: 13, color: '#ffffff' }}>
                    {i + 1}
                  </Text>
                </View>
              )}
              <Text style={{ fontSize: 13, color: 'white' }}>{label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default ProgressBar;
