// src/screens/exercises/ExerciseLibraryScreen.tsx
import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  Image,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Mock data for exercises
const exercisesData = [
  {
    id: '1',
    name: 'Pushup',
    category: 'Push',
    difficulty: 'Beginner',
    primaryMuscles: ['Chest', 'Shoulders', 'Triceps'],
    equipment: 'None',
    description: 'The standard pushup works your chest, shoulders, and triceps.',
    instructions: 'Start in a plank position with your hands slightly wider than shoulder-width apart. Lower your body until your chest nearly touches the floor. Keep your elbows close to your body as you push back up to the starting position.',
    variations: ['Wide Pushup', 'Diamond Pushup', 'Decline Pushup', 'One-Arm Pushup'],
    imageUrl: 'https://example.com/pushup.jpg',
  },
  {
    id: '2',
    name: 'Pullup',
    category: 'Pull',
    difficulty: 'Intermediate',
    primaryMuscles: ['Back', 'Biceps', 'Shoulders'],
    equipment: 'Pullup Bar',
    description: 'The pullup is one of the best exercises for building upper body strength, particularly in your back and arms.',
    instructions: 'Hang from a pullup bar with an overhand grip, hands slightly wider than shoulder-width apart. Pull yourself up until your chin clears the bar, then lower yourself back down with control.',
    variations: ['Chinup', 'Wide-Grip Pullup', 'Commando Pullup', 'L-Sit Pullup'],
    imageUrl: 'https://example.com/pullup.jpg',
  },
  {
    id: '3',
    name: 'Bodyweight Squat',
    category: 'Legs',
    difficulty: 'Beginner',
    primaryMuscles: ['Quadriceps', 'Hamstrings', 'Glutes', 'Core'],
    equipment: 'None',
    description: 'The bodyweight squat is a fundamental lower body exercise that targets your quads, hamstrings, and glutes.',
    instructions: 'Stand with your feet shoulder-width apart. Push your hips back and bend your knees to lower your body as far as you can. Keep your chest up and your weight on your heels. Push through your heels to return to the starting position.',
    variations: ['Jump Squat', 'Split Squat', 'Pistol Squat', 'Sumo Squat'],
    imageUrl: 'https://example.com/squat.jpg',
  },
  {
    id: '4',
    name: 'Plank',
    category: 'Core',
    difficulty: 'Beginner',
    primaryMuscles: ['Abs', 'Lower Back', 'Shoulders'],
    equipment: 'None',
    description: 'The plank is one of the best exercises for core conditioning.',
    instructions: 'Get into a pushup position, but with your weight on your forearms instead of your hands. Your elbows should be directly beneath your shoulders. Keep your body in a straight line from head to heels. Hold this position.',
    variations: ['Side Plank', 'Plank Shoulder Tap', 'Walking Plank', 'Plank Jack'],
    imageUrl: 'https://example.com/plank.jpg',
  },
  {
    id: '5',
    name: 'Burpee',
    category: 'Full Body',
    difficulty: 'Advanced',
    primaryMuscles: ['Full Body'],
    equipment: 'None',
    description: 'The burpee is a full-body exercise that combines a squat, pushup, and jump.',
    instructions: 'Start standing, then squat down and place your hands on the floor. Jump your feet back into a plank position, do a pushup, then jump your feet back to your hands. Finally, jump up with your arms extended overhead.',
    variations: ['Half Burpee', 'Burpee Pull-up', 'Mountain Climber Burpee', 'Single-Leg Burpee'],
    imageUrl: 'https://example.com/burpee.jpg',
  },
];

// Filter categories
const categories = [
  { id: 'all', name: 'All' },
  { id: 'push', name: 'Push' },
  { id: 'pull', name: 'Pull' },
  { id: 'legs', name: 'Legs' },
  { id: 'core', name: 'Core' },
  { id: 'fullbody', name: 'Full Body' },
];

// Difficulty levels
const difficultyLevels = [
  { id: 'all', name: 'All Levels' },
  { id: 'beginner', name: 'Beginner' },
  { id: 'intermediate', name: 'Intermediate' },
  { id: 'advanced', name: 'Advanced' },
];

// Exercise Item Component
const ExerciseItem = ({ exercise, onPress }) => {
  return (
    <TouchableOpacity style={styles.exerciseItem} onPress={() => onPress(exercise)}>
      <View style={styles.exerciseImageContainer}>
        <View style={styles.exercisePlaceholder}>
          <Ionicons name="fitness-outline" size={40} color="#bdc3c7" />
        </View>
      </View>
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <View style={styles.exerciseTags}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{exercise.category}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{exercise.difficulty}</Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#95a5a6" />
    </TouchableOpacity>
  );
};

// Exercise Detail Screen
const ExerciseDetailScreen = ({ route, navigation }) => {
  const { exercise } = route.params;
  const insets = useSafeAreaInsets();
  
  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.exerciseDetailImageContainer}>
        <View style={styles.exerciseDetailPlaceholder}>
          <Ionicons name="fitness-outline" size={80} color="#bdc3c7" />
        </View>
      </View>
      
      <View style={styles.exerciseDetailContent}>
        <Text style={styles.exerciseDetailName}>{exercise.name}</Text>
        
        <View style={styles.exerciseDetailTags}>
          {exercise.primaryMuscles.map((muscle, index) => (
            <View style={styles.tag} key={index}>
              <Text style={styles.tagText}>{muscle}</Text>
            </View>
          ))}
          <View style={[styles.tag, styles.difficultyTag]}>
            <Text style={styles.tagText}>{exercise.difficulty}</Text>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.sectionText}>{exercise.description}</Text>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <Text style={styles.sectionText}>{exercise.instructions}</Text>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Equipment Needed</Text>
          <Text style={styles.sectionText}>{exercise.equipment}</Text>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Variations</Text>
          {exercise.variations.map((variation, index) => (
            <Text key={index} style={styles.variationItem}>• {variation}</Text>
          ))}
        </View>
        
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>Add to Workout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Exercise Library Main Screen
const ExerciseLibraryMainScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  
  // Filter exercises based on search query, category, and difficulty
  const filteredExercises = exercisesData.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || exercise.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesDifficulty = selectedDifficulty === 'all' || exercise.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });
  
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#95a5a6" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercises..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilters}>
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryFilterButton,
                selectedCategory === category.id.toLowerCase() && styles.categoryFilterButtonActive
              ]}
              onPress={() => setSelectedCategory(category.id.toLowerCase())}
            >
              <Text
                style={[
                  styles.categoryFilterText,
                  selectedCategory === category.id.toLowerCase() && styles.categoryFilterTextActive
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.difficultyFilters}>
          {difficultyLevels.map(level => (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.difficultyFilterButton,
                selectedDifficulty === level.id.toLowerCase() && styles.difficultyFilterButtonActive
              ]}
              onPress={() => setSelectedDifficulty(level.id.toLowerCase())}
            >
              <Text
                style={[
                  styles.difficultyFilterText,
                  selectedDifficulty === level.id.toLowerCase() && styles.difficultyFilterTextActive
                ]}
              >
                {level.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <FlatList
        data={filteredExercises}
        renderItem={({ item }) => (
          <ExerciseItem
            exercise={item}
            onPress={(exercise) => navigation.navigate('ExerciseDetail', { exercise })}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.exerciseList}
      />
    </View>
  );
};

// Create Stack Navigator for Exercise Library
const Stack = createStackNavigator();

const ExerciseLibraryScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ExerciseLibraryMain"
        component={ExerciseLibraryMainScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ExerciseDetail"
        component={ExerciseDetailScreen}
        options={{ 
          title: 'Exercise Details',
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: '#3498db',
          },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  filtersContainer: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  categoryFilters: {
    marginBottom: 8,
  },
  categoryFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ecf0f1',
    marginRight: 8,
  },
  categoryFilterButtonActive: {
    backgroundColor: '#3498db',
  },
  categoryFilterText: {
    color: '#7f8c8d',
    fontWeight: '500',
  },
  categoryFilterTextActive: {
    color: 'white',
  },
  difficultyFilters: {
    marginBottom: 8,
  },
  difficultyFilterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#ecf0f1',
    marginRight: 8,
  },
  difficultyFilterButtonActive: {
    backgroundColor: '#2ecc71',
  },
  difficultyFilterText: {
    color: '#7f8c8d',
    fontSize: 12,
    fontWeight: '500',
  },
  difficultyFilterTextActive: {
    color: 'white',
  },
  exerciseList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  exerciseImageContainer: {
    marginRight: 16,
  },
  exercisePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  exerciseTags: {
    flexDirection: 'row',
  },
  tag: {
    backgroundColor: '#ecf0f1',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  difficultyTag: {
    backgroundColor: '#2ecc71',
  },
  exerciseDetailImageContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: 'white',
  },
  exerciseDetailPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseDetailContent: {
    padding: 16,
  },
  exerciseDetailName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  exerciseDetailTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 24,
  },
  variationItem: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 24,
    marginBottom: 4,
  },
  startButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  } 
});

export default ExerciseLibraryScreen;