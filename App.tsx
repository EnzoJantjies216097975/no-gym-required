// App.tsx
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ErrorBoundry from './src/components/common/ErrorBoundary';

// Import screens
import DashboardScreen from './src/screens/dashboard/DashboardScreen';
import ExerciseLibraryScreen from './src/screens/exercises/ExerciseLibraryScreen';
import WorkoutScreen from './src/screens/workouts/WorkoutScreen';
import NutritionScreen from './src/screens/nutrition/NutritionScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';

// Import DataProvider
import { DataProvider } from './src/store/DataContext';

const TabBarIcon = ({ route, focused, color, size }) => {
  let iconName;

  if (route.name === 'Dashboard') {
    iconName = focused ? 'home' : 'home-outline';
  } else if (route.name === 'Exercises') {
    iconName = focused ? 'fitness' : 'fitness-outline';
  } else if (route.name === 'Workouts') {
    iconName = focused ? 'barbell' : 'barbell-outline';
  } else if (route.name === 'Nutrition') {
    iconName = focused ? 'nutrition' : 'nutrition-outline';
  } else if (route.name === 'Profile') {
    iconName = focused ? 'person' : 'person-outline';
  }

  return <Ionicons name={iconName || 'help-circle'} size={size} color={color} />;
};

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <ErrorBoundry>
      <SafeAreaProvider>
        <DataProvider>
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: (props) => <TabBarIcon route={route}{...props} />,
                tabBarActiveTintColor: '#3498db',
                tabBarInactiveTintColor: 'gray',
                headerShown: true
              })}
              >
              <Tab.Screen name="Dashboard" component={DashboardScreen} />
              <Tab.Screen name="Exercises" component={ExerciseLibraryScreen} />
              <Tab.Screen name="Workouts" component={WorkoutScreen} />
              <Tab.Screen name="Nutrition" component={NutritionScreen} />
              <Tab.Screen name="Profile" component={ProfileScreen} />
            </Tab.Navigator>
          </NavigationContainer>
          <StatusBar style="auto" />
        </DataProvider>
      </SafeAreaProvider>
    </ErrorBoundry>
  );
};