// src/store/DataContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import dataManager from '../utils/dataManager';

// Create the context
const DataContext = createContext();

// Custom hook for using the context
export const useData = () => useContext(DataContext);

// Context provider component
export const DataProvider = ({ children }) => {
  // State for user data
  const [userProfile, setUserProfile] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [exerciseProgress, setExerciseProgress] = useState({});
  const [measurements, setMeasurements] = useState([]);
  const [appSettings, setAppSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [workoutStats, setWorkoutStats] = useState(null);

  // Load initial data
  useEffect(() => {
    console.log('DataProvider useEffect running');
    const loadInitialData = async () => {
      try {
        console.log('Starting to load initial data');
        setIsLoading(true);
        
        // Load user profile
        const profile = await dataManager.getUserProfile();
        setUserProfile(profile);
        
        // Load workout history (limit to recent 50 for performance)
        const history = await dataManager.getWorkoutHistory(50);
        setWorkoutHistory(history);
        
        // Load exercise progress
        const progress = await dataManager.getExerciseProgress();
        setExerciseProgress(progress);
        
        // Load measurements
        const userMeasurements = await dataManager.getUserMeasurements();
        setMeasurements(userMeasurements);
        
        // Load app settings
        const settings = await dataManager.getAppSettings();
        setAppSettings(settings);
        
        // Calculate workout stats for the last 30 days
        const endDate = new Date().toISOString();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        const stats = await dataManager.calculateWorkoutStats(startDate.toISOString(), endDate);
        setWorkoutStats(stats);
        console.log('Data loading complete');
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  // Functions to update data
  const updateUserProfile = async (profileData) => {
    try {
      const success = await dataManager.saveUserProfile(profileData);
      
      if (success) {
        setUserProfile(profileData);
      }
      
      return success;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  };
  
  const saveWorkout = async (workoutData) => {
    try {
      const success = await dataManager.saveWorkout(workoutData);
      
      if (success) {
        // Refresh workout history
        const history = await dataManager.getWorkoutHistory(50);
        setWorkoutHistory(history);
        
        // Recalculate workout stats
        const endDate = new Date().toISOString();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        const stats = await dataManager.calculateWorkoutStats(startDate.toISOString(), endDate);
        setWorkoutStats(stats);
      }
      
      return success;
    } catch (error) {
      console.error('Error saving workout:', error);
      return false;
    }
  };
  
  const saveExerciseProgress = async (exerciseData) => {
    try {
      const success = await dataManager.saveExerciseProgress(exerciseData);
      
      if (success) {
        // Refresh exercise progress
        const progress = await dataManager.getExerciseProgress();
        setExerciseProgress(progress);
      }
      
      return success;
    } catch (error) {
      console.error('Error saving exercise progress:', error);
      return false;
    }
  };
  
  const saveMeasurements = async (measurementData) => {
    try {
      const success = await dataManager.saveUserMeasurements(measurementData);
      
      if (success) {
        // Refresh measurements
        const userMeasurements = await dataManager.getUserMeasurements();
        setMeasurements(userMeasurements);
      }
      
      return success;
    } catch (error) {
      console.error('Error saving measurements:', error);
      return false;
    }
  };
  
  const updateAppSettings = async (settingsData) => {
    try {
      const success = await dataManager.updateAppSettings(settingsData);
      
      if (success) {
        // Refresh app settings
        const settings = await dataManager.getAppSettings();
        setAppSettings(settings);
      }
      
      return success;
    } catch (error) {
      console.error('Error updating app settings:', error);
      return false;
    }
  };
  
  const refreshAllData = async () => {
    try {
      setIsLoading(true);
      
      // Reload all data
      const profile = await dataManager.getUserProfile();
      setUserProfile(profile);
      
      const history = await dataManager.getWorkoutHistory(50);
      setWorkoutHistory(history);
      
      const progress = await dataManager.getExerciseProgress();
      setExerciseProgress(progress);
      
      const userMeasurements = await dataManager.getUserMeasurements();
      setMeasurements(userMeasurements);
      
      const settings = await dataManager.getAppSettings();
      setAppSettings(settings);
      
      // Recalculate workout stats
      const endDate = new Date().toISOString();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      const stats = await dataManager.calculateWorkoutStats(startDate.toISOString(), endDate);
      setWorkoutStats(stats);
      
      return true;
    } catch (error) {
      console.error('Error refreshing all data:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const exportData = async () => {
    try {
      return await dataManager.exportUserData();
    } catch (error) {
      console.error('Error exporting data:', error);
      return null;
    }
  };
  
  const importData = async (jsonData) => {
    try {
      const success = await dataManager.importUserData(jsonData);
      
      if (success) {
        // Refresh all data
        await refreshAllData();
      }
      
      return success;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  };
  
  const clearAllData = async () => {
    try {
      const success = await dataManager.clearAllData();
      
      if (success) {
        // Reset state
        setUserProfile(null);
        setWorkoutHistory([]);
        setExerciseProgress({});
        setMeasurements([]);
        setAppSettings(null);
        setWorkoutStats(null);
      }
      
      return success;
    } catch (error) {
      console.error('Error clearing all data:', error);
      return false;
    }
  };
  
  // Context value
  const contextValue = {
    // State
    userProfile,
    workoutHistory,
    exerciseProgress,
    measurements,
    appSettings,
    workoutStats,
    isLoading,
    
    // Functions
    updateUserProfile,
    saveWorkout,
    saveExerciseProgress,
    saveMeasurements,
    updateAppSettings,
    refreshAllData,
    exportData,
    importData,
    clearAllData,
    
    // Direct access to data manager for advanced operations
    dataManager,
  };

  if (isLoading) {
    console.log('DataProvider is loading');
    // Return a simple View instead of null
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading data...</Text>
      </View>
    );
  }
  console.log('DataProvider rendering children');
  
  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;