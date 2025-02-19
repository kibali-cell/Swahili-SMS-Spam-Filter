import React, { useContext } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';

const SettingsScreen = () => {
  const { dark, toggleDarkMode } = useContext(ThemeContext);
  const { language, toggleLanguage } = useContext(LanguageContext);

  // Define labels based on the current language
  const darkModeLabel = language === 'sw' ? 'Hali ya Giza' : 'Dark Mode';
  const languageLabel = language === 'sw' ? 'Lugha: Kiswahili' : 'Language: English';

  return (
    <View style={[styles.container, { backgroundColor: dark ? '#333' : '#fff' }]}>
      <View style={styles.settingRow}>
        <Text style={[styles.settingText, { color: dark ? '#fff' : '#000' }]}>
          {darkModeLabel}
        </Text>
        <Switch value={dark} onValueChange={toggleDarkMode} />
      </View>

      <View style={styles.settingRow}>
        <Text style={[styles.settingText, { color: dark ? '#fff' : '#000' }]}>
          {languageLabel}
        </Text>
        <Switch value={language === 'sw'} onValueChange={toggleLanguage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
