import * as Notifications from 'expo-notifications';


export async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function getExpoPushToken() {
  let token;
  if (await requestNotificationPermission()) {
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Push Token:', token);
  }
  return token;
}
