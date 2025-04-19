// src/components/ExerciseCard.tsx
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Define exercise type and props interface
export interface Exercise {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  primaryMuscles?: string[];
  equipment: string;
  description?: string;
  instructions?: string;
  variations?: string[];
  imageUrl?: string;
  sets?: number | string;
  reps?: number | string;
  duration?: number | string;
}

interface ExerciseCardProps {
  exercise: Exercise;
  onPress: (exercise: Exercise) => void;
  showDetails?: boolean;
  currentSet?: number;
  totalSets?: number;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ 
  exercise, 
  onPress, 
  showDetails = false,
  currentSet = undefined,
  totalSets = undefined
}) => {
  // Get color based on exercise category
  const getCategoryColor = (category: string): string => {
    switch (category.toLowerCase()) {
      case 'push':
        return '#3498db';
      case 'pull':
        return '#e74c3c';
      case 'legs':
        return '#2ecc71';
      case 'core':
        return '#f39c12';
      case 'full body':
        return '#9b59b6';
      default:
        return '#95a5a6';
    }
  };

  type IconName = 'arrow-up-circle' | 'arrow-down-circle' | 'footsteps' | 'shield' | 'body' | 'fitness';

  // Get icon based on exercise category
  const getCategoryIcon = (category: string): IconName => {
    switch (category.toLowerCase()) {
      case 'push':
        return 'arrow-up-circle';
      case 'pull':
        return 'arrow-down-circle';
      case 'legs':
        return 'footsteps';
      case 'core':
        return 'shield';
      case 'full body':
        return 'body';
      default:
        return 'fitness';
    }
  };

  let difficultyColor: string;
  if (exercise.difficulty.toLowerCase() === 'beginner') {
    difficultyColor = '#2ecc71';
  } else if (exercise.difficulty.toLowerCase() === 'intermediate') {  
    difficultyColor = '#f39c12';
} else {
  difficultyColor = '#e74c3c';
}

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress(exercise)}
    >
      <View style={styles.imageContainer}>
        {exercise.imageUrl ? (
          <Image source={{ uri: exercise.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="fitness-outline" size={32} color="#bdc3c7" />
          </View>
        )}
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.nameText}>{exercise.name}</Text>
          {(currentSet !== undefined && totalSets !== undefined) && (
            <Text style={styles.setInfoText}>Set {currentSet}/{totalSets}</Text>
          )}
        </View>
        
        <View style={styles.metaRow}>
          <View style={[
            styles.categoryContainer, 
            { backgroundColor: getCategoryColor(exercise.category) }
          ]}>
            <Ionicons name={getCategoryIcon(exercise.category)} size={12} color="white" />
            <Text style={styles.categoryText}>{exercise.category}</Text>
          </View>
          
          <View style={[
            styles.difficultyContainer, 
            { 
              backgroundColor: difficultyColor
            }
          ]}>
            <Text style={styles.difficultyText}>{exercise.difficulty}</Text>
          </View>
        </View>
        
        {showDetails && (
          <View style={styles.detailsContainer}>
            {exercise.equipment && (
              <View style={styles.detailRow}>
                <Ionicons name="barbell-outline" size={14} color="#7f8c8d" />
                <Text style={styles.detailText}>{exercise.equipment}</Text>
              </View>
            )}
            
            {exercise.primaryMuscles && exercise.primaryMuscles.length > 0 && (
              <View style={styles.detailRow}>
                <Ionicons name="body-outline" size={14} color="#7f8c8d" />
                <Text style={styles.detailText}>{exercise.primaryMuscles.join(', ')}</Text>
              </View>
            )}
            
            {exercise.sets && exercise.reps && (
              <View style={styles.detailRow}>
                <Ionicons name="repeat-outline" size={14} color="#7f8c8d" />
                <Text style={styles.detailText}>{exercise.sets} sets × {exercise.reps}</Text>
              </View>
            )}
            
            {exercise.duration && (
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={14} color="#7f8c8d" />
                <Text style={styles.detailText}>{exercise.duration}</Text>
              </View>
            )}
          </View>
        )}
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
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    marginRight: 12,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
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
  setInfoText: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 12,
    color: 'white',
    marginLeft: 4,
  },
  difficultyContainer: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    color: 'white',
  },
  detailsContainer: {
    marginTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 4,
  },
});

export default ExerciseCard;
