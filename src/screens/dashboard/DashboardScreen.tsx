// src/screens/dashboard/DashboardScreen.tsx
import React, {useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';

// Import data Context
import { useData } from '../../store/DataContext';

// Define types
type RootStackParamList = {
  Dashboard: undefined;
  Exercises: undefined;
  Workouts: undefined;
  Nutrition: undefined;
  Profile: undefined;
};

type DashboardScreenProps = {
  navigation: NavigationProp<RootStackParamList>;
};

// Mock data for the dashboard
const userProgress = {
  streak: 5,
  workoutsCompleted: 23,
  nextWorkout: 'Powered-Up Pushups: Week 3, Day 1',
  nutritionScore: 85,
};

// Motivational quotes from the book
const motivationalQuotes = [
  "Strong muscles don't just look good, they help you tackle whatever life throws at you.",
  "The best thing about training with minimal equipment? You're never stuck in a dreary windowless gym.",
  "You don't have to lift weights to lose weight and build muscle.",
  "With your body as your resistance tool, you'll open yourself up to the free gym that's everywhere.",
  "When it comes to strength training, less can be more."
];

// Workout suggestion mapping
type WorkoutTypeMap = {
  'Upper Body': string;
  'Lower Body': string;
  'Core': string;
  'Total Body': string;
};

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  // Get data from context
  const { 
    userProfile, 
    workoutHistory,
    workoutStats,
    isLoading,
    refreshAllData
  } = useData();
  
  // State for next workout
  const [nextWorkout, setNextWorkout] = useState<string | null>(null);
 
  // Select a random quote
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  
  // Load next workout based on history
  useEffect(() => {
    if (workoutHistory && workoutHistory.length > 0) {
      // In a real app, we would use an algorithm to determine the next workout
      // For now, just suggest a different type than the last workout
      const lastWorkoutType = workoutHistory[0]?.type || 'Total Body';
      
      const workoutSuggestions: WorkoutTypeMap = {
        'Upper Body': 'Powered-Up Pushups: Week 3, Day 1',
        'Lower Body': 'Summer Body Challenge: Day 15',
        'Core': 'Shredded in 30: Session 4',
        'Total Body': 'The Body-Weight Burner'
      };
      
      // Suggest a different workout type than the last one
      let suggestedType: keyof WorkoutTypeMap = 'Total Body';
      
      if (lastWorkoutType === 'Upper Body') {
        suggestedType = 'Lower Body';
      } else if (lastWorkoutType === 'Lower Body') {
        suggestedType = 'Core';
      } else if (lastWorkoutType === 'Core') {
        suggestedType = 'Total Body';
      } else {
        suggestedType = 'Upper Body';
      }
      
      setNextWorkout(workoutSuggestions[suggestedType]);
    } else {
      // Default for new users
      setNextWorkout('The Body-Weight Burner: Introduction');
    }
  }, [workoutHistory]);
  
  // Pull to refresh
  const handleRefresh = async (): Promise<void> => {
    await refreshAllData();
  };
  
  // Format date
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Helper function to get color based on workout type
  const getWorkoutTypeColor = (type: string): string => {
    switch (type) {
      case 'Upper Body':
        return '#3498db';
      case 'Lower Body':
        return '#2ecc71';
      case 'Core':
        return '#f39c12';
      case 'Total Body':
        return '#9b59b6';
      default:
        return '#95a5a6';
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={isLoading ? styles.loadingContainer : undefined}
    >
      {isLoading ? (
        <ActivityIndicator size="large" color="#3498db" />
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.greeting}>
              Hello, {userProfile?.name ?? 'Fitness Warrior'}!
            </Text>
            <Text style={styles.date}>{formatDate(new Date().toISOString())}</Text>
          </View>
          
          {/* Motivational Quote */}
          <View style={styles.quoteContainer}>
            <Text style={styles.quote}>"{randomQuote}"</Text>
            <Text style={styles.quoteSource}>- Men's Health: No Gym Required</Text>
          </View>
          
          {/* Streak and Progress */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="flame" size={24} color="#e74c3c" />
              <Text style={styles.statNumber}>{workoutStats?.streak ?? 0}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="checkmark-circle" size={24} color="#2ecc71" />
              <Text style={styles.statNumber}>{workoutStats?.totalWorkouts ?? 0}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time" size={24} color="#f39c12" />
              <Text style={styles.statNumber}>{workoutStats?.totalDuration ?? 0}</Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </View>
          </View>
          
          {/* Next Workout */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Next Workout</Text>
            <TouchableOpacity 
              style={styles.workoutCard}
              onPress={() => navigation.navigate('Workouts')}
            >
              <View style={styles.workoutCardContent}>
                <Ionicons name="barbell-outline" size={32} color="#3498db" />
                <View style={styles.workoutCardText}>
                  <Text style={styles.workoutCardTitle}>{nextWorkout}</Text>
                  <Text style={styles.workoutCardSubtitle}>30 minutes • Intermediate</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#95a5a6" />
              </View>
            </TouchableOpacity>
          </View>
          
          {/* Recent Activity */}
          {workoutHistory && workoutHistory.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              {workoutHistory.slice(0, 3).map((workout, index) => (
                <View key={`workout-${index}`} style={styles.activityItem}>
                  <View style={[styles.activityTypeIndicator, { backgroundColor: getWorkoutTypeColor(workout.type) }]} />
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{workout.name}</Text>
                    <Text style={styles.activitySubtitle}>
                      {workout.duration} minutes • {formatDate(workout.timestamp)}
                    </Text>
                  </View>
                  <Text style={styles.activityStatus}>Completed</Text>
                </View>
              ))}
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => navigation.navigate('Profile')}
              >
                <Text style={styles.viewAllButtonText}>View All Activity</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {/* Quick Actions */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsContainer}>
              <TouchableOpacity 
                style={styles.quickActionButton}
                onPress={() => navigation.navigate('Exercises')}
              >
                <Ionicons name="search" size={24} color="#3498db" />
                <Text style={styles.quickActionButtonText}>Find Exercise</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.quickActionButton}
                onPress={() => navigation.navigate('Workouts')}
              >
                <Ionicons name="play" size={24} color="#3498db" />
                <Text style={styles.quickActionButtonText}>Start Workout</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.quickActionButton}
                onPress={() => navigation.navigate('Nutrition')}
              >
                <Ionicons name="restaurant" size={24} color="#3498db" />
                <Text style={styles.quickActionButtonText}>Log Meal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.quickActionButton}
                onPress={() => navigation.navigate('Profile')}
              >
                <Ionicons name="trending-up" size={24} color="#3498db" />
                <Text style={styles.quickActionButtonText}>View Progress</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Featured Program */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Featured Program</Text>
            <TouchableOpacity 
              style={styles.featuredProgramCard}
              onPress={() => navigation.navigate('Workouts')}
            >
              <View style={styles.featuredProgramBanner}>
                <Text style={styles.featuredProgramBannerText}>Summer Body Challenge</Text>
              </View>
              <View style={styles.featuredProgramContent}>
                <Text style={styles.featuredProgramDescription}>
                  30 days of progressive body-weight workouts to transform your physique.
                </Text>
                <View style={styles.featuredProgramStats}>
                  <Text style={styles.featuredProgramStat}>30 days</Text>
                  <Text style={styles.featuredProgramStat}>15-60 min/day</Text>
                  <Text style={styles.featuredProgramStat}>All levels</Text>
                </View>
                <TouchableOpacity style={styles.startButton}>
                  <Text style={styles.startButtonText}>Start Program</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#3498db',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  date: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  quoteContainer: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#2c3e50',
    lineHeight: 24,
  },
  quoteSource: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 8,
    textAlign: 'right',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    margin: 16,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  sectionContainer: {
    marginTop: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  workoutCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  workoutCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutCardText: {
    flex: 1,
    marginLeft: 16,
  },
  workoutCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  workoutCardSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityTypeIndicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  activityStatus: {
    fontSize: 12,
    color: '#2ecc71',
    fontWeight: 'bold',
  },
  viewAllButton: {
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
    marginTop: 8,
  },
  viewAllButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7f8c8d',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    backgroundColor: 'white',
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    marginTop: 8,
  },
  featuredProgramCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featuredProgramBanner: {
    backgroundColor: '#3498db',
    padding: 12,
  },
  featuredProgramBannerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  featuredProgramContent: {
    padding: 16,
  },
  featuredProgramDescription: {
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 24,
  },
  featuredProgramStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  featuredProgramStat: {
    backgroundColor: '#ecf0f1',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    fontSize: 12,
    color: '#7f8c8d',
  },
  startButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default DashboardScreen;