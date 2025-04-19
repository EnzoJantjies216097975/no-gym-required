// src/hooks/useNavigation.js
import { useNavigation as useReactNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { useMemo, useCallback } from 'react';

/**
 * Enhanced navigation hook that provides simplified navigation methods
 * @returns {Object} Object containing navigation methods and state
 */
export function useNavigation() {
  // Get the base navigation object from React Navigation
  const navigation = useReactNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();
  
  // Get route params with optional default values
  const getParam = useCallback((paramName, defaultValue = null) => {
    if (route.params && route.params[paramName] !== undefined) {
      return route.params[paramName];
    }
    return defaultValue;
  }, [route.params]);
  
  // Navigate to a workout detail screen
  const navigateToWorkoutDetail = useCallback((workout) => {
    navigation.navigate('Workouts', {
      screen: 'WorkoutDetail',
      params: { program: workout }
    });
  }, [navigation]);
  
  // Navigate to a workout execution screen
  const navigateToWorkoutExecution = useCallback((workout) => {
    navigation.navigate('Workouts', {
      screen: 'WorkoutExecution',
      params: { workout }
    });
  }, [navigation]);
  
  // Navigate to exercise detail screen
  const navigateToExerciseDetail = useCallback((exercise) => {
    navigation.navigate('Exercises', {
      screen: 'ExerciseDetail',
      params: { exercise }
    });
  }, [navigation]);
  
  // Navigate to progress tracking screen
  const navigateToProgressTracking = useCallback(() => {
    navigation.navigate('Profile', {
      screen: 'ProgressTracking'
    });
  }, [navigation]);
  
  // Navigate back with optional callback
  const goBack = useCallback((callback = null) => {
    navigation.goBack();
    if (callback && typeof callback === 'function') {
      setTimeout(callback, 0);
    }
  }, [navigation]);
  
  // Create a params setter that will update route params
  const setParams = useCallback((params) => {
    navigation.setParams(params);
  }, [navigation]);
  
  return useMemo(() => ({
    // Original navigation object
    navigation,
    // Route information
    route,
    routeName: route.name,
    params: route.params || {},
    isFocused,
    // Helper methods
    getParam,
    setParams,
    goBack,
    // App-specific navigation shortcuts
    navigateToWorkoutDetail,
    navigateToWorkoutExecution,
    navigateToExerciseDetail,
    navigateToProgressTracking,
  }), [
    navigation, 
    route, 
    isFocused, 
    getParam, 
    setParams, 
    goBack,
    navigateToWorkoutDetail,
    navigateToWorkoutExecution,
    navigateToExerciseDetail,
    navigateToProgressTracking
  ]);
}

export default useNavigation;