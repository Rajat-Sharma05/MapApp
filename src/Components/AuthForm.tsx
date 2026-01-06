import React from 'react';
import { View, Text } from 'react-native';
import { Formik } from 'formik';
import CustomInputField from './CustomInputField';
import CustomButton from './CustomButton';

interface AuthFormProps {
  isSignup: boolean;
  initialValues: any;
  validationSchema: any;
  onSubmit: any;
  toggleSignup?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  isSignup,
  initialValues,
  validationSchema,
  onSubmit,
  toggleSignup,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        isSubmitting,
      }) => (
        <>
          <CustomInputField
            label="Email"
            placeholder="Enter email"
            value={values.email}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            keyboardType="email-address"
            error={touched.email ? errors.email : ''}
          />

          <CustomInputField
            label="Password"
            placeholder="Enter password"
            value={values.password}
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            secureTextEntry
            error={touched.password ? errors.password : ''}
          />

          {isSignup && (
            <CustomInputField
              label="Confirm Password"
              placeholder="Confirm password"
              value={values.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              secureTextEntry
              error={touched.confirmPassword ? errors.confirmPassword : ''}
            />
          )}

          <CustomButton
            title={isSignup ? 'Sign Up' : 'Login'}
            onPress={handleSubmit}
            loading={isSubmitting}
          />

          {toggleSignup && (
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}>
              <Text style={{ fontSize: 14, color: '#64748B' }}>
                {isSignup ? 'Already have an account?' : "Don't have an account?"}
              </Text>
              <Text
                style={{ fontSize: 14, color: '#2563EB', fontWeight: '600' }}
                onPress={toggleSignup}
              >
                {isSignup ? ' Login' : ' Sign Up'}
              </Text>
            </View>
          )}
        </>
      )}
    </Formik>
  );
};

export default AuthForm;