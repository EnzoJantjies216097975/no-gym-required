// src/components/Section.tsx
import React, { ReactNode } from 'react';
import { StyleSheet, Text, View, ViewStyle, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type IoniconName = 
  | 'home'
  | 'settings'
  | 'chevron-forward'
  | 'person'
  | 'star'
  | 'calendar'
  | 'search'
  | 'heart'
  | 'cart'
  | 'notifications'
  // Add more as needed

interface SectionProps {
  title: string;
  subtitle?: string;
  icon?: IoniconName;
  iconColor?: string;
  actionText?: string;
  onAction?: () => void;
  children: ReactNode;
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  showBorder?: boolean;
  backgroundColor?: string;
}

const Section: React.FC<SectionProps> = ({
  title,
  subtitle,
  icon,
  iconColor = '#3498db',
  actionText,
  onAction,
  children,
  containerStyle,
  contentStyle,
  showBorder = true,
  backgroundColor = 'white',
}) => {
  return (
    <View style={[
      styles.container, 
      { backgroundColor },
      showBorder && styles.withBorder,
      containerStyle
    ]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {icon && (
            <Ionicons 
              name={icon} 
              size={20} 
              color={iconColor} 
              style={styles.icon} 
            />
          )}
          <View>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>
        
        {actionText && onAction && (
          <TouchableOpacity style={styles.actionButton} onPress={onAction}>
            <Text style={styles.actionText}>{actionText}</Text>
            <Ionicons name="chevron-forward" size={16} color="#3498db" />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 12,
  },
  withBorder: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    color: '#3498db',
    marginRight: 4,
  },
  content: {
    padding: 16,
  },
});

export default Section;