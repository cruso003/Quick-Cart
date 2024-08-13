import React from 'react';
import { Button, ActivityIndicator, MD2Colors } from 'react-native-paper';
import tailwind from 'twrnc';
import { useFormikContext } from 'formik';
import { Text } from 'react-native';
import colors from '../../../theme/colors';

function SubmitButton({ title, disable, loader }) {
  const { handleSubmit } = useFormikContext();

  const handlePress = () => {
    handleSubmit();
  };

  return (
    <Button
      mode="contained"
      onPress={handlePress}
      style={{ marginTop: 10, backgroundColor: colors.primary }}
      disabled={disable || loader}
    >
      {loader ? (
        <ActivityIndicator animating={loader} color={MD2Colors.white} />
      ) : (
        <Text style={tailwind`text-center text-lg text-white`}>
            {title}
        </Text>
      )}
    </Button>
  );
}

export default SubmitButton;
