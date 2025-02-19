import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/HistoryScreen';
import SettingsScreen from './screens/SettingsScreen';
import { LanguageContext } from './context/LanguageContext';

const Stack = createNativeStackNavigator();

const AppStack = () => {
  const { language } = useContext(LanguageContext);
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: language === 'sw' 
            ? 'Habari Karibu, Kikagua SMS' 
            : 'Welcome, SMS Checker'
        }}
      />
      <Stack.Screen 
        name="History" 
        component={HistoryScreen}
        options={{
          title: language === 'sw' 
            ? 'Angalia Historia' 
            : 'View History'
        }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: language === 'sw' 
            ? 'Mipangilio' 
            : 'Settings'
        }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
