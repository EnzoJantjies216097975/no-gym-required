// src/components/StatsCard.tsx
import React from 'react';
import { StyleSheet, Text, View, ViewStyle, DimensionValue } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Define the IoniconName type
type IoniconName = keyof typeof Ionicons.glyphMap;

interface StatItem {
  icon: IoniconName;
  value: number | string;
  label: string;
  color?: string;
}

interface StatsCardProps {
  stats: StatItem[];
  title?: string;
  columns?: 1 | 2 | 3 | 4;
  style?: ViewStyle;
  compact?: boolean;
  backgroundColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  stats,
  title,
  columns = 2,
  style,
  compact = false,
  backgroundColor = 'white',
}) => {
  // Calculate width percentage based on columns
  const getItemWidth = (): DimensionValue => {
    switch (columns) {
      case 1:
        return '100%';
      case 3:
        return '33.33%';
      case 4:
        return '25%';
      default: // 2 columns
        return '50%';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      
      <View style={[
        styles.statsGrid, 
        compact ? styles.compactGrid : null,
        { flexWrap: columns === 1 ? 'nowrap' : 'wrap' }
      ]}>
        {stats.map((stat, index) => (
          <View 
            key={stat.label} 
            style={[
              styles.statItem, 
              compact ? styles.compactItem : null,
              { width: getItemWidth() }
            ]}
          >
            <Ionicons 
              name={stat.icon} 
              size={compact ? 20 : 24} 
              color={stat.color ?? '#3498db'} 
            />
            <Text style={[
              styles.statValue, 
              compact ? styles.compactValue : null,
              stat.color ? { color: stat.color } : null
            ]}>
              {stat.value}
            </Text>
            <Text style={[
              styles.statLabel, 
              compact ? styles.compactLabel : null
            ]}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  compactGrid: {
    marginVertical: -4,
  },
  statItem: {
    alignItems: 'center',
    marginBottom: 16,
  },
  compactItem: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 8,
    marginBottom: 4,
  },
  compactValue: {
    fontSize: 16,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 8,
    marginRight: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  compactLabel: {
    fontSize: 12,
  },
});

export default StatsCard;
