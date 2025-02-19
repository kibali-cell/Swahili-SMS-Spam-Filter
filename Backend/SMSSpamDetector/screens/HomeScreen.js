// screens/HomeScreen.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';

export default function HomeScreen({ navigation }) {
  const { dark } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  
  // New state for sender's number
  const [sender, setSender] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const checkMessage = async () => {
    if (!sender.trim() || !message.trim()) {
      Alert.alert(
        language === 'sw' ? 'Hitilafu' : 'Error', 
        language === 'sw'
          ? 'Tafadhali andika nambari ya mtumaji na ujumbe'
          : 'Please enter both sender number and message'
      );
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/incoming-messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: sender.trim(),
          text: message.trim(),
          to: '+0987654321', // Update as needed
        }),
      });
      const data = await response.json();
      setResult(data);

      // Save to history (including sender info)
      const timestamp = new Date().toISOString();
      const historyItem = { sender: sender.trim(), message, result: data, timestamp };
      const history = await AsyncStorage.getItem('checkHistory');
      const historyArray = history ? JSON.parse(history) : [];
      historyArray.unshift(historyItem);
      await AsyncStorage.setItem('checkHistory', JSON.stringify(historyArray.slice(0, 50)));
    } catch (error) {
      console.log('Error during checkMessage:', error);
      Alert.alert(
        language === 'sw' ? 'Hitilafu' : 'Error',
        language === 'sw'
          ? 'Imeshindwa kuangalia ujumbe. Tafadhali jaribu tena.'
          : 'Failed to check message. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Define placeholders and labels based on the current language
  const senderPlaceholder = language === 'sw' ? 'Andika nambari ya mtumaji...' : 'Enter sender number...';
  const messagePlaceholder = language === 'sw' ? 'Andika ujumbe wa SMS...' : 'Enter SMS message...';
  const buttonText = language === 'sw' ? 'Angalia Ujumbe' : 'Check Message';
  const resultTitle = language === 'sw' ? 'Matokeo:' : 'Result:';
  const spamDetectedText = language === 'sw' ? 'Utapeli Umegundulika!' : 'Spam Detected!';
  const safeText = language === 'sw' ? 'Ujumbe unaonekana kuwa salama' : 'Message appears safe';
  const confidenceLabel = language === 'sw' ? 'Uhakika:' : 'Confidence:';

  return (
    <View style={[styles.container, { backgroundColor: dark ? '#000' : '#fff' }]}>
      <TextInput
        style={[
          styles.input,
          {
            color: dark ? '#fff' : '#000',
            borderColor: dark ? '#444' : '#ddd',
            backgroundColor: dark ? '#333' : '#fff'
          }
        ]}
        placeholder={senderPlaceholder}
        placeholderTextColor={dark ? '#aaa' : '#888'}
        value={sender}
        onChangeText={setSender}
        keyboardType="phone-pad"
      />
      <TextInput
        style={[
          styles.input,
          { minHeight: 100, color: dark ? '#fff' : '#000', borderColor: dark ? '#444' : '#ddd', backgroundColor: dark ? '#333' : '#fff' }
        ]}
        placeholder={messagePlaceholder}
        placeholderTextColor={dark ? '#aaa' : '#888'}
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.button} onPress={checkMessage} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{buttonText}</Text>
        )}
      </TouchableOpacity>

      {result && (
        <View style={styles.resultContainer}>
          <Text style={[styles.resultTitle, { color: dark ? '#fff' : '#000' }]}>{resultTitle}</Text>
          <View style={[styles.resultBox, { backgroundColor: result.is_spam ? '#ffebee' : '#e8f5e9' }]}>
            <Text style={styles.resultText}>
              {result.is_spam ? spamDetectedText : safeText}
            </Text>
            <Text style={styles.confidenceText}>
              {confidenceLabel} {result.confidence.toFixed(1)}%
            </Text>
            <Text style={styles.senderText}>
              {language === 'sw' ? 'Kutoka:' : 'From:'} {sender}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.navigation}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('History')}>
          <Text style={styles.navButtonText}>
            {language === 'sw' ? 'Tazama Historia' : 'View History'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.navButtonText}>
            {language === 'sw' ? 'Mipangilio' : 'Settings'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 20, textAlignVertical: 'top' },
  button: { backgroundColor: '#2196F3', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  resultContainer: { marginTop: 20 },
  resultTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  resultBox: { padding: 15, borderRadius: 8 },
  resultText: { fontSize: 16, fontWeight: '600', marginBottom: 5 },
  confidenceText: { fontSize: 14, opacity: 0.8 },
  senderText: { marginTop: 5, fontSize: 14, fontStyle: 'italic' },
  navigation: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 20 },
  navButton: { padding: 10 },
  navButtonText: { color: '#2196F3', fontSize: 16 },
});
