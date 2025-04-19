// src/navigation/types.ts
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// Workout types
export interface Workout {
  id: string;
  name: string;
  category: string;
  description?: string;
  duration: string | number;
  frequency?: string;
  level?: string;
  phases?: Array<{
    name: string;
    days?: string;
    weeks?: string;
    description?: string;
    workouts: Array<{
      name: string;
      exercises: Array<{
        name: string;
        sets?: number | string;
        reps?: number | string;
      }>;
    }>;
  }>;
}

// Exercise types
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
}

// Main Tab Navigation Types
export type RootTabParamList = {
  Dashboard: undefined;
  Exercises: undefined;
  Workouts: undefined;
  Nutrition: undefined;
  Profile: undefined;
};

// Stack Navigation Types
export type WorkoutStackParamList = {
  WorkoutMain: undefined;
  WorkoutDetail: { program: Workout };
  WorkoutExecution: { workout: any };
};

export type ExerciseStackParamList = {
  ExerciseLibraryMain: undefined;
  ExerciseDetail: { exercise: Exercise };
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  ProgressTracking: undefined;
};

export type NutritionStackParamList = {
  NutritionMain: undefined;
};

// Combined Navigation Types
export type AppStackParamList = WorkoutStackParamList & 
  ExerciseStackParamList & 
  ProfileStackParamList & 
  NutritionStackParamList;

// Navigation Props for Components
export type WorkoutScreenNavigationProp = StackNavigationProp<
  WorkoutStackParamList,
  'WorkoutMain'
>;

export type WorkoutDetailScreenNavigationProp = StackNavigationProp<
  WorkoutStackParamList,
  'WorkoutDetail'
>;

export type WorkoutDetailScreenRouteProp = RouteProp<
  WorkoutStackParamList,
  'WorkoutDetail'
>;

export type WorkoutExecutionScreenNavigationProp = StackNavigationProp<
  WorkoutStackParamList,
  'WorkoutExecution'
>;

export type WorkoutExecutionScreenRouteProp = RouteProp<
  WorkoutStackParamList,
  'WorkoutExecution'
>;

export type ExerciseScreenNavigationProp = StackNavigationProp<
  ExerciseStackParamList,
  'ExerciseLibraryMain'
>;

export type ExerciseDetailScreenNavigationProp = StackNavigationProp<
  ExerciseStackParamList,
  'ExerciseDetail'
>;

export type ExerciseDetailScreenRouteProp = RouteProp<
  ExerciseStackParamList,
  'ExerciseDetail'
>;

export type ProfileScreenNavigationProp = StackNavigationProp<
  ProfileStackParamList,
  'ProfileMain'
>;

export type ProgressTrackingScreenNavigationProp = StackNavigationProp<
  ProfileStackParamList,
  'ProgressTracking'
>;

export type DashboardScreenNavigationProp = BottomTabNavigationProp<
  RootTabParamList,
  'Dashboard'
>;

export type NutritionScreenNavigationProp = BottomTabNavigationProp<
  RootTabParamList,
  'Nutrition'
>;

// Props Types for Screen Components
export interface WorkoutDetailScreenProps {
  navigation: WorkoutDetailScreenNavigationProp;
  route: WorkoutDetailScreenRouteProp;
}

export interface WorkoutExecutionScreenProps {
  navigation: WorkoutExecutionScreenNavigationProp;
  route: WorkoutExecutionScreenRouteProp;
}

export interface ExerciseDetailScreenProps {
  navigation: ExerciseDetailScreenNavigationProp;
  route: ExerciseDetailScreenRouteProp;
}