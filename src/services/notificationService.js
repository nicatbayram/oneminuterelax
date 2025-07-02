import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  async requestPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }

  async scheduleDailyReminder(hour = 18, minute = 0) {
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return false;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '1 Dakika Rahatlama',
        body: 'Bugün 1 dakikanı ayırdın mı? 🧘‍♂️',
        sound: false,
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });

    return true;
  }

  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
}

export default new NotificationService();