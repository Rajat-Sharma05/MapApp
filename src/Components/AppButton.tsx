import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';

interface AppButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  type?: 'primary' | 'secondary' | 'danger';
}

const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  type = 'primary',
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.button,
        type === 'secondary' && styles.secondaryButton,
        type === 'danger' && styles.dangerButton,
      ]}
    >
      <Text
        style={[
          styles.text,
          type === 'secondary' && styles.secondaryText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButton: {
    backgroundColor: '#E5E7EB',
  },
  dangerButton: {
    backgroundColor: '#DC2626',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryText: {
    color: '#111827',
  },
});