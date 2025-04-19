// src/components/MeasurementCard.tsx
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface Measurement {
  key: string;
  title: string;
  current: number;
  unit: string;
  history?: Array<{
    date: string;
    value: number;
  }>;
}

interface MeasurementCardProps {
  measurement: Measurement;
  trend?: number;
  onPress?: (measurement: Measurement) => void;
}

const MeasurementCard: React.FC<MeasurementCardProps> = ({
  measurement,
  trend = 0,
  onPress
}) => {
  // Function to determine trend color based on measurement type and trend direction
  const getTrendColor = (title: string, trend: number): string => {
    // For weight and body fat, negative trend (losing) is good
    const isNegativeTrendGood = 
      title.toLowerCase().includes('weight') || 
      title.toLowerCase().includes('fat') ||
      title.toLowerCase().includes('waist');
    
    if (trend === 0) return '#7f8c8d'; // Neutral
    
    if (isNegativeTrendGood) {
      return trend < 0 ? '#2ecc71' : '#e74c3c'; // Green for loss, red for gain
    } else {
      return trend > 0 ? '#2ecc71' : '#e74c3c'; // Green for gain, red for loss
    }
  };
  
  // Get trend icon name
  const getTrendIcon = (trend: number): keyof typeof Ionicons.glyphMap => {
    if (trend > 0) return 'arrow-up-circle';  // Correct icon name
    if (trend < 0) return 'arrow-down-circle';  // Correct icon name
    return 'remove-circle';  // Correct icon name
  };
  
  // Get trend color based on measurement type and trend
  const trendColor = getTrendColor(measurement.title, trend);
  
  // Handle the card press
  const handlePress = () => {
    if (onPress) {
      onPress(measurement);
    }
  };
  
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={handlePress}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{measurement.title}</Text>
        <View style={styles.trendContainer}>
          <Ionicons name={getTrendIcon(trend)} size={14} color={trendColor} />
          <Text style={[styles.trendText, { color: trendColor }]}>
            {Math.abs(trend).toFixed(1)} {measurement.unit}
          </Text>
        </View>
      </View>
      <Text style={styles.value}>
        {measurement.current} <Text style={styles.unit}>{measurement.unit}</Text>
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
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
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    marginLeft: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  unit: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});

export default MeasurementCard;