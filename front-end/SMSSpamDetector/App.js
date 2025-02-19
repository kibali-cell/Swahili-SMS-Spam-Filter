// App.js
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/HistoryScreen';
import SettingsScreen from './screens/SettingsScreen';
import { ThemeProvider } from './context/ThemeContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'Habari Karibu, Kikagua SMS' }}
          />
          <Stack.Screen 
            name="History" 
            component={HistoryScreen}
            options={{ title: 'Angalia Historia' }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{ title: 'Mipangilio' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}