// src/screens/profile/ProgressTrackingScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';

// Mock data for workout history (in a real app, this would come from storage)
const workoutHistoryData = {
  last30Days: [
    { date: '2023-04-01', duration: 35, type: 'Upper Body' },
    { date: '2023-04-03', duration: 40, type: 'Total Body' },
    { date: '2023-04-05', duration: 25, type: 'Core' },
    { date: '2023-04-08', duration: 45, type: 'Lower Body' },
    { date: '2023-04-11', duration: 30, type: 'Upper Body' },
    { date: '2023-04-13', duration: 35, type: 'Total Body' },
    { date: '2023-04-15', duration: 25, type: 'Core' },
    { date: '2023-04-18', duration: 50, type: 'Lower Body' },
    { date: '2023-04-21', duration: 35, type: 'Upper Body' },
    { date: '2023-04-24', duration: 40, type: 'Total Body' },
    { date: '2023-04-26', duration: 30, type: 'Core' },
    { date: '2023-04-29', duration: 45, type: 'Lower Body' },
  ]
};

// Mock data for exercise progression
const exerciseProgressionData = {
  'Pushup': [
    { date: '2023-03-15', maxReps: 15 },
    { date: '2023-03-22', maxReps: 18 },
    { date: '2023-03-29', maxReps: 20 },
    { date: '2023-04-05', maxReps: 22 },
    { date: '2023-04-12', maxReps: 25 },
    { date: '2023-04-19', maxReps: 28 },
    { date: '2023-04-26', maxReps: 30 },
  ],
  'Pullup': [
    { date: '2023-03-15', maxReps: 3 },
    { date: '2023-03-22', maxReps: 4 },
    { date: '2023-03-29', maxReps: 5 },
    { date: '2023-04-05', maxReps: 6 },
    { date: '2023-04-12', maxReps: 7 },
    { date: '2023-04-19', maxReps: 8 },
    { date: '2023-04-26', maxReps: 9 },
  ],
  'Body-weight Squat': [
    { date: '2023-03-15', maxReps: 20 },
    { date: '2023-03-22', maxReps: 25 },
    { date: '2023-03-29', maxReps: 30 },
    { date: '2023-04-05', maxReps: 35 },
    { date: '2023-04-12', maxReps: 40 },
    { date: '2023-04-19', maxReps: 45 },
    { date: '2023-04-26', maxReps: 50 },
  ],
  'Plank': [
    { date: '2023-03-15', maxReps: 30 }, // seconds
    { date: '2023-03-22', maxReps: 45 },
    { date: '2023-03-29', maxReps: 60 },
    { date: '2023-04-05', maxReps: 75 },
    { date: '2023-04-12', maxReps: 90 },
    { date: '2023-04-19', maxReps: 105 },
    { date: '2023-04-26', maxReps: 120 },
  ],
};

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Helper function to calculate workout streaks
const calculateStreak = (history) => {
  // Sort workouts by date
  const sortedWorkouts = [...history].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Calculate current streak
  let currentStreak = 0;
  let previousDate = null;
  
  for (let i = 0; i < sortedWorkouts.length; i++) {
    const workoutDate = new Date(sortedWorkouts[i].date);
    
    if (!previousDate) {
      currentStreak = 1;
      previousDate = workoutDate;
      continue;
    }
    
    const dayDifference = (previousDate.getTime() - workoutDate.getTime()) / (1000 * 3600 * 24);
    
    if (dayDifference <= 3) { // Consider a streak if workouts are within 3 days
      currentStreak++;
      previousDate = workoutDate;
    } else {
      break;
    }
  }
  
  return currentStreak;
};

// TimeframeSelector Component
const TimeframeSelector = ({ selectedTimeframe, onSelectTimeframe }) => {
  const timeframes = ['Week', 'Month', 'Year', 'All Time'];
  
  return (
    <View style={styles.timeframeContainer}>
      {timeframes.map((timeframe) => (
        <TouchableOpacity
          key={timeframe}
          style={[
            styles.timeframeButton,
            selectedTimeframe === timeframe && styles.timeframeButtonActive
          ]}
          onPress={() => onSelectTimeframe(timeframe)}
        >
          <Text
            style={[
              styles.timeframeButtonText,
              selectedTimeframe === timeframe && styles.timeframeButtonTextActive
            ]}
          >
            {timeframe}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// ProgressTrackingScreen Component
const ProgressTrackingScreen = ({ navigation }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('Month');
  const [selectedExercise, setSelectedExercise] = useState('Pushup');
  const [loading, setLoading] = useState(true);
  const [workoutStats, setWorkoutStats] = useState({
    totalWorkouts: 0,
    totalMinutes: 0,
    avgDuration: 0,
    currentStreak: 0,
  });
  
  // Screen width for charts
  const screenWidth = Dimensions.get('window').width - 32; // account for margins
  
  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };
  
  // Load workout stats when component mounts or timeframe changes
  useEffect(() => {
    // Simulate data loading
    setLoading(true);
    setTimeout(() => {
      calculateWorkoutStats();
      setLoading(false);
    }, 500);
  }, [selectedTimeframe]);
  
  // Calculate workout statistics
  const calculateWorkoutStats = () => {
    const workouts = workoutHistoryData.last30Days;
    
    const totalWorkouts = workouts.length;
    const totalMinutes = workouts.reduce((sum, workout) => sum + workout.duration, 0);
    const avgDuration = totalWorkouts > 0 ? Math.round(totalMinutes / totalWorkouts) : 0;
    const currentStreak = calculateStreak(workouts);
    
    setWorkoutStats({
      totalWorkouts,
      totalMinutes,
      avgDuration,
      currentStreak,
    });
  };
  
  // Prepare workout frequency data for chart
  const prepareWorkoutFrequencyData = () => {
    const workouts = workoutHistoryData.last30Days;
    
    // Get last 7 workouts for week view
    const filteredWorkouts = selectedTimeframe === 'Week' 
      ? workouts.slice(Math.max(0, workouts.length - 7)) 
      : workouts;
    
    return {
      labels: filteredWorkouts.map(workout => formatDate(workout.date)),
      datasets: [
        {
          data: filteredWorkouts.map(workout => workout.duration),
          color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
          strokeWidth: 2,
        }
      ],
    };
  };
  
  // Prepare exercise progression data for chart
  const prepareExerciseProgressionData = () => {
    const progressData = exerciseProgressionData[selectedExercise] || [];
    
    // Filter data based on selected timeframe
    let filteredData = [...progressData];
    if (selectedTimeframe === 'Week') {
      filteredData = progressData.slice(Math.max(0, progressData.length - 4));
    } else if (selectedTimeframe === 'Month') {
      filteredData = progressData.slice(Math.max(0, progressData.length - 8));
    }
    
    return {
      labels: filteredData.map(entry => formatDate(entry.date)),
      datasets: [
        {
          data: filteredData.map(entry => entry.maxReps),
          color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
          strokeWidth: 2,
        }
      ],
    };
  };
  
  // Prepare workout type distribution data for chart
  const prepareWorkoutTypeData = () => {
    const workouts = workoutHistoryData.last30Days;
    
    // Count workouts by type
    const workoutCounts = workouts.reduce((counts, workout) => {
      counts[workout.type] = (counts[workout.type] || 0) + 1;
      return counts;
    }, {});
    
    // Convert to array for chart
    const workoutTypes = Object.keys(workoutCounts);
    
    return {
      labels: workoutTypes,
      datasets: [
        {
          data: workoutTypes.map(type => workoutCounts[type]),
        }
      ],
    };
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Progress Tracking</Text>
        <Text style={styles.headerSubtitle}>Monitor your fitness journey</Text>
      </View>
      
      <TimeframeSelector 
        selectedTimeframe={selectedTimeframe}
        onSelectTimeframe={setSelectedTimeframe}
      />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Loading your progress data...</Text>
        </View>
      ) : (
        <>
          {/* Workout Stats Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="calendar" size={24} color="#3498db" />
              <Text style={styles.statValue}>{workoutStats.totalWorkouts}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="time" size={24} color="#3498db" />
              <Text style={styles.statValue}>{workoutStats.totalMinutes}</Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="flame" size={24} color="#3498db" />
              <Text style={styles.statValue}>{workoutStats.currentStreak}</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="stopwatch" size={24} color="#3498db" />
              <Text style={styles.statValue}>{workoutStats.avgDuration}</Text>
              <Text style={styles.statLabel}>Avg. Mins</Text>
            </View>
          </View>
          
          {/* Workout Frequency Chart */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Workout Duration</Text>
            <LineChart
              data={prepareWorkoutFrequencyData()}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
          
          {/* Exercise Progression Chart */}
          <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Exercise Progression</Text>
              <View style={styles.exerciseSelector}>
                {Object.keys(exerciseProgressionData).map((exercise) => (
                  <TouchableOpacity
                    key={exercise}
                    style={[
                      styles.exerciseButton,
                      selectedExercise === exercise && styles.exerciseButtonActive
                    ]}
                    onPress={() => setSelectedExercise(exercise)}
                  >
                    <Text
                      style={[
                        styles.exerciseButtonText,
                        selectedExercise === exercise && styles.exerciseButtonTextActive
                      ]}
                    >
                      {exercise}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <LineChart
              data={prepareExerciseProgressionData()}
              width={screenWidth}
              height={220}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
              }}
              bezier
              style={styles.chart}
            />
            <Text style={styles.chartNote}>
              {selectedExercise === 'Plank' ? 'Duration in seconds' : 'Maximum reps in a single set'}
            </Text>
          </View>
          
          {/* Workout Type Distribution */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Workout Type Distribution</Text>
            <BarChart
              data={prepareWorkoutTypeData()}
              width={screenWidth}
              height={220}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(155, 89, 182, ${opacity})`,
              }}
              style={styles.chart}
              verticalLabelRotation={30}
            />
          </View>
          
          {/* Insights Section */}
          <View style={styles.insightsContainer}>
            <Text style={styles.insightsTitle}>Your Insights</Text>
            <View style={styles.insightCard}>
              <Ionicons name="trending-up" size={24} color="#2ecc71" />
              <View style={styles.insightContent}>
                <Text style={styles.insightText}>
                  Your {selectedExercise} strength has increased by{' '}
                  <Text style={styles.insightHighlight}>
                    {Math.round(((exerciseProgressionData[selectedExercise][exerciseProgressionData[selectedExercise].length - 1].maxReps / 
                      exerciseProgressionData[selectedExercise][0].maxReps) - 1) * 100)}%
                  </Text>{' '}
                  in the last month!
                </Text>
              </View>
            </View>
            <View style={styles.insightCard}>
              <Ionicons name="trophy" size={24} color="#f39c12" />
              <View style={styles.insightContent}>
                <Text style={styles.insightText}>
                  You're most consistent with{' '}
                  <Text style={styles.insightHighlight}>
                    {Object.entries(prepareWorkoutTypeData().datasets[0].data.reduce((acc, count, i) => {
                      acc[prepareWorkoutTypeData().labels[i]] = count;
                      return acc;
                    }, {})).sort((a, b) => b[1] - a[1])[0][0]}
                  </Text>{' '}
                  workouts. Great job!
                </Text>
              </View>
            </View>
            <View style={styles.insightCard}>
              <Ionicons name="calendar" size={24} color="#3498db" />
              <View style={styles.insightContent}>
                <Text style={styles.insightText}>
                  Your most productive day is{' '}
                  <Text style={styles.insightHighlight}>Wednesday</Text>{' '}
                  with an average workout duration of 42 minutes.
                </Text>
              </View>
            </View>
          </View>
          
          {/* Export Data Button */}
          <TouchableOpacity style={styles.exportButton}>
            <Ionicons name="download" size={20} color="white" />
            <Text style={styles.exportButtonText}>Export Progress Data</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    backgroundColor: '#3498db',
    padding: 20,
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
  timeframeContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  timeframeButtonActive: {
    backgroundColor: '#3498db',
  },
  timeframeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7f8c8d',
  },
  timeframeButtonTextActive: {
    color: 'white',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  chartContainer: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartHeader: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  chart: {
    borderRadius: 8,
    marginVertical: 8,
  },
  chartNote: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  exerciseSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  exerciseButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ecf0f1',
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  exerciseButtonActive: {
    backgroundColor: '#2ecc71',
  },
  exerciseButtonText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  exerciseButtonTextActive: {
    color: 'white',
    fontWeight: '500',
  },
  insightsContainer: {
    margin: 16,
    marginTop: 0,
    marginBottom: 24,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  insightContent: {
    marginLeft: 16,
    flex: 1,
  },
  insightText: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 20,
  },
  insightHighlight: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  exportButton: {
    flexDirection: 'row',
    backgroundColor: '#3498db',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
});

export default ProgressTrackingScreen;