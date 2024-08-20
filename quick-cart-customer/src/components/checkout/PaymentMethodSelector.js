import React from 'react';
import { View, Image } from 'react-native';
import { styles } from '../../screens/checkout/styles';
import CustomRadioButton from '../CustomRadioButton';

const PaymentMethodSelector = ({ paymentMethods, selectedPaymentMethod, setSelectedPaymentMethod }) => (
  <View style={{ padding: 20, marginBottom: 20, backgroundColor: "#fff" }}>
    {paymentMethods.map((method) => (
      <View key={method.id} style={styles.paymentMethodContainer}>
        <CustomRadioButton
          value={method.id}
          selectedValue={selectedPaymentMethod}
          onPress={setSelectedPaymentMethod}
          label={method.name}
        />
        <Image source={method.icon} style={styles.paymentMethodImage} />
      </View>
    ))}
  </View>
);

export default PaymentMethodSelector;
