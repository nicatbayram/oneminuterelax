import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Switch,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../constants/colors';
import { texts } from '../constants/texts';

export default function SettingsScreen({ navigation }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [selectedSound, setSelectedSound] = useState('ocean');

  // Load settings from storage
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const notifications = await AsyncStorage.getItem('notifications');
      const sound = await AsyncStorage.getItem('backgroundSound');
      
      console.log('Yüklenen ayarlar:', { notifications, sound });
      
      if (notifications !== null) {
        setNotificationsEnabled(JSON.parse(notifications));
      }
      if (sound !== null) {
        setSelectedSound(sound); // String olarak kaydettiğimiz için direkt kullan
      }
    } catch (error) {
      console.log('Ayarlar yüklenirken hata:', error);
    }
  };

  const saveSettings = async (key, value) => {
    try {
      const valueToSave = typeof value === 'string' ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, valueToSave);
      console.log(`Ayar kaydedildi: ${key} = ${valueToSave}`);
    } catch (error) {
      console.log('Ayarlar kaydedilirken hata:', error);
    }
  };

  const toggleNotifications = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    saveSettings('notifications', newValue);
    
    // TODO: Implement notification scheduling
    console.log('Bildirimler:', newValue ? 'Açık' : 'Kapalı');
  };

  const selectSound = (soundType) => {
    setSelectedSound(soundType);
    saveSettings('backgroundSound', soundType);
    console.log('Seçilen ses:', soundType);
  };

  const soundOptions = [
    { key: 'ocean', label: texts.settings.sounds.ocean },
    { key: 'forest', label: texts.settings.sounds.forest },
    { key: 'none', label: texts.settings.sounds.none },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.background, colors.backgroundSecondary]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{texts.settings.title}</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Notification Setting */}
          <View style={styles.settingSection}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingIcon}>🔔</Text>
                <Text style={styles.settingLabel}>{texts.settings.notifications}</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ false: colors.textMuted, true: colors.primary }}
                thumbColor={notificationsEnabled ? colors.text : colors.textSecondary}
              />
            </View>
            <Text style={styles.settingDescription}>
              Günlük hatırlatma bildirimi al
            </Text>
          </View>

          {/* Sound Setting */}
          <View style={styles.settingSection}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingIcon}>🔊</Text>
              <Text style={styles.settingLabel}>{texts.settings.backgroundSound}</Text>
            </View>
            
            {soundOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={styles.soundOption}
                onPress={() => selectSound(option.key)}
                activeOpacity={0.7}
              >
                <View style={styles.radioContainer}>
                  <View style={[
                    styles.radioButton,
                    selectedSound === option.key && styles.radioButtonSelected
                  ]}>
                    {selectedSound === option.key && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                  <Text style={styles.soundLabel}>{option.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* App Info */}
          <View style={styles.infoSection}>
            <Text style={styles.infoText}>
              📱 1 Dakika Rahatlama v1.0.0
            </Text>
            <Text style={styles.infoSubtext}>
              Günlük stresini azalt, kendine zaman ayır.
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 55,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundSecondary,
  },
  backButton: {
  width: 40,
  height: 40,
  borderRadius: 22,
  borderWidth: 0.5,
  borderColor: colors.primary,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'transparent',
  },
  backIcon: {
  fontSize: 24,
  color: colors.primary,
  fontWeight: 'bold',
  textAlign: 'center',
  paddingBottom: 8, // Adjust for better vertical centering
},

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  placeholder: {
    width: 44, // Same width as back button for centering
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  settingSection: {
    marginBottom: 30,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 15,
    padding: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 32,
  },
  soundOption: {
    paddingVertical: 12,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.textMuted,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  soundLabel: {
    fontSize: 16,
    color: colors.text,
  },
  infoSection: {
    alignItems: 'center',
    paddingVertical: 30,
    marginTop: 20,
  },
  infoText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  infoSubtext: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
});