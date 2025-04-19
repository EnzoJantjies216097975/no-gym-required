// src/components/EmptyState.tsx
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';
import type { ComponentProps } from 'react';
type IoniconName = ComponentProps<typeof Ionicons>['name'];

interface EmptyStateProps {
  icon?: IoniconName;
  iconColor?: string;
  title: string;
  message?: string;
  buttonTitle?: string;
  onButtonPress?: () => void;
  style?: ViewStyle;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'information-circle-outline',
  iconColor = '#95a5a6',
  title,
  message,
  buttonTitle,
  onButtonPress,
  style
}) => {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name={icon} size={64} color={iconColor} />
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
      {buttonTitle && onButtonPress && (
        <Button
          title={buttonTitle}
          onPress={onButtonPress}
          style={styles.button}
          size="medium"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    marginTop: 8,
  },
});

export default EmptyState;