// src/components/Header.tsx
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  StatusBar, 
  ViewStyle,
  TextStyle
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  title: string;
  subtitle?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  backgroundColor = '#3498db',
  textColor = 'white',
  style,
  titleStyle,
  subtitleStyle
}) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor,
        paddingTop: insets.top || 16
      },
      style
    ]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={backgroundColor}
        translucent
      />
      
      <View style={styles.content}>
        <View style={styles.leftContainer}>
          {leftIcon && onLeftPress && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onLeftPress}
            >
              <Ionicons name={leftIcon} size={24} color={textColor} />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: textColor }, titleStyle]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: `${textColor}CC` }, subtitleStyle]}>
              {subtitle}
            </Text>
          )}
        </View>
        
        <View style={styles.rightContainer}>
          {rightIcon && onRightPress && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onRightPress}
            >
              <Ionicons name={rightIcon} size={24} color={textColor} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  iconButton: {
    padding: 4,
  },
});

export default Header;