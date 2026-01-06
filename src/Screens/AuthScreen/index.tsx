import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import * as Yup from 'yup';

import AuthForm from '../../Components/AuthForm';
import SocialLogin from '../../Components/SocialLogin';

const AuthScreen = () => {
  const [isSignup, setIsSignup] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '462335139018-00oiiffhu1u43noatprjn1alvq0k0jue.apps.googleusercontent.com',
    });
  }, []);

  const googleIcon = require('../../assets/images/google.png');
  const facebookIcon = require('../../assets/images/facebook.png');

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email('Enter a valid email')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const SignupSchema = LoginSchema.shape({
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords do not match')
      .required('Confirm password is required'),
  });

  const handleAuth = async (values: any, { setSubmitting, resetForm }: any) => {
    try {
      if (isSignup) {
        await auth().createUserWithEmailAndPassword(
          values.email,
          values.password,
        );
        await auth().signOut();
        Alert.alert('Account created successfully');
        resetForm();
        setIsSignup(false);
        return;
      }

      await auth().signInWithEmailAndPassword(values.email, values.password);
      Alert.alert('Logged in successfully');
      navigation.replace('MapScreen');
    } catch (error: any) {
      Alert.alert('Authentication Error', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      const { idToken } = await GoogleSignin.getTokens();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      navigation.replace('MapScreen');
    } catch (error: any) {
      Alert.alert('Google Sign-In Error', error.message);
    }
  };

  const facebookLogin = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
      if (result.isCancelled) return;
      const data = await AccessToken.getCurrentAccessToken();
      const facebookCredential = auth.FacebookAuthProvider.credential(
        data!.accessToken,
      );
      await auth().signInWithCredential(facebookCredential);
      navigation.replace('MapScreen');
    } catch (error) {
      console.log('Facebook login error:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>{isSignup ? 'Sign Up' : 'Log In'}</Text>
          <Text style={styles.subtitle}>
            {isSignup ? 'Create your account' : 'Welcome back, please login'}
          </Text>

          <AuthForm
            isSignup={isSignup}
            initialValues={{ email: '', password: '', confirmPassword: '' }}
            validationSchema={isSignup ? SignupSchema : LoginSchema}
            onSubmit={handleAuth}
            toggleSignup={() => setIsSignup(!isSignup)}
          />

          {!isSignup && (
            <SocialLogin
              onGooglePress={signInWithGoogle}
              onFacebookPress={facebookLogin}
              googleIcon={googleIcon}
              facebookIcon={facebookIcon}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 28,
  },
});
