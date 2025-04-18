import { registerRootComponent } from 'expo';
import * as React from 'react';
import App from './App';

// Make sure React is available in the global scope for JSX
if (typeof global !== 'undefined') {
    if (!global.React) {
        global.React = React;
    }
}

// Log that the index.ts file is being executed
console.log('Index.ts is executing, about to register root component.');



// Log that registration is complete
console.log('Root component registered successfully.');

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately

