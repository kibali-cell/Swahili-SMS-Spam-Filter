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

export default function HomeScreen({ navigation }) {
  const { dark } = useContext(ThemeContext);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const checkMessage = async () => {
    if (!message.trim()) {
      Alert.alert('Hitilafu', 'Tafadhali weka ujumbe');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/incoming-messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: '+1234567890',
          text: message.trim(),
          to: '+0987654321'
        }),
      });
      const data = await response.json();
      setResult(data);

      // Save to history
      const timestamp = new Date().toISOString();
      const historyItem = { message, result: data, timestamp };
      const history = await AsyncStorage.getItem('checkHistory');
      const historyArray = history ? JSON.parse(history) : [];
      historyArray.unshift(historyItem);
      await AsyncStorage.setItem('checkHistory', JSON.stringify(historyArray.slice(0, 50)));
    } catch (error) {
      Alert.alert('Hitilafu', 'Imeshindwa kuangalia ujumbe. Tafadhali jaribu tena.');
    } finally {
      setLoading(false);
    }
  };

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
        placeholder="Weka ujumbe wa SMS ili kuangalia..."
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
          <Text style={styles.buttonText}>Angalia Ujumbe</Text>
        )}
      </TouchableOpacity>

      {result && (
        <View style={styles.resultContainer}>
          <Text style={[styles.resultTitle, { color: dark ? '#fff' : '#000' }]}>Result:</Text>
          <View
            style={[
              styles.resultBox,
              { backgroundColor: result.is_spam ? '#ffebee' : '#e8f5e9' }
            ]}
          >
            <Text style={[styles.resultText, { color: dark ? '#000' : '#000' }]}>
              {result.is_spam ? 'Utapeli Umegundulika!' : 'Ujumbe unaonekana kuwa salama'}
            </Text>
            <Text style={styles.confidenceText}>
              Confidence: {result.confidence.toFixed(1)}%
            </Text>
          </View>
        </View>
      )}

      <View style={styles.navigation}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('History')}>
          <Text style={styles.navButtonText}>Tazama Historia</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.navButtonText}>Mipangilio</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  resultBox: {
    padding: 15,
    borderRadius: 8,
  },
  resultText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  confidenceText: {
    fontSize: 14,
    opacity: 0.8,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingTop: 20,
  },
  navButton: {
    padding: 10,
  },
  navButtonText: {
    color: '#2196F3',
    fontSize: 16,
  },
});
