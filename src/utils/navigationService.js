// src/utils/navigationService.js
import { createRef } from 'react';
import { CommonActions, StackActions } from '@react-navigation/native';

/**
 * The navigation reference that will be used across the app
 * This allows navigation from outside of React components
 */
export const navigationRef = createRef();

/**
 * Navigate to a specific route in the navigation state tree
 * @param {string} name - The name of the route to navigate to
 * @param {object} params - The params to pass to the route
 */
export function navigate(name, params) {
  if (navigationRef.current) {
    navigationRef.current.navigate(name, params);
  } else {
    console.warn('Navigation attempted before navigation ref was set');
  }
}

/**
 * Replace the current route with a new one
 * @param {string} name - The name of the route
 * @param {object} params - The params to pass to the route
 */
export function replace(name, params) {
  if (navigationRef.current) {
    navigationRef.current.dispatch(
      StackActions.replace(name, params)
    );
  } else {
    console.warn('Navigation replacement attempted before navigation ref was set');
  }
}

/**
 * Push a new route onto the stack
 * @param {string} name - The name of the route
 * @param {object} params - The params to pass to the route
 */
export function push(name, params) {
  if (navigationRef.current) {
    navigationRef.current.dispatch(
      StackActions.push(name, params)
    );
  } else {
    console.warn('Navigation push attempted before navigation ref was set');
  }
}

/**
 * Go back to the previous screen in the stack
 */
export function goBack() {
  if (navigationRef.current) {
    navigationRef.current.goBack();
  } else {
    console.warn('Navigation go back attempted before navigation ref was set');
  }
}

/**
 * Navigate to a specific route AND reset the navigation state
 * @param {string} name - The name of the route
 * @param {object} params - The params to pass to the route
 */
export function navigateAndReset(name, params) {
  if (navigationRef.current) {
    navigationRef.current.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name, params }],
      })
    );
  } else {
    console.warn('Navigation reset attempted before navigation ref was set');
  }
}

/**
 * Navigate to a nested route
 * @param {Array} routes - Array of route names and their params
 * Example: navigateNested(['Workouts', 'WorkoutDetail', 'WorkoutExecution'], [{}, { workoutId: 123 }, { isPremium: true }])
 */
export function navigateNested(routeNames, paramsArray = []) {
  if (!navigationRef.current) {
    console.warn('Nested navigation attempted before navigation ref was set');
    return;
  }
  
  if (!routeNames || !routeNames.length) {
    console.warn('No route names provided for nested navigation');
    return;
  }
  
  // Navigate to the first screen
  navigate(routeNames[0], paramsArray[0] || {});
  
  // Navigate to each subsequent screen
  for (let i = 1; i < routeNames.length; i++) {
    const currentNav = navigationRef.current?.getRootState()?.routes.find(
      r => r.name === routeNames[0]
    )?.state?.routes;
    
    if (currentNav) {
      navigate(routeNames[i], paramsArray[i] || {});
    } else {
      console.warn(`Could not find nested navigation state for ${routeNames[i]}`);
    }
  }
}

const NavigationService = {
  navigate,
  replace,
  push,
  goBack,
  navigateAndReset,
  navigateNested,
  navigationRef
};

export default NavigationService;