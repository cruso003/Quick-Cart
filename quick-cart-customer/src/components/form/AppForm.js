import React from 'react';
import { View } from 'react-native';
import { Formik } from 'formik';

function AppForm({ initialValues, onSubmit, validationSchema, children }) {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {(formikProps) => (
        <View >
          {children}
        </View>
      )}
    </Formik>
  );
}

export default AppForm;
