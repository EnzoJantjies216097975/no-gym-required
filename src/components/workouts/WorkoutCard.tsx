// src/components/WorkoutCard.tsx
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Define the workout type and props interface
export interface Workout {
  id: string;
  name: string;
  type: string;
  description?: string;
  duration: number | string;
  difficulty?: string;
  exercises?: Array<{
    name: string;
    sets?: number | string;
    reps?: number | string;
  }>;
}

interface WorkoutCardProps {
  workout: Workout;
  onPress: (workout: Workout) => void;
  compact?: boolean;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onPress, compact = false }) => {
  // Get the appropriate icon based on workout type
  const getWorkoutTypeIcon = (type: string): React.ComponentProps<typeof Ionicons>["name"] => {
    switch (type.toLowerCase()) {
      case 'upper body':
        return 'body-outline';
      case 'lower body':
        return 'fitness-outline';
      case 'core':
        return 'shield-outline';
      case 'total body':
        return 'barbell-outline';
      default:
        return 'barbell-outline';
    }
  };

  // Get color based on workout type
  const getWorkoutTypeColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'upper body':
        return '#3498db';
      case 'lower body':
        return '#2ecc71';
      case 'core':
        return '#f39c12';
      case 'total body':
        return '#9b59b6';
      default:
        return '#95a5a6';
    }
  };

  // Format the duration display
  const formatDuration = (duration: number | string): string => {
    if (typeof duration === 'number') {
      return `${duration} min`;
    }
    return String(duration);
  };

  return (
    <TouchableOpacity 
      style={[styles.container, compact && styles.compactContainer]} 
      onPress={() => onPress(workout)}
    >
      <View style={[
        styles.typeIndicator, 
        { backgroundColor: getWorkoutTypeColor(workout.type) }
      ]} />
      
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.nameText}>{workout.name}</Text>
          <View style={styles.durationContainer}>
            <Ionicons name="time-outline" size={14} color="#7f8c8d" />
            <Text style={styles.durationText}>{formatDuration(workout.duration)}</Text>
          </View>
        </View>
        
        {!compact && workout.description && (
          <Text style={styles.descriptionText} numberOfLines={2}>
            {workout.description}
          </Text>
        )}
        
        <View style={styles.metaRow}>
          <View style={styles.typeContainer}>
            <Ionicons name={getWorkoutTypeIcon(workout.type)} size={14} color={getWorkoutTypeColor(workout.type)} />
            <Text style={styles.typeText}>{workout.type}</Text>
          </View>
          
          {workout.difficulty && (
            <View style={styles.difficultyContainer}>
              <Text style={styles.difficultyText}>{workout.difficulty}</Text>
            </View>
          )}
          
          {workout.exercises && (
            <Text style={styles.exerciseCountText}>
              {workout.exercises.length} {workout.exercises.length === 1 ? 'exercise' : 'exercises'}
            </Text>
          )}
        </View>
      </View>
      
      <Ionicons name="chevron-forward" size={20} color="#95a5a6" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  compactContainer: {
    height: 70,
  },
  typeIndicator: {
    width: 4,
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    padding: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  typeText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  difficultyContainer: {
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 12,
  },
  difficultyText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  exerciseCountText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
});

export default WorkoutCard;