import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';


interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: number;
  backgroundColor?: string;
  fillColor?: string;
  animated?: boolean;
  showPercentage?: boolean;
  label?: string;
  radius?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  backgroundColor = '#ecf0f1',
  fillColor = '#3498db',
  animated = true,
  showPercentage = false,
  label = '',
  radius = 4,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(progressAnim, {
        toValue: clampedProgress,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      progressAnim.setValue(clampedProgress);
    }
  }, [clampedProgress, animated]);

  const animatedWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {(label || showPercentage) && (
        <View style={styles.labelContainer}>
          {label ? <Text style={styles.label}>{label}</Text> : null}
          {showPercentage ? (
            <Text style={styles.percentage}>{Math.round(clampedProgress)}%</Text>
          ) : null}
        </View>
      )}
      <View
        style={[
          styles.progressContainer,
          {
            height,
            backgroundColor,
            borderRadius: radius,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: animatedWidth,
              backgroundColor: fillColor,
              borderRadius: radius,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 4,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: '#2c3e50',
  },
  percentage: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  progressContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
});

export default ProgressBar;