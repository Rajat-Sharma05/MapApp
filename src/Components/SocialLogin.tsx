import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { StyleSheet } from 'react-native';

interface SocialLoginProps {
  onGooglePress: () => void;
  onFacebookPress: () => void;
  googleIcon: any;
  facebookIcon: any;
}

const SocialLogin: React.FC<SocialLoginProps> = ({
  onGooglePress,
  onFacebookPress,
  googleIcon,
  facebookIcon,
}) => {
  return (
    <View style={styles.socialContainer}>
      <Text style={styles.orText}>Or continue with</Text>
      <View style={styles.socialRow}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={onGooglePress}
          activeOpacity={0.7}
        >
          <Image source={googleIcon} style={styles.socialIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={onFacebookPress}
          activeOpacity={0.7}
        >
          <Image source={facebookIcon} style={styles.socialIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SocialLogin;

const styles = StyleSheet.create({
  socialContainer: {
    marginTop: 24,
  },
  orText: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 14,
    marginBottom: 14,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
  },
  socialIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
});