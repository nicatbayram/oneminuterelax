import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { colors } from '../constants/colors';
import { texts } from '../constants/texts';

const { width } = Dimensions.get('window');

const SOUND_FILES = {
  ocean: require('../../assets/sounds/ocean.mp3'),
  forest: require('../../assets/sounds/forest.mp3'),
  none: null,
};

export default function BreathingScreen({ navigation }) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [isBreathingIn, setIsBreathingIn] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentSound, setCurrentSound] = useState('ocean');
  const [language, setLanguage] = useState('tr');
  const t = texts[language]?.breathing || texts['tr'].breathing;

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const sound = useRef(null);

  useEffect(() => {
    loadLanguage();
    loadSoundSettings();
    return () => {
      if (sound.current) sound.current.unloadAsync();
    };
  }, []);

  const loadLanguage = async () => {
    try {
      const storedLang = await AsyncStorage.getItem('language');
      if (storedLang) setLanguage(storedLang);
    } catch (err) {
      console.log('Dil ayarı yüklenemedi:', err);
    }
  };

  const loadSoundSettings = async () => {
    try {
      const savedSound = await AsyncStorage.getItem('backgroundSound');
      if (savedSound) {
        setCurrentSound(savedSound);
      }

      if (savedSound !== 'none') {
        await loadAndPlaySound(savedSound || 'ocean');
      }
    } catch (error) {
      console.log('Ses ayarları yüklenirken hata:', error);
    }
  };

  const loadAndPlaySound = async (soundType) => {
    try {
      if (sound.current) await sound.current.unloadAsync();

      if (soundType === 'none' || !SOUND_FILES[soundType]) return;

      const { sound: newSound } = await Audio.Sound.createAsync(
        SOUND_FILES[soundType],
        {
          shouldPlay: true,
          isLooping: true,
          volume: 0.3,
        }
      );
      sound.current = newSound;
    } catch (error) {
      console.log('Ses yükleme hatası:', error);
      Alert.alert('Ses Hatası', 'Arka plan sesi yüklenirken bir hata oluştu.');
    }
  };

  const toggleSound = async () => {
    try {
      if (soundEnabled && sound.current) {
        await sound.current.pauseAsync();
        setSoundEnabled(false);
      } else if (!soundEnabled && sound.current) {
        await sound.current.playAsync();
        setSoundEnabled(true);
      }
    } catch (error) {
      console.log('Ses kontrolü hatası:', error);
    }
  };

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          if (sound.current) sound.current.pauseAsync();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;
    const breathingInterval = setInterval(() => {
      setIsBreathingIn((prev) => !prev);
    }, 4000);
    return () => clearInterval(breathingInterval);
  }, [isActive]);

  useEffect(() => {
    const animateCircle = () => {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: isBreathingIn ? 1.3 : 0.8,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: isBreathingIn ? 0.8 : 1,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]).start();
    };

    if (isActive) {
      animateCircle();
    }
  }, [isBreathingIn, isActive]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinish = async () => {
    setIsActive(false);
    if (sound.current) {
      await sound.current.stopAsync();
    }
    navigation.goBack();
  };

  const getSoundLabel = () => {
    const labels = texts[language]?.settings?.sounds || texts['tr'].settings.sounds;
    return currentSound === 'none' ? '' : `🎵 ${labels[currentSound]} `;
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.background, colors.backgroundSecondary]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.soundButton} onPress={toggleSound}>
            <Text style={styles.soundIcon}>{soundEnabled ? '🔊' : '🔇'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.circleContainer}>
            <Animated.View
              style={[
                styles.breathingCircle,
                {
                  transform: [{ scale: scaleAnim }],
                  opacity: opacityAnim,
                },
              ]}
            >
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.circleGradient}
              />
            </Animated.View>
          </View>

          <Text style={styles.breathingText}>
            {timeLeft > 0
              ? isBreathingIn
                ? t.breatheIn
                : t.breatheOut
              : t.finished}
          </Text>

          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>

          {currentSound !== 'none' && (
            <Text style={styles.soundInfo}>{getSoundLabel()}</Text>
          )}

          <TouchableOpacity
            style={styles.finishButton}
            onPress={handleFinish}
            activeOpacity={0.7}
          >
            <Text style={styles.finishButtonText}>
              {timeLeft > 0 ? t.finishButton : '✓'}
            </Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 35,
  },
  soundButton: {
    padding: 10,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.textMuted,
  },
  soundIcon: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  circleContainer: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  breathingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  circleGradient: {
    flex: 1,
    borderRadius: 100,
  },
  breathingText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 30,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
    fontFamily: 'monospace',
  },
  soundInfo: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 40,
  },
  finishButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.textMuted,
  },
  finishButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
});
