import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './src/contexts/AuthContext';

import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import StoryGeneratorScreen from './src/screens/StoryGeneratorScreen';
import StoryEditorScreen from './src/screens/StoryEditorScreen';
import StoryDetailScreen from './src/screens/StoryDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LibraryScreen from './src/screens/LibraryScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'StoryVerse' }}
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ title: 'Login' }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen}
            options={{ title: 'Create Account' }}
          />
          <Stack.Screen 
            name="StoryGenerator" 
            component={StoryGeneratorScreen}
            options={{ title: 'Generate Story' }}
          />
          <Stack.Screen 
            name="StoryEditor" 
            component={StoryEditorScreen}
            options={{ title: 'Edit Story' }}
          />
          <Stack.Screen 
            name="StoryDetail" 
            component={StoryDetailScreen}
            options={{ title: 'Story Details' }}
          />
          <Stack.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{ title: 'My Profile' }}
          />
          <Stack.Screen 
            name="Library" 
            component={LibraryScreen}
            options={{ title: 'Story Library' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
