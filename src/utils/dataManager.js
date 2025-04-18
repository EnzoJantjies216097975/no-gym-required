// src/utils/dataManager.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  WORKOUT_HISTORY: 'workout_history',
  EXERCISE_PROGRESS: 'exercise_progress',
  USER_MEASUREMENTS: 'user_measurements',
  USER_PROFILE: 'user_profile',
  APP_SETTINGS: 'app_settings',
};

/**
 * Data Manager for the No Gym Required app
 * Handles storage and retrieval of workout data, user measurements, and app settings
 */
class DataManager {
  /**
   * Save a completed workout to the workout history
   * @param {Object} workout - The workout data to save
   * @returns {Promise<boolean>} - True if successful, false if error
   */
  async saveWorkout(workout) {
    try {
      // Add timestamp if not present
      if (!workout.timestamp) {
        workout.timestamp = new Date().toISOString();
      }
      
      // Get existing workout history
      const existingHistory = await this.getWorkoutHistory();
      
      // Add new workout to history
      const updatedHistory = [...existingHistory, workout];
      
      // Save updated history
      await AsyncStorage.setItem(
        STORAGE_KEYS.WORKOUT_HISTORY, 
        JSON.stringify(updatedHistory)
      );
      
      console.log('Workout saved successfully:', workout);
      return true;
    } catch (error) {
      console.error('Error saving workout:', error);
      return false;
    }
  }
  
  /**
   * Get the user's workout history
   * @param {number} limit - Optional limit on the number of workouts to retrieve
   * @returns {Promise<Array>} - Array of workout objects
   */
  async getWorkoutHistory(limit = null) {
    try {
      const historyString = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUT_HISTORY);
      
      if (!historyString) {
        return [];
      }
      
      const history = JSON.parse(historyString);
      
      // Sort by timestamp, newest first
      const sortedHistory = history.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      // Apply limit if provided
      return limit ? sortedHistory.slice(0, limit) : sortedHistory;
    } catch (error) {
      console.error('Error retrieving workout history:', error);
      return [];
    }
  }
  
  /**
   * Get workout history for a specific date range
   * @param {string} startDate - Start date in ISO format
   * @param {string} endDate - End date in ISO format
   * @returns {Promise<Array>} - Array of workout objects within the date range
   */
  async getWorkoutHistoryByDateRange(startDate, endDate) {
    try {
      const history = await this.getWorkoutHistory();
      
      const startTime = new Date(startDate).getTime();
      const endTime = new Date(endDate).getTime();
      
      return history.filter(workout => {
        const workoutTime = new Date(workout.timestamp).getTime();
        return workoutTime >= startTime && workoutTime <= endTime;
      });
    } catch (error) {
      console.error('Error retrieving workout history by date range:', error);
      return [];
    }
  }
  
  /**
   * Save exercise progress data
   * @param {Object} exerciseData - Data about the exercise progress
   * @returns {Promise<boolean>} - True if successful, false if error
   */
  async saveExerciseProgress(exerciseData) {
    try {
      // Add timestamp if not present
      if (!exerciseData.timestamp) {
        exerciseData.timestamp = new Date().toISOString();
      }
      
      // Get existing exercise progress
      const existingProgress = await this.getExerciseProgress();
      
      // Create a unique key for the exercise
      const exerciseKey = exerciseData.name.toLowerCase().replace(/\s+/g, '_');
      
      // Check if this exercise already has progress data
      if (!existingProgress[exerciseKey]) {
        existingProgress[exerciseKey] = [];
      }
      
      // Add new progress data
      existingProgress[exerciseKey].push({
        timestamp: exerciseData.timestamp,
        reps: exerciseData.reps,
        weight: exerciseData.weight,
        duration: exerciseData.duration,
        difficulty: exerciseData.difficulty,
        notes: exerciseData.notes
      });
      
      // Save updated progress
    await AsyncStorage.setItem(
      STORAGE_KEYS.EXERCISE_PROGRESS, 
      JSON.stringify(existingProgress)
    );
    
    console.log('Exercise progress saved successfully:', exerciseData);
    return true;
    } catch (error) {
      console.error('Error saving exercise progress:', error);
      return false;
    }
  }
}