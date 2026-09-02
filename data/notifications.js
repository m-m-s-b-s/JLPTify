import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { vocabList } from './vocab';

// How notifications look when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Ask user for permission
export async function registerForNotifications() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Please enable notifications in your phone settings to get hourly vocab!');
    return false;
  }

  return true;
}

// Schedule hourly notifications
export async function scheduleHourlyNotifications() {
  // Cancel any existing notifications first
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Get a random word index
  const randomIndex = Math.floor(Math.random() * vocabList.length);
  await AsyncStorage.setItem('lastWordIndex', String(randomIndex));

  // Schedule notification every hour
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🇯🇵 Japanese Vocab — JLPTify',
      body: `${vocabList[randomIndex].kanji} (${vocabList[randomIndex].hiragana}) — ${vocabList[randomIndex].meaning}`,
      sound: true,
    },
    trigger: {
      seconds: 3600, // 1 hour
      repeats: true,
    },
  });

  return true;
}

// Cancel all notifications
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}