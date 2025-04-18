// src/screens/workouts/WorkoutExecutionScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Modal,
  Image,
  Alert,
  BackHandler
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

// Mock exercise data (in a real app this would come from a database)
const exerciseData = {
  'Pushup': {
    description: 'The standard pushup works your chest, shoulders, and triceps.',
    instructions: 'Start in a plank position with your hands slightly wider than shoulder-width apart. Lower your body until your chest nearly touches the floor. Keep your elbows close to your body as you push back up to the starting position.',
    image: null, // This would be an actual image in a real app
    tips: [
      'Keep your core tight throughout the movement',
      'Don\'t let your hips sag',
      'Breathe out as you push up'
    ]
  },
  'Body-weight Squat': {
    description: 'The bodyweight squat is a fundamental lower body exercise that targets your quads, hamstrings, and glutes.',
    instructions: 'Stand with your feet shoulder-width apart. Push your hips back and bend your knees to lower your body as far as you can. Keep your chest up and your weight on your heels. Push through your heels to return to the starting position.',
    image: null,
    tips: [
      'Keep your knees in line with your toes',
      'Go as low as your mobility allows',
      'Keep your chest up throughout the movement'
    ]
  },
  'Plank': {
    description: 'The plank is one of the best exercises for core conditioning.',
    instructions: 'Get into a pushup position, but with your weight on your forearms instead of your hands. Your elbows should be directly beneath your shoulders. Keep your body in a straight line from head to heels. Hold this position.',
    image: null,
    tips: [
      'Engage your core by pulling your belly button in toward your spine',
      'Don\'t let your hips rise or sag',
      'Keep breathing throughout the hold'
    ]
  },
};

const WorkoutExecutionScreen = ({ route, navigation }) => {
  // Get workout data from navigation params
  const { workout } = route.params;
  
  // State variables
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [showExerciseDetails, setShowExerciseDetails] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [workoutLog, setWorkoutLog] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  
  // Refs
  const timerRef = useRef(null);
  const restTimerRef = useRef(null);
  
  // Get current exercise
  const currentExercise = workout?.exercises?.[currentExerciseIndex];
  const exerciseInfo = currentExercise ? exerciseData[currentExercise.name] || {} : {};
  
  // Calculate total exercises and sets
  const totalExercises = workout?.exercises?.length || 0;
  const totalSets = typeof currentExercise?.sets === 'number' ? currentExercise.sets : 1;
  
  // Calculate progress percentage
  const overallProgress = totalExercises > 0 ? 
    ((currentExerciseIndex / totalExercises) * 100) + 
    ((currentSetIndex / totalSets) * (100 / totalExercises)) : 0;
  
  // Start workout timer when screen loads
  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (!isPaused) {
        setTimer(prevTimer => prevTimer + 1);
      }
    }, 1000);
    
    return () => {
      clearInterval(timerRef.current);
      if (restTimerRef.current) {
        clearInterval(restTimerRef.current);
      }
    };
  }, [isPaused]);
  
  // Prevent accidental back button press
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Exit Workout',
          'Are you sure you want to exit? Your progress will be lost.',
          [
            { text: 'Cancel', style: 'cancel', onPress: () => {} },
            { text: 'Exit', style: 'destructive', onPress: () => navigation.goBack() }
          ]
        );
        return true;
      };
      
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );
  
  // Format time (seconds to MM:SS)
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Handle rest timer
  const startRest = (duration = 60) => {
    setIsResting(true);
    setRestTimer(duration);
    
    restTimerRef.current = setInterval(() => {
      setRestTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(restTimerRef.current);
          setIsResting(false);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };
  
  // Handle completing a set
  const completeSet = (reps) => {
    // Log the completed set
    setWorkoutLog(prev => [
      ...prev,
      {
        exerciseName: currentExercise.name,
        setNumber: currentSetIndex + 1,
        reps: reps,
        timestamp: new Date().toISOString()
      }
    ]);
    
    // Move to next set or exercise
    if (currentSetIndex < totalSets - 1) {
      setCurrentSetIndex(currentSetIndex + 1);
      startRest();
    } else {
      // Move to next exercise
      if (currentExerciseIndex < totalExercises - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setCurrentSetIndex(0);
        startRest(90); // Longer rest between exercises
      } else {
        // Workout complete
        clearInterval(timerRef.current);
        if (restTimerRef.current) {
          clearInterval(restTimerRef.current);
        }
        setShowFinishModal(true);
      }
    }
  };
  
  // Skip current exercise
  const skipExercise = () => {
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSetIndex(0);
    } else {
      // Last exercise, show finish modal
      setShowFinishModal(true);
    }
  };
  
  // Pause/resume workout
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  
  // Finish workout
  const finishWorkout = () => {
    // Here you would typically save the workout data to storage
    // For now, we'll just log it and navigate back
    console.log('Workout completed:', {
      workout: workout.name,
      duration: timer,
      exercises: workoutLog
    });
    
    navigation.goBack();
  };
  
  return (
    <View style={styles.container}>
      {/* Workout Progress Header */}
      <View style={styles.progressHeader}>
        <View style={styles.progressInfo}>
          <Text style={styles.workoutName}>{workout?.name}</Text>
          <Text style={styles.timer}>{formatTime(timer)}</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar,
              { width: `${overallProgress}%` }
            ]}
          />
        </View>
        <View style={styles.progressStats}>
          <Text style={styles.progressText}>
            Exercise {currentExerciseIndex + 1}/{totalExercises}
          </Text>
          <Text style={styles.progressText}>
            Set {currentSetIndex + 1}/{totalSets}
          </Text>
        </View>
      </View>
      
      {/* Main Workout Area */}
      <ScrollView style={styles.workoutArea}>
        {isResting ? (
          // Rest Timer View
          <View style={styles.restContainer}>
            <Text style={styles.restTitle}>Rest Time</Text>
            <Text style={styles.restTimer}>{formatTime(restTimer)}</Text>
            <Text style={styles.restSubtitle}>
              Next: {currentSetIndex < totalSets - 1 ? 
                `${currentExercise.name} - Set ${currentSetIndex + 2}` : 
                currentExerciseIndex < totalExercises - 1 ? 
                workout.exercises[currentExerciseIndex + 1].name : 
                'Workout Complete'
              }
            </Text>
            <TouchableOpacity 
              style={styles.skipButton}
              onPress={() => {
                clearInterval(restTimerRef.current);
                setIsResting(false);
              }}
            >
              <Text style={styles.skipButtonText}>Skip Rest</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Exercise View
          <View style={styles.exerciseContainer}>
            <View style={styles.exerciseHeader}>
              <View>
                <Text style={styles.exerciseName}>{currentExercise?.name}</Text>
                <Text style={styles.exerciseTarget}>
                  {currentExercise?.sets && currentExercise?.reps ? 
                    `${typeof currentExercise.sets === 'number' ? 
                      `Set ${currentSetIndex + 1}/${currentExercise.sets}` : 
                      currentExercise.sets
                    } - ${currentExercise.reps} reps` : 
                    'Complete as many reps as possible'
                  }
                </Text>
              </View>
              <TouchableOpacity
                style={styles.infoButton}
                onPress={() => setShowExerciseDetails(true)}
              >
                <Ionicons name="information-circle-outline" size={24} color="#3498db" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.exerciseImageContainer}>
              {exerciseInfo.image ? (
                <Image source={exerciseInfo.image} style={styles.exerciseImage} />
              ) : (
                <View style={styles.exercisePlaceholder}>
                  <Ionicons name="fitness-outline" size={80} color="#bdc3c7" />
                </View>
              )}
            </View>
            
            <View style={styles.repButtons}>
              <Text style={styles.repPrompt}>How many reps did you complete?</Text>
              <View style={styles.repButtonsRow}>
                {[5, 10, 15, 20].map(reps => (
                  <TouchableOpacity
                    key={reps}
                    style={styles.repButton}
                    onPress={() => completeSet(reps)}
                  >
                    <Text style={styles.repButtonText}>{reps}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={styles.customRepButton}
                onPress={() => {
                  // In a real app, show an input modal
                  completeSet(12); // Mocked for now
                }}
              >
                <Text style={styles.customRepButtonText}>Custom</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.skipActionButton]}
                onPress={skipExercise}
              >
                <Ionicons name="play-skip-forward" size={20} color="#e74c3c" />
                <Text style={styles.skipActionButtonText}>Skip</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, isPaused ? styles.resumeActionButton : styles.pauseActionButton]}
                onPress={togglePause}
              >
                <Ionicons name={isPaused ? "play" : "pause"} size={20} color="white" />
                <Text style={styles.actionButtonText}>{isPaused ? "Resume" : "Pause"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
      
      {/* Exercise Details Modal */}
      <Modal
        visible={showExerciseDetails}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{currentExercise?.name}</Text>
            
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Description</Text>
              <Text style={styles.modalText}>{exerciseInfo.description}</Text>
            </View>
            
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Instructions</Text>
              <Text style={styles.modalText}>{exerciseInfo.instructions}</Text>
            </View>
            
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Tips</Text>
              {exerciseInfo.tips?.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <View style={styles.tipDot} />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
            
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setShowExerciseDetails(false)}
            >
              <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Workout Finish Modal */}
      <Modal
        visible={showFinishModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.finishModalTitle}>Workout Complete!</Text>
            
            <View style={styles.workoutSummary}>
              <View style={styles.summaryItem}>
                <Ionicons name="time-outline" size={24} color="#3498db" />
                <View>
                  <Text style={styles.summaryLabel}>Duration</Text>
                  <Text style={styles.summaryValue}>{formatTime(timer)}</Text>
                </View>
              </View>
              <View style={styles.summaryItem}>
                <Ionicons name="barbell-outline" size={24} color="#3498db" />
                <View>
                  <Text style={styles.summaryLabel}>Exercises</Text>
                  <Text style={styles.summaryValue}>{totalExercises}</Text>
                </View>
              </View>
              <View style={styles.summaryItem}>
                <Ionicons name="checkmark-done-outline" size={24} color="#3498db" />
                <View>
                  <Text style={styles.summaryLabel}>Sets Completed</Text>
                  <Text style={styles.summaryValue}>{workoutLog.length}</Text>
                </View>
              </View>
            </View>
            
            <Text style={styles.congratsText}>
              Great job! You've completed the {workout.name} workout.
            </Text>
            
            <TouchableOpacity
              style={styles.finishButton}
              onPress={finishWorkout}
            >
              <Text style={styles.finishButtonText}>Save & Finish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  progressHeader: {
    backgroundColor: '#3498db',
    padding: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  timer: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'white',
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 14,
    color: 'white',
  },
  workoutArea: {
    flex: 1,
  },
  restContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 32,
  },
  restTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  restTimer: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 24,
  },
  restSubtitle: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 32,
    textAlign: 'center',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#95a5a6',
    borderRadius: 8,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  exerciseContainer: {
    padding: 16,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  exerciseTarget: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 4,
  },
  infoButton: {
    padding: 8,
  },
  exerciseImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  exerciseImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  exercisePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  repButtons: {
    marginBottom: 24,
  },
  repPrompt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
    textAlign: 'center',
  },
  repButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  repButton: {
    flex: 1,
    backgroundColor: '#3498db',
    paddingVertical: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  repButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  customRepButton: {
    backgroundColor: '#2c3e50',
    paddingVertical: 16,
    borderRadius: 8,
  },
  customRepButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  skipActionButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  pauseActionButton: {
    backgroundColor: '#f39c12',
  },
  resumeActionButton: {
    backgroundColor: '#2ecc71',
  },
  skipActionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#e74c3c',
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  modalSection: {
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 22,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3498db',
    marginTop: 6,
    marginRight: 8,
  },
  tipText: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 22,
    flex: 1,
  },
  closeModalButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  closeModalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  finishModalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 24,
    textAlign: 'center',
  },
  workoutSummary: {
    marginBottom: 24,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#7f8c8d',
    marginLeft: 16,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 16,
  },
  congratsText: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  finishButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  finishButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default WorkoutExecutionScreen;