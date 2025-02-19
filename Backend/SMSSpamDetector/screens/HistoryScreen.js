import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';

export default function HistoryScreen() {
  const { dark } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const historyData = await AsyncStorage.getItem('checkHistory');
      if (historyData) setHistory(JSON.parse(historyData));
    } catch (error) {
      Alert.alert('Error', 'Failed to load history');
    }
  };

  const clearHistory = async () => {
    Alert.alert(
      language === 'sw' ? 'Futa Historia' : 'Clear History',
      language === 'sw'
        ? 'Una uhakika unataka kufuta historia yote?'
        : 'Are you sure you want to clear all history?',
      [
        { text: language === 'sw' ? 'Ghairi' : 'Cancel', style: 'cancel' },
        {
          text: language === 'sw' ? 'Futa' : 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('checkHistory');
              setHistory([]);
            } catch (error) {
              Alert.alert(language === 'sw' ? 'Hitilafu' : 'Error', language === 'sw' ? 'Imeshindwa kufuta historia' : 'Failed to clear history');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={[styles.historyItem, { backgroundColor: item.result.is_spam ? '#ffebee' : '#e8f5e9' }]}>
      <Text style={styles.senderText}>{language === 'sw' ? 'Kutoka:' : 'From:'} {item.sender}</Text>
      <Text style={[styles.messageText, { color: '#000'  }]} numberOfLines={2}>
        {item.message}
      </Text>
      <View style={styles.resultRow}>
        <Text style={styles.resultText}>{item.result.is_spam ? (language === 'sw' ? 'Utapeli' : 'Spam') : (language === 'sw' ? 'Salama' : 'Safe')}</Text>
        <Text style={styles.confidenceText}>{item.result.confidence.toFixed(1)}%</Text>
      </View>
      <Text style={[styles.timestampText, { color: dark ? '#ccc' : '#666' }]}>{new Date(item.timestamp).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: dark ? '#000' : '#fff' }]}>
      {history.length > 0 ? (
        <>
          <FlatList data={history} renderItem={renderItem} keyExtractor={item => item.timestamp} contentContainerStyle={styles.list} />
          <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
            <Text style={styles.clearButtonText}>{language === 'sw' ? 'Futa Historia' : 'Clear History'}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={[styles.emptyText, { color: dark ? '#fff' : '#000' }]}>{language === 'sw' ? 'Hakuna historia bado' : 'No history yet'}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 20 },
  historyItem: { padding: 15, borderRadius: 8, marginBottom: 10 },
  senderText: { fontSize: 14, fontWeight: '600', marginBottom: 4, fontStyle: 'italic' },
  messageText: { fontSize: 16, marginBottom: 5 },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  resultText: { fontSize: 14, fontWeight: '600' },
  confidenceText: { fontSize: 14, opacity: 0.8 },
  timestampText: { fontSize: 12, opacity: 0.6 },
  clearButton: { margin: 20, padding: 15, backgroundColor: '#ff5252', borderRadius: 8, alignItems: 'center' },
  clearButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, opacity: 0.6 },
});
