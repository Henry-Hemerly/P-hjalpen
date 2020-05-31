var PushNotification = require('react-native-push-notification');
import PushNotificationIOS from '@react-native-community/push-notification-ios';

PushNotification.configure({
  onRegister: function(token) {
    console.log('TOKEN:', token);
  },

  onNotification: function(notification) {
    console.log('NOTIFICATION:', notification);
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: true,
});

export function sendNotification(message) {
  PushNotification.localNotification({
    title: 'Påminnelse från P-hjälpen', // (optional)
    message: message, // (required)
  });
}

export function sendScheduledNotification(startTime, min, message) {
  let start = Date.parse(startTime);
  PushNotification.localNotificationSchedule({
    title: 'Dags att flytta bilen?', // (optional)
    message: `Din parkering upphör att vara tillåten. ${message}`, // (required)
    date: new Date(Date.now() + 0.03 * 60000), // use this for demo
    //date: new Date(start - min * 60000) // use this for production
  });
}
