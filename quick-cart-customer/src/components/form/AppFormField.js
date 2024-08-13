import React from 'react';
import { useFormikContext } from 'formik';
import AppTextInput from './AppTextInput';
import ErrorMessage from './ErrorMessage';

const AppFormField = ({ name, placeholder, leftIcon, ...otherProps }) => {
  const { setFieldTouched, setFieldValue, errors, touched, values } = useFormikContext();

  return (
    <>
      <AppTextInput
        label={name}
        leftIcon={leftIcon}
        placeholder={placeholder}
        onBlur={() => setFieldTouched(name)}
        onChangeText={(text) => setFieldValue(name, text)}
        value={values[name]}
        {...otherProps}
      />
      <ErrorMessage error={errors[name]} touch={touched[name]} />
    </>
  );
}

export default AppFormField;
