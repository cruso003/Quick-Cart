import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { styles } from '../../screens/checkout/styles';

const OrderStatus = ({ status, message, onButtonPress }) => {
  const icon = status === 'success' ? 'checkcircleo' : 'closecircleo';
  const iconColor = status === 'success' ? '#26d06e' : '#ff3333';
  const buttonText = status === 'success' ? 'Continue Shopping' : 'Try Again';

  return (
    <View style={{ padding: 15, alignItems: 'center', marginTop: 50 }}>
      <Text style={{ fontSize: 20 }}>{message}</Text>
      <AntDesign
        name={icon}
        size={60}
        color={iconColor}
        style={{ marginVertical: 25 }}
      />
      <TouchableOpacity
        style={[
          styles.centerElement,
          {
            width: 165,
            height: 35,
            backgroundColor: '#6689ff',
            elevation: 5,
            borderRadius: 20,
          },
        ]}
        onPress={onButtonPress}
      >
        <Text style={{ color: '#fff' }}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderStatus;
