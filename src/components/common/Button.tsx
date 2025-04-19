// src/components/Button.tsx
import React from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
  StyleProp
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Define button variants
type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

// Define button sizes
type ButtonSize = 'small' | 'medium' | 'large';

type IoniconName = keyof typeof Ionicons.glyphMap;

interface ButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IoniconName;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  outline?: boolean;
  round?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
  outline = false,
  round = false,
  style,
  textStyle
}) => {
  // Get the variant color
  const getVariantColor = (): string => {
    switch (variant) {
      case 'primary':
        return '#3498db';
      case 'secondary':
        return '#95a5a6';
      case 'success':
        return '#2ecc71';
      case 'danger':
        return '#e74c3c';
      case 'warning':
        return '#f39c12';
      case 'info':
        return '#1abc9c';
      default:
        return '#3498db';
    }
  };
  
  // Get size-based styles
  const getSizeStyles = (): { container: ViewStyle, text: TextStyle, icon: number } => {
    switch (size) {
      case 'small':
        return {
          container: { paddingVertical: 6, paddingHorizontal: 12 },
          text: { fontSize: 12 },
          icon: 16
        };
      case 'large':
        return {
          container: { paddingVertical: 12, paddingHorizontal: 24 },
          text: { fontSize: 16 },
          icon: 24
        };
      default: // medium
        return {
          container: { paddingVertical: 10, paddingHorizontal: 16 },
          text: { fontSize: 14 },
          icon: 20
        };
    }
  };
  
  const variantColor = getVariantColor();
  const sizeStyles = getSizeStyles();
  
  // Compute button styles based on props
  const buttonStyles: StyleProp<ViewStyle> = [
    styles.button,
    sizeStyles.container,
    outline ? { 
      backgroundColor: 'transparent', 
      borderWidth: 1, 
      borderColor: variantColor 
    } : { 
      backgroundColor: variantColor 
    },
    round ? { borderRadius: 50 } : { borderRadius: 8 },
    fullWidth ? { width: '100%' as const } : {},
    disabled ? { opacity: 0.5 } : {},
    style
  ];
  
  // Compute text styles based on props
  const buttonTextStyles = [
    styles.buttonText,
    sizeStyles.text,
    outline ? { color: variantColor } : { color: 'white' },
    icon && iconPosition === 'left' ? { marginLeft: 8 } : {},
    icon && iconPosition === 'right' ? { marginRight: 8 } : {},
    textStyle
  ];
  
  // Render button content
  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="small" color={outline ? variantColor : 'white'} />;
    }
    
    if (icon) {
      const iconElement = (
        <Ionicons
          name={icon} 
          size={sizeStyles.icon} 
          color={outline ? variantColor : 'white'} 
          style={styles.icon} 
        />
      );
      
      return (
        <>
          {iconPosition === 'left' && iconElement}
          <Text style={buttonTextStyles}>{title}</Text>
          {iconPosition === 'right' && iconElement}
        </>
      );
    }
    
    return <Text style={buttonTextStyles}>{title}</Text>;
  };
  
  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    fontWeight: '500',
  },
  icon: {
    marginHorizontal: 4,
  },
});

export default Button;