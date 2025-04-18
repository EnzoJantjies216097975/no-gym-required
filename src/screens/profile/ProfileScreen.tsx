// src/screens/profile/ProfileScreen.tsx
import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Switch,
  TextInput,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import ProgressTrackingScreen from './ProgressTrackingScreen';
import { useNavigation } from '@react-navigation/native';

// Mock user data
const userData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  joinDate: 'April 2023',
  profileImage: null, // In a real app, this would be an image URL
  stats: {
    workoutsCompleted: 47,
    streak: 8,
    longestStreak: 14,
    totalWorkoutMinutes: 1250,
  },
  measurements: {
    weight: {
      current: 180,
      unit: 'lbs',
      history: [
        { date: '2023-01-01', value: 195 },
        { date: '2023-02-01', value: 190 },
        { date: '2023-03-01', value: 185 },
        { date: '2023-04-01', value: 180 },
      ]
    },
    bodyFat: {
      current: 18,
      unit: '%',
      history: [
        { date: '2023-01-01', value: 22 },
        { date: '2023-02-01', value: 20 },
        { date: '2023-03-01', value: 19 },
        { date: '2023-04-01', value: 18 },
      ]
    },
    chestCircumference: {
      current: 42,
      unit: 'inches',
      history: [
        { date: '2023-01-01', value: 40 },
        { date: '2023-02-01', value: 41 },
        { date: '2023-03-01', value: 41.5 },
        { date: '2023-04-01', value: 42 },
      ]
    },
    waistCircumference: {
      current: 34,
      unit: 'inches',
      history: [
        { date: '2023-01-01', value: 38 },
        { date: '2023-02-01', value: 36 },
        { date: '2023-03-01', value: 35 },
        { date: '2023-04-01', value: 34 },
      ]
    },
  },
  goals: {
    workoutsPerWeek: 4,
    targetWeight: 175,
    targetBodyFat: 15,
  },
  preferences: {
    darkMode: false,
    notifications: true,
    workoutReminders: true,
    mealReminders: false,
    units: 'imperial', // 'metric' or 'imperial'
  }
};

// Stat Card Component
const StatCard = ({ icon, value, label }) => {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={24} color="#3498db" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
};

// Measurement Card Component
const MeasurementCard = ({ title, current, unit, trend, onPress }) => {
  // Calculate trend icon and color
  const trendIcon = trend > 0 ? 'arrow-up' : trend < 0 ? 'arrow-down' : 'remove';
  const trendColor = trend > 0 ? 
    (title === 'Weight' || title === 'Body Fat' || title === 'Waist' ? '#e74c3c' : '#2ecc71') : 
    trend < 0 ? 
    (title === 'Weight' || title === 'Body Fat' || title === 'Waist' ? '#2ecc71' : '#e74c3c') : 
    '#7f8c8d';
  
  return (
    <TouchableOpacity style={styles.measurementCard} onPress={onPress}>
      <View style={styles.measurementHeader}>
        <Text style={styles.measurementTitle}>{title}</Text>
        <View style={styles.trendContainer}>
          <Ionicons name={trendIcon} size={14} color={trendColor} />
          <Text style={[styles.trendText, { color: trendColor }]}>
            {Math.abs(trend).toFixed(1)} {unit}
          </Text>
        </View>
      </View>
      <Text style={styles.measurementValue}>
        {current} <Text style={styles.measurementUnit}>{unit}</Text>
      </Text>
    </TouchableOpacity>
  );
};

// Preference Item Component
const PreferenceItem = ({ icon, label, description, value, onToggle }) => {
  return (
    <View style={styles.preferenceItem}>
      <View style={styles.preferenceIcon}>
        <Ionicons name={icon} size={24} color="#3498db" />
      </View>
      <View style={styles.preferenceInfo}>
        <Text style={styles.preferenceLabel}>{label}</Text>
        {description ? <Text style={styles.preferenceDescription}>{description}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#bdc3c7', true: '#2ecc71' }}
        thumbColor={value ? '#27ae60' : '#ecf0f1'}
      />
    </View>
  );
};

// Add Measurement Modal Component
const AddMeasurementModal = ({ visible, measurement, onClose, onSave }) => {
  const [value, setValue] = useState(measurement?.current?.toString() || '');
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Update {measurement?.title}</Text>
          
          <Text style={styles.modalInputLabel}>Current Value:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={setValue}
              keyboardType="numeric"
              placeholder={`Enter ${measurement?.title.toLowerCase()}`}
            />
            <Text style={styles.inputUnit}>{measurement?.unit}</Text>
          </View>
          
          <Text style={styles.modalNote}>
            Regularly updating your measurements helps you track your progress toward your fitness goals.
          </Text>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButtonSecondary} onPress={onClose}>
              <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalButtonPrimary} 
              onPress={() => {
                onSave(parseFloat(value));
                onClose();
              }}
            >
              <Text style={styles.modalButtonPrimaryText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Edit Goals Modal Component
const EditGoalsModal = ({ visible, goals, onClose, onSave }) => {
  const [workoutsPerWeek, setWorkoutsPerWeek] = useState(goals.workoutsPerWeek.toString());
  const [targetWeight, setTargetWeight] = useState(goals.targetWeight.toString());
  const [targetBodyFat, setTargetBodyFat] = useState(goals.targetBodyFat.toString());
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Update Your Goals</Text>
          
          <Text style={styles.modalInputLabel}>Workouts Per Week:</Text>
          <TextInput
            style={styles.input}
            value={workoutsPerWeek}
            onChangeText={setWorkoutsPerWeek}
            keyboardType="numeric"
            placeholder="Workouts per week"
          />
          
          <Text style={styles.modalInputLabel}>Target Weight (lbs):</Text>
          <TextInput
            style={styles.input}
            value={targetWeight}
            onChangeText={setTargetWeight}
            keyboardType="numeric"
            placeholder="Target weight"
          />
          
          <Text style={styles.modalInputLabel}>Target Body Fat (%):</Text>
          <TextInput
            style={styles.input}
            value={targetBodyFat}
            onChangeText={setTargetBodyFat}
            keyboardType="numeric"
            placeholder="Target body fat percentage"
          />
          
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButtonSecondary} onPress={onClose}>
              <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalButtonPrimary} 
              onPress={() => {
                onSave({
                  workoutsPerWeek: parseInt(workoutsPerWeek, 10),
                  targetWeight: parseFloat(targetWeight),
                  targetBodyFat: parseFloat(targetBodyFat),
                });
                onClose();
              }}
            >
              <Text style={styles.modalButtonPrimaryText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Profile Main Screen
const ProfileMainScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(userData);
  const [selectedMeasurement, setSelectedMeasurement] = useState(null);
  const [measurementModalVisible, setMeasurementModalVisible] = useState(false);
  const [goalsModalVisible, setGoalsModalVisible] = useState(false);
  
  // Calculate measurement trends (difference between current and previous)
  const calculateTrend = (measurement) => {
    const history = user.measurements[measurement].history;
    if (history.length < 2) return 0;
    
    const current = history[history.length - 1].value;
    const previous = history[history.length - 2].value;
    return current - previous;
  };
  
  const handleTogglePreference = (preferenceName, value) => {
    setUser({
      ...user,
      preferences: {
        ...user.preferences,
        [preferenceName]: value,
      }
    });
  };
  
  const handleUpdateMeasurement = (value) => {
    if (!selectedMeasurement) return;
    
    const measurementKey = selectedMeasurement.key;
    const newMeasurement = {
      ...user.measurements[measurementKey],
      current: value,
      history: [
        ...user.measurements[measurementKey].history,
        { date: new Date().toISOString().split('T')[0], value }
      ]
    };
    
    setUser({
      ...user,
      measurements: {
        ...user.measurements,
        [measurementKey]: newMeasurement
      }
    });
  };
  
  const handleUpdateGoals = (newGoals) => {
    setUser({
      ...user,
      goals: newGoals
    });
  };
  
  const openMeasurementModal = (key, title) => {
    setSelectedMeasurement({
      key,
      title,
      current: user.measurements[key].current,
      unit: user.measurements[key].unit
    });
    setMeasurementModalVisible(true);
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          {user.profileImage ? (
            <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Ionicons name="person" size={40} color="#bdc3c7" />
            </View>
          )}
        </View>
        <Text style={styles.profileName}>{user.name}</Text>
        <Text style={styles.profileEmail}>{user.email}</Text>
        <Text style={styles.profileJoinDate}>Member since {user.joinDate}</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <StatCard 
          icon="checkmark-circle" 
          value={user.stats.workoutsCompleted} 
          label="Workouts"
        />
        <StatCard 
          icon="flame" 
          value={user.stats.streak} 
          label="Day Streak"
        />
        <StatCard 
          icon="trophy" 
          value={user.stats.longestStreak} 
          label="Best Streak"
        />
        <StatCard 
          icon="time" 
          value={user.stats.totalWorkoutMinutes} 
          label="Minutes"
        />
      </View>
      
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Measurements</Text>
          <Text style={styles.sectionSubtitle}>Tap to update</Text>
        </View>
        
        <View style={styles.measurementsGrid}>
          <MeasurementCard
            title="Weight"
            current={user.measurements.weight.current}
            unit={user.measurements.weight.unit}
            trend={calculateTrend('weight')}
            onPress={() => openMeasurementModal('weight', 'Weight')}
          />
          <MeasurementCard
            title="Body Fat"
            current={user.measurements.bodyFat.current}
            unit={user.measurements.bodyFat.unit}
            trend={calculateTrend('bodyFat')}
            onPress={() => openMeasurementModal('bodyFat', 'Body Fat')}
          />
          <MeasurementCard
            title="Chest"
            current={user.measurements.chestCircumference.current}
            unit={user.measurements.chestCircumference.unit}
            trend={calculateTrend('chestCircumference')}
            onPress={() => openMeasurementModal('chestCircumference', 'Chest Circumference')}
          />
          <MeasurementCard
            title="Waist"
            current={user.measurements.waistCircumference.current}
            unit={user.measurements.waistCircumference.unit}
            trend={calculateTrend('waistCircumference')}
            onPress={() => openMeasurementModal('waistCircumference', 'Waist Circumference')}
          />
        </View>
      </View>
      
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Goals</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setGoalsModalVisible(true)}
          >
            <Ionicons name="create-outline" size={16} color="#3498db" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.goalsContainer}>
          <View style={styles.goalItem}>
            <Ionicons name="calendar" size={24} color="#3498db" />
            <View style={styles.goalInfo}>
              <Text style={styles.goalLabel}>Workouts Per Week</Text>
              <Text style={styles.goalValue}>{user.goals.workoutsPerWeek}</Text>
            </View>
          </View>
          
          <View style={styles.goalItem}>
            <Ionicons name="body" size={24} color="#3498db" />
            <View style={styles.goalInfo}>
              <Text style={styles.goalLabel}>Target Weight</Text>
              <Text style={styles.goalValue}>{user.goals.targetWeight} lbs</Text>
            </View>
          </View>
          
          <View style={styles.goalItem}>
            <Ionicons name="fitness" size={24} color="#3498db" />
            <View style={styles.goalInfo}>
              <Text style={styles.goalLabel}>Target Body Fat</Text>
              <Text style={styles.goalValue}>{user.goals.targetBodyFat}%</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.preferencesContainer}>
          <PreferenceItem
            icon="moon"
            label="Dark Mode"
            description="Use dark theme throughout the app"
            value={user.preferences.darkMode}
            onToggle={(value) => handleTogglePreference('darkMode', value)}
          />
          
          <PreferenceItem
            icon="notifications"
            label="Notifications"
            description="Receive all app notifications"
            value={user.preferences.notifications}
            onToggle={(value) => handleTogglePreference('notifications', value)}
          />
          
          <PreferenceItem
            icon="barbell"
            label="Workout Reminders"
            description="Get reminders for scheduled workouts"
            value={user.preferences.workoutReminders}
            onToggle={(value) => handleTogglePreference('workoutReminders', value)}
          />
          
          <PreferenceItem
            icon="restaurant"
            label="Meal Reminders"
            description="Get reminders to log your meals"
            value={user.preferences.mealReminders}
            onToggle={(value) => handleTogglePreference('mealReminders', value)}
          />
        </View>
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="download-outline" size={20} color="#3498db" />
          <Text style={styles.actionButtonText}>Export Data</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="settings-outline" size={20} color="#3498db" />
          <Text style={styles.actionButtonText}>Account Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => navigation.navigate('ProgressTracking')}
        >
        <Ionicons name="trending-up" size={20} color="#3498db" />
        <Text style={styles.actionButtonText}>Progress Tracking</Text>
        </TouchableOpacity>

        
        <TouchableOpacity style={[styles.actionButton, styles.logoutButton]}>
          <Ionicons name="log-out-outline" size={20} color="#e74c3c" />
          <Text style={[styles.actionButtonText, styles.logoutButtonText]}>Log Out</Text>
        </TouchableOpacity>
      </View>
      
      <AddMeasurementModal
        visible={measurementModalVisible}
        measurement={selectedMeasurement}
        onClose={() => setMeasurementModalVisible(false)}
        onSave={handleUpdateMeasurement}
      />
      
      <EditGoalsModal
        visible={goalsModalVisible}
        goals={user.goals}
        onClose={() => setGoalsModalVisible(false)}
        onSave={handleUpdateGoals}
      />
    </ScrollView>
  );
};

// Create Stack Navigator for Profile
const Stack = createStackNavigator();

const ProfileScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileMainScreen}
        options={{
          title: 'Your Profile',
          headerStyle: {
            backgroundColor: '#3498db',
          },
          headerTintColor: '#fff',
        }}
      />
    <Stack.Screen
        name="ProgressTracking"
        component={ProgressTrackingScreen}
        options={{
          title: 'Progress Tracking',
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
  profileHeader: {
    backgroundColor: '#3498db',
    padding: 24,
    alignItems: 'center',
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  profileJoinDate: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: -40,
    marginBottom: 16,
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
  sectionContainer: {
    margin: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  measurementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  measurementCard: {
    width: '48%',
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
  measurementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  measurementTitle: {
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
    marginLeft: 2,
  },
  measurementValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  measurementUnit: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    color: '#3498db',
    marginLeft: 4,
  },
  goalsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalInfo: {
    marginLeft: 16,
    flex: 1,
  },
  goalLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  goalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 2,
  },
  preferencesContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  preferenceIcon: {
    marginRight: 16,
  },
  preferenceInfo: {
    flex: 1,
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  preferenceDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  actionsContainer: {
    margin: 16,
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
  actionButtonText: {
    fontSize: 16,
    color: '#3498db',
    marginLeft: 16,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#e74c3c',
    backgroundColor: 'transparent',
  },
  logoutButtonText: {
    color: '#e74c3c',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  modalInputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginTop: 12,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 16,
  },
  inputUnit: {
    position: 'absolute',
    right: 12,
    color: '#7f8c8d',
    fontSize: 16,
  },
  modalNote: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  },
});