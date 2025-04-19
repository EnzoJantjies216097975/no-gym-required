// src/screens/workouts/WorkoutScreen.tsx
import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  Modal,
  // SafeAreaView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import WorkoutExecutionScreen from './WorkoutExecutionScreen';

// Mock data for workouts from the book
const workoutsData = [
  {
    id: '1',
    name: 'Powered-Up Pushups',
    category: 'Upper Body',
    description: 'Build a bigger, stronger upper body without lifting a weight. This 8-week program will develop your chest, shoulders, and triceps through progressive pushup variations.',
    duration: '8 weeks',
    frequency: '2-3 sessions per week',
    level: 'Beginner to Advanced',
    phases: [
      {
        name: 'Phase 1: Endurance',
        weeks: '1-2',
        description: 'Build your endurance with standard pushup variations.',
        workouts: [
          {
            name: 'Workout A',
            exercises: [
              { name: 'Wide Pushup', sets: 3, reps: '10-15' },
              { name: 'Alternating Shuffle Pushup', sets: 3, reps: '10-15' },
              { name: 'Diamond Pushup', sets: 3, reps: '10-15' },
            ]
          }
        ]
      },
      {
        name: 'Phase 2: Strength',
        weeks: '3-6',
        description: 'Increase strength with more challenging variations.',
        workouts: [
          {
            name: 'Workout B',
            exercises: [
              { name: 'One-Arm Pushup (hands on box)', sets: 4, reps: '10-15' },
              { name: 'Hands-on-Box Diamond Pushup', sets: 4, reps: '10-15' },
              { name: 'Crossover Box Pushup', sets: 4, reps: '10-15' },
            ]
          }
        ]
      },
      {
        name: 'Phase 3: Power',
        weeks: '7-8',
        description: 'Add explosiveness and speed to pack on more size.',
        workouts: [
          {
            name: 'Workout C',
            exercises: [
              { name: 'Dynamic Box Pushup', sets: 'Circuit', reps: '10' },
              { name: 'Crossover Box Pushup', sets: 'Circuit', reps: '10' },
              { name: 'Hands-on-Box Diamond Pushup', sets: 'Circuit', reps: '10' },
            ]
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'The Body-Weight Burner',
    category: 'Total Body',
    description: 'Use this anytime, anywhere workout to build total-body fitness when you\'re pressed for time.',
    duration: '25 minutes',
    frequency: '3-6 sessions per week',
    level: 'All Levels',
    phases: [
      {
        name: 'Warmup',
        description: 'Prepare your body for the workout.',
        workouts: [
          {
            name: 'Warmup Routine',
            exercises: [
              { name: 'Pushup to Downward Dog', sets: 1, reps: '1 minute' },
              { name: 'Spider-Man Lunge with Overhead Reach', sets: 1, reps: '30 seconds' },
            ]
          }
        ]
      },
      {
        name: 'Main Workout',
        description: 'Complete 2 rounds of this circuit.',
        workouts: [
          {
            name: 'Circuit',
            exercises: [
              { name: 'Around-the-World Pushup', sets: 2, reps: '40 sec work, 20 sec rest, 40 sec work' },
              { name: 'Superman Hold', sets: 2, reps: '40 sec work, 20 sec rest, 40 sec work' },
              { name: 'Lateral Bound to Pushup', sets: 2, reps: '40 sec work, 20 sec rest, 40 sec work' },
              { name: 'High-Knee Run', sets: 2, reps: '40 sec work, 20 sec rest, 40 sec work' },
              { name: 'Knee Tuck', sets: 2, reps: '40 sec work, 20 sec rest, 40 sec work' },
              { name: 'Burpee Broad Jump', sets: 2, reps: '40 sec work, 20 sec rest, 40 sec work' },
            ]
          }
        ]
      },
      {
        name: 'Finisher',
        description: 'Complete this challenging finisher.',
        workouts: [
          {
            name: 'Finisher Routine',
            exercises: [
              { name: 'Pushup to Russian Twist Ladder', sets: 1, reps: '3 minutes' },
            ]
          }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Shredded in 30',
    category: 'Total Body',
    description: 'This twice-a-week, half-hour program will whip you into shape in record time.',
    duration: '30 minutes per session',
    frequency: '2 sessions per week',
    level: 'Intermediate',
    phases: [
      {
        name: 'Warmup',
        description: 'Warm up with a 6-minute mix of jumping jacks, inchworms, and high knees.',
        workouts: [
          {
            name: 'Warmup Routine',
            exercises: [
              { name: 'Jumping Jacks', sets: 1, reps: '2 minutes' },
              { name: 'Inchworms', sets: 1, reps: '2 minutes' },
              { name: 'High Knees', sets: 1, reps: '2 minutes' },
            ]
          }
        ]
      },
      {
        name: 'Circuit 1',
        description: 'Complete as many rounds as possible in 10 minutes.',
        workouts: [
          {
            name: 'AMRAP Circuit 1',
            exercises: [
              { name: 'Traveling Dumbbell Swing', sets: 'AMRAP', reps: '15' },
              { name: 'Pushup to Shoulder Tap', sets: 'AMRAP', reps: '12' },
              { name: 'Plank to Side Plank', sets: 'AMRAP', reps: '5' },
            ]
          }
        ]
      },
      {
        name: 'Circuit 2',
        description: 'Complete as many rounds as possible in 8 minutes.',
        workouts: [
          {
            name: 'AMRAP Circuit 2',
            exercises: [
              { name: '180-Degree Squat Jump', sets: 'AMRAP', reps: '15' },
              { name: 'Alternating Renegade Row', sets: 'AMRAP', reps: '6' },
              { name: 'Side Plank with Dumbbell Reach', sets: 'AMRAP', reps: '5 per side' },
            ]
          }
        ]
      },
      {
        name: 'Finisher',
        description: 'For the last 6 minutes, do 5-8 burpees each minute.',
        workouts: [
          {
            name: 'Burpee Finisher',
            exercises: [
              { name: 'Burpees (with twisted pushup)', sets: 6, reps: '5-8 per minute' },
            ]
          }
        ]
      }
    ]
  },
  {
    id: '4',
    name: 'Summer Body Challenge',
    category: 'Total Body',
    description: 'For 30 days, set aside 15-60 minutes to complete these daily challenges. If you do, you\'ll reveal your accomplishment: a stronger, more muscular body.',
    duration: '30 days',
    frequency: 'Daily',
    level: 'All Levels',
    phases: [
      {
        name: 'Phase 1: Lay the Groundwork',
        days: '1-8',
        description: 'Build your foundation with these workouts.',
        workouts: [
          {
            name: 'Day 1',
            exercises: [{ name: 'Run Bleachers', sets: 1, reps: '50 minutes' }]
          },
          {
            name: 'Day 2',
            exercises: [{ name: 'Bike to Work', sets: 1, reps: 'N/A' }]
          },
          // Additional days would be listed here
        ]
      },
      {
        name: 'Phase 2: Build Brute Strength',
        days: '9-15',
        description: 'Focus on building raw strength.',
        workouts: [
          {
            name: 'Day 9',
            exercises: [{ name: 'Pushups Throughout the Day', sets: 'Multiple', reps: '300 total' }]
          },
          // Additional days would be listed here
        ]
      },
      {
        name: 'Phase 3: Forge All-Day Endurance',
        days: '16-23',
        description: 'Develop your endurance capacity.',
        workouts: [
          {
            name: 'Day 16',
            exercises: [{ name: 'Lifeguard Test', sets: 2, reps: 'Swim 300 yards then tread water 2 minutes' }]
          },
          // Additional days would be listed here
        ]
      },
      {
        name: 'Phase 4: Expand Your Top End',
        days: '24-30',
        description: 'Push your limits and peak your fitness.',
        workouts: [
          {
            name: 'Day 24',
            exercises: [{ name: 'Jungle Gym Workout', sets: 1, reps: 'Pullup-Pushup ladder' }]
          },
          // Additional days would be listed here
        ]
      }
    ]
  },
];

type WorkoutProgramCardProps = {
  program: {
    id: string;
    name: string;
    category: string;
    description: string;
    duration: string;
    frequency: string;
    level: string;
  };
  onPress: (program: any) => void;
};

// Workout Program Card Component
const WorkoutProgramCard = ({ program, onPress }: WorkoutProgramCardProps) => {
  return (
    <TouchableOpacity style={styles.programCard} onPress={() => onPress(program)}>
      <View style={styles.programHeader}>
        <Text style={styles.programName}>{program.name}</Text>
        <View style={styles.programCategory}>
          <Text style={styles.programCategoryText}>{program.category}</Text>
        </View>
      </View>
      <Text style={styles.programDescription}>{program.description}</Text>
      <View style={styles.programMeta}>
        <View style={styles.programMetaItem}>
          <Ionicons name="time-outline" size={16} color="#7f8c8d" />
          <Text style={styles.programMetaText}>{program.duration}</Text>
        </View>
        <View style={styles.programMetaItem}>
          <Ionicons name="calendar-outline" size={16} color="#7f8c8d" />
          <Text style={styles.programMetaText}>{program.frequency}</Text>
        </View>
        <View style={styles.programMetaItem}>
          <Ionicons name="fitness-outline" size={16} color="#7f8c8d" />
          <Text style={styles.programMetaText}>{program.level}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Workout Start Modal Component
const WorkoutStartModal = ({ visible, workout, onClose, onStart }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Start Workout</Text>
          <Text style={styles.modalWorkoutName}>{workout?.name}</Text>
          
          <View style={styles.workoutInfoSection}>
            <Text style={styles.workoutInfoTitle}>What to expect:</Text>
            <Text style={styles.workoutInfoText}>
              {workout?.description ?? "Get ready for a challenging workout that will push your limits and help you achieve your fitness goals."}
            </Text>
          </View>
          
          <View style={styles.workoutInfoSection}>
            <Text style={styles.workoutInfoTitle}>Warm up first:</Text>
            <Text style={styles.workoutInfoText}>
              Start with 5 minutes of light cardio and dynamic stretching to prepare your body.
            </Text>
          </View>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButtonSecondary} onPress={onClose}>
              <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButtonPrimary} onPress={() => onStart(workout)}>
              <Text style={styles.modalButtonPrimaryText}>Start Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Workout Program Detail Screen
const WorkoutProgramDetailScreen = ({ route, navigation }) => {
  const { program } = route.params;
  const [startModalVisible, setStartModalVisible] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  
  const handleStartWorkout = (workout) => {
    // In a real app, this would navigate to a workout execution screen
    setStartModalVisible(false);
    console.log('Starting workout:', workout);
    navigation.navigate('WorkoutExecution', { workout });
  };
  
  const renderPhase = (phase, index) => {
    return (
      <View key={index} style={styles.phaseContainer}>
        <Text style={styles.phaseName}>{phase.name}</Text>
        {phase.days && <Text style={styles.phaseDays}>Days {phase.days}</Text>}
        {phase.weeks && <Text style={styles.phaseDays}>Weeks {phase.weeks}</Text>}
        <Text style={styles.phaseDescription}>{phase.description}</Text>
        
        {phase.workouts.map((workout, wIndex) => (
          <View key={wIndex} style={styles.workoutContainer}>
            <View style={styles.workoutHeader}>
              <Text style={styles.workoutName}>{workout.name}</Text>
              <TouchableOpacity
                style={styles.startWorkoutButton}
                onPress={() => {
                  setSelectedWorkout(workout);
                  setStartModalVisible(true);
                }}
              >
                <Text style={styles.startWorkoutButtonText}>Start</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.exercisesList}>
              {workout.exercises.map((exercise, eIndex) => (
                <View key={eIndex} style={styles.exerciseItem}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseDetails}>
                    {typeof exercise.sets === 'string' 
                      ? `${exercise.sets}: ${exercise.reps}` 
                      : `${exercise.sets} ${exercise.sets === 1 ? 'set' : 'sets'} of ${exercise.reps}`}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    );
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.programDetailHeader}>
        <Text style={styles.programDetailName}>{program.name}</Text>
        <Text style={styles.programDetailDescription}>{program.description}</Text>
        
        <View style={styles.programDetailMeta}>
          <View style={styles.programDetailMetaItem}>
            <Ionicons name="time-outline" size={18} color="#7f8c8d" />
            <Text style={styles.programDetailMetaLabel}>Duration:</Text>
            <Text style={styles.programDetailMetaText}>{program.duration}</Text>
          </View>
          <View style={styles.programDetailMetaItem}>
            <Ionicons name="calendar-outline" size={18} color="#7f8c8d" />
            <Text style={styles.programDetailMetaLabel}>Frequency:</Text>
            <Text style={styles.programDetailMetaText}>{program.frequency}</Text>
          </View>
          <View style={styles.programDetailMetaItem}>
            <Ionicons name="fitness-outline" size={18} color="#7f8c8d" />
            <Text style={styles.programDetailMetaLabel}>Level:</Text>
            <Text style={styles.programDetailMetaText}>{program.level}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.startProgramButton}
          onPress={() => {
            // In a real app, this would start the program
            console.log('Starting program:', program);
            if (program.phases && program.phases.length > 0 && 
              program.phases[0].workouts && program.phases[0].workouts.length > 0) {
            // Start with the first workout in the first phase
            const firstWorkout = program.phases[0].workouts[0];
            navigation.navigate('WorkoutExecution', { workout: firstWorkout });
          } else {
            // Handle case where program structure is not as expected
            Alert.alert(
              "Workout Not Available",
              "Sorry, this workout program is not available for execution yet."
            );
            }
          }}
        >
          <Text style={styles.startProgramButtonText}>Start Program</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.programContent}>
        <Text style={styles.programContentTitle}>Program Structure</Text>
        {program.phases.map(renderPhase)}
      </View>
      
      <WorkoutStartModal
        visible={startModalVisible}
        workout={selectedWorkout}
        onClose={() => setStartModalVisible(false)}
        onStart={handleStartWorkout}
      />
    </ScrollView>
  );
};

// Workout Main Screen
const WorkoutMainScreen = ({ navigation }) => {
  const programCategories = [
    { id: 'all', name: 'All Programs' },
    { id: 'featured', name: 'Featured' },
    { id: 'upper', name: 'Upper Body' },
    { id: 'lower', name: 'Lower Body' },
    { id: 'total', name: 'Total Body' },
    { id: 'short', name: 'Quick Workouts' },
  ];
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Filter programs based on selected category
  const filteredPrograms = workoutsData.filter(program => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'featured') return program.id === '4' || program.id === '2'; // Example featured programs
    if (selectedCategory === 'upper') return program.category.includes('Upper');
    if (selectedCategory === 'lower') return program.category.includes('Lower');
    if (selectedCategory === 'total') return program.category.includes('Total');
    if (selectedCategory === 'short') return program.duration.includes('minute');
    return true;
  });
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Workout Programs</Text>
        <Text style={styles.headerSubtitle}>Train anywhere with these body-weight programs</Text>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoryFilterContainer}
      >
        {programCategories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryFilterButton,
              selectedCategory === category.id && styles.categoryFilterButtonActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text
              style={[
                styles.categoryFilterText,
                selectedCategory === category.id && styles.categoryFilterTextActive
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <FlatList
        data={filteredPrograms}
        renderItem={({ item }) => (
          <WorkoutProgramCard
            program={item}
            onPress={(program) => navigation.navigate('WorkoutDetail', { program })}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.programList}
      />
    </View>
  );
};

// Create Stack Navigator for Workout
const Stack = createStackNavigator();

const WorkoutScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="WorkoutMain"
        component={WorkoutMainScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WorkoutDetail"
        component={WorkoutProgramDetailScreen}
        options={{ 
          title: 'Program Details',
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: '#3498db',
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="WorkoutExecution"
        component={WorkoutExecutionScreen}
        options={{
          title: 'Workout',
          headerShown: false, // Hide the header for the full-screen workout experience
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
  headerContainer: {
    padding: 16,
    backgroundColor: '#3498db',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  categoryFilterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  programList: {
    padding: 16,
  },
  programCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  programName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  programCategory: {
    backgroundColor: '#3498db',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  programCategoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  programDescription: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 12,
    lineHeight: 20,
  },
  programMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  programMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  programMetaText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  programDetailHeader: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  programDetailName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  programDetailDescription: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 22,
    marginBottom: 16,
  },
  programDetailMeta: {
    marginBottom: 16,
  },
  programDetailMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  programDetailMetaLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    marginLeft: 8,
    marginRight: 4,
  },
  programDetailMetaText: {
    fontSize: 14,
    color: '#34495e',
  },
  startProgramButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  startProgramButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  programContent: {
    padding: 16,
  },
  programContentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  phaseContainer: {
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  phaseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  phaseDays: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  phaseDescription: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 16,
    lineHeight: 20,
  },
  workoutContainer: {
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  startWorkoutButton: {
    backgroundColor: '#2ecc71',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  startWorkoutButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  exercisesList: {
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 12,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 14,
    color: '#34495e',
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  modalWorkoutName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 16,
  },
  workoutInfoSection: {
    marginBottom: 16,
  },
  workoutInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 6,
  },
  workoutInfoText: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButtonSecondary: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#95a5a6',
    marginRight: 8,
    alignItems: 'center',
  },
  modalButtonSecondaryText: {
    color: '#7f8c8d',
    fontSize: 16,
    fontWeight: '500',
  },
  modalButtonPrimary: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#3498db',
    marginLeft: 8,
    alignItems: 'center',
  },
  modalButtonPrimaryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  } // Remove the comma here if it exists
});


export default WorkoutScreen;