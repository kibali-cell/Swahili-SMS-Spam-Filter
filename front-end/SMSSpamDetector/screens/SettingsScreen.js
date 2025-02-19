// screens/SettingsScreen.js
import React, { useContext } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

const SettingsScreen = () => {
  const { dark, toggleDarkMode } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: dark ? '#333' : '#fff' }]}>
      {/* <Text style={[styles.header, { color: dark ? '#fff' : '#000' }]}>
        Mipangilio
      </Text> */}
      <View style={styles.settingRow}>
        <Text style={[styles.settingText, { color: dark ? '#fff' : '#000' }]}>
         Hali ya Giza
        </Text>
        <Switch value={dark} onValueChange={toggleDarkMode} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  settingText: {
    fontSize: 18,
  },
});

export default SettingsScreen;
