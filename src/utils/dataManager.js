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
const dataManager = {
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
  },
  
  /**
   * Get the user's workout history
   * @param {number} limit - Optional limit on the number of workouts to retrieve
   * @returns {Promise<Array>} - Array of workout objects
   */
  async getWorkoutHistory(limit = null) {
    try {
      const historyString = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUT_HISTORY);
      
      if (!historyString) {
        // Return mock data for initial app usage
        return [
          {
            id: '1',
            name: 'Powered-Up Pushups',
            type: 'Upper Body',
            duration: 30,
            timestamp: new Date().toISOString()
          },
          {
            id: '2',
            name: 'The Body-Weight Burner',
            type: 'Total Body',
            duration: 25,
            timestamp: new Date(Date.now() - 86400000).toISOString()
          }
        ];
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
  },
  
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
  },
  
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
  },
  
  /**
   * Get exercise progress data
   * @returns {Promise<Object>} - Object containing exercise progress data
   */
  async getExerciseProgress() {
    try {
      const progressString = await AsyncStorage.getItem(STORAGE_KEYS.EXERCISE_PROGRESS);
      return progressString ? JSON.parse(progressString) : {};
    } catch (error) {
      console.error('Error retrieving exercise progress:', error);
      return {};
    }
  },
  
  /**
   * Save user measurements
   * @param {Object} measurementData - The measurement data to save
   * @returns {Promise<boolean>} - True if successful, false if error
   */
  async saveUserMeasurements(measurementData) {
    try {
      // Add timestamp if not present
      if (!measurementData.timestamp) {
        measurementData.timestamp = new Date().toISOString();
      }
      
      // Get existing measurements
      const existingMeasurements = await this.getUserMeasurements();
      
      // Add new measurement
      const updatedMeasurements = [...existingMeasurements, measurementData];
      
      // Save updated measurements
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_MEASUREMENTS, 
        JSON.stringify(updatedMeasurements)
      );
      
      console.log('Measurement saved successfully:', measurementData);
      return true;
    } catch (error) {
      console.error('Error saving measurement:', error);
      return false;
    }
  },
  
  /**
   * Get user measurements
   * @returns {Promise<Array>} - Array of measurement objects
   */
  async getUserMeasurements() {
    try {
      const measurementsString = await AsyncStorage.getItem(STORAGE_KEYS.USER_MEASUREMENTS);
      return measurementsString ? JSON.parse(measurementsString) : [];
    } catch (error) {
      console.error('Error retrieving measurements:', error);
      return [];
    }
  },
  
  /**
   * Save or update user profile
   * @param {Object} profileData - The user profile data
   * @returns {Promise<boolean>} - True if successful, false if error
   */
  async saveUserProfile(profileData) {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PROFILE, 
        JSON.stringify(profileData)
      );
      
      console.log('User profile saved successfully:', profileData);
      return true;
    } catch (error) {
      console.error('Error saving user profile:', error);
      return false;
    }
  },
  
  /**
   * Get user profile
   * @returns {Promise<Object|null>} - User profile object or null if not found
   */
  async getUserProfile() {
    console.log('Getting user profile');
    try {
      const profileString = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      console.log('Profile string:', profileString ? 'Found' : 'Not found');
      
      if (!profileString) {
        // Return default profile for initial app usage
        return {
          name: 'Fitness User',
          email: 'user@example.com',
          joinDate: 'April 2023',
        };
      }
      
      return JSON.parse(profileString);
    } catch (error) {
      console.error('Error retrieving user profile:', error);
      return null;
    }
  },
  
  /**
   * Get app settings
   * @returns {Promise<Object>} - App settings object
   */
  async getAppSettings() {
    try {
      const settingsString = await AsyncStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
      
      if (!settingsString) {
        // Return default settings
        return {
          darkMode: false,
          notifications: true,
          workoutReminders: true,
          mealReminders: false,
          units: 'imperial',
        };
      }
      
      return JSON.parse(settingsString);
    } catch (error) {
      console.error('Error retrieving app settings:', error);
      return null;
    }
  },
  
  /**
   * Update app settings
   * @param {Object} settingsData - The settings data to update
   * @returns {Promise<boolean>} - True if successful, false if error
   */
  async updateAppSettings(settingsData) {
    try {
      // Get existing settings
      const existingSettings = await this.getAppSettings() || {};
      
      // Merge with new settings
      const updatedSettings = { ...existingSettings, ...settingsData };
      
      // Save updated settings
      await AsyncStorage.setItem(
        STORAGE_KEYS.APP_SETTINGS, 
        JSON.stringify(updatedSettings)
      );
      
      console.log('App settings updated successfully:', updatedSettings);
      return true;
    } catch (error) {
      console.error('Error updating app settings:', error);
      return false;
    }
  },
  
  /**
   * Calculate workout statistics for a given date range
   * @param {string} startDate - Start date in ISO format
   * @param {string} endDate - End date in ISO format
   * @returns {Promise<Object>} - Workout statistics
   */
  async calculateWorkoutStats(startDate, endDate) {
    try {
      const workouts = await this.getWorkoutHistoryByDateRange(startDate, endDate);
      
      // Calculate total number of workouts
      const totalWorkouts = workouts.length;
      
      // Calculate total duration
      const totalDuration = workouts.reduce((total, workout) => 
        total + (workout.duration || 0), 0
      );
      
      // Calculate streak (consecutive days with workouts)
      let streak = 0;
      let maxStreak = 0;
      let currentDate = new Date();
      let prevDate = null;
      
      // Sort workouts by date, newest first
      const sortedWorkouts = [...workouts].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      // Calculate current streak
      for (const workout of sortedWorkouts) {
        const workoutDate = new Date(workout.timestamp);
        workoutDate.setHours(0, 0, 0, 0);
        
        if (!prevDate) {
          // First workout in the list
          streak = 1;
          prevDate = workoutDate;
          continue;
        }
        
        const prevDay = new Date(prevDate);
        prevDay.setDate(prevDay.getDate() - 1);
        
        if (workoutDate.getTime() === prevDay.getTime()) {
          // Workout on consecutive day
          streak++;
          prevDate = workoutDate;
        } else {
          // Streak broken
          break;
        }
      }
      
      // For simplicity, return mock data if no workouts
      if (totalWorkouts === 0) {
        return {
          totalWorkouts: 0,
          totalDuration: 0,
          streak: 0
        };
      }
      
      return {
        totalWorkouts,
        totalDuration,
        streak: Math.max(streak, 1) // Minimum streak is 1 if there are workouts
      };
    } catch (error) {
      console.error('Error calculating workout stats:', error);
      return {
        totalWorkouts: 0,
        totalDuration: 0,
        streak: 0
      };
    }
  },
  
  /**
   * Export all user data
   * @returns {Promise<Object>} - Object containing all user data
   */
  async exportUserData() {
    try {
      const profile = await this.getUserProfile();
      const workoutHistory = await this.getWorkoutHistory();
      const exerciseProgress = await this.getExerciseProgress();
      const measurements = await this.getUserMeasurements();
      const appSettings = await this.getAppSettings();
      
      return {
        profile,
        workoutHistory,
        exerciseProgress,
        measurements,
        appSettings,
        exportDate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error exporting user data:', error);
      return null;
    }
  },
  
  /**
   * Import user data
   * @param {Object} jsonData - The data to import
   * @returns {Promise<boolean>} - True if successful, false if error
   */
  async importUserData(jsonData) {
    try {
      if (jsonData.profile) {
        await this.saveUserProfile(jsonData.profile);
      }
      
      if (jsonData.workoutHistory && Array.isArray(jsonData.workoutHistory)) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.WORKOUT_HISTORY, 
          JSON.stringify(jsonData.workoutHistory)
        );
      }
      
      if (jsonData.exerciseProgress) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.EXERCISE_PROGRESS, 
          JSON.stringify(jsonData.exerciseProgress)
        );
      }
      
      if (jsonData.measurements && Array.isArray(jsonData.measurements)) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.USER_MEASUREMENTS, 
          JSON.stringify(jsonData.measurements)
        );
      }
      
      if (jsonData.appSettings) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.APP_SETTINGS, 
          JSON.stringify(jsonData.appSettings)
        );
      }
      
      console.log('User data imported successfully');
      return true;
    } catch (error) {
      console.error('Error importing user data:', error);
      return false;
    }
  },
  
  /**
   * Clear all user data
   * @returns {Promise<boolean>} - True if successful, false if error
   */
  async clearAllData() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.WORKOUT_HISTORY,
        STORAGE_KEYS.EXERCISE_PROGRESS,
        STORAGE_KEYS.USER_MEASUREMENTS,
        STORAGE_KEYS.USER_PROFILE,
        STORAGE_KEYS.APP_SETTINGS
      ]);
      
      console.log('All user data cleared successfully');
      return true;
    } catch (error) {
      console.error('Error clearing user data:', error);
      return false;
    }
  }
};

export default dataManager;