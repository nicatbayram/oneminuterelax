import * as Notifications from 'expo-notifications';
import { getCurrentLanguage, getTexts } from './languageHelper'; 
// Not: Bunlar bizim kendi helper fonksiyonlarımız olacak, dil ve metni almak için.
// Eğer yoksa, dil bilgisini asyncStorage'dan veya context'ten çekme yoluna gidebiliriz.

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

  // Yardımcı: AsyncStorage'dan dil çekip metni dönen fonksiyon (örnek)
  async getLocalizedTexts() {
    try {
      const lang = await getCurrentLanguage(); // Örn: AsyncStorage.getItem('language') veya context'ten al
      const texts = getTexts(lang); // texts objesi içinden seçilen dilde metinleri al
      return texts;
    } catch {
      return getTexts('tr'); // default Türkçe
    }
  }

  async scheduleDailyReminder(hour = 18, minute = 0) {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return false;

    const texts = await this.getLocalizedTexts();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: texts.info?.version?.startsWith('📱') ? texts.welcome.title : '1 Dakika Rahatlama',
        body: texts.welcome?.subtitle || 'Bugün 1 dakikanı ayırdın mı? 🧘‍♂️',
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
