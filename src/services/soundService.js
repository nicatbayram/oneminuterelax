import { Audio } from 'expo-av';

class SoundService {
  constructor() {
    this.sound = null;
    this.isPlaying = false;
  }

  async loadSound(soundFile) {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
      }
      
      const { sound } = await Audio.Sound.createAsync(soundFile);
      this.sound = sound;
      
      await this.sound.setIsLoopingAsync(true);
      await this.sound.setVolumeAsync(0.3);
    } catch (error) {
      console.log('Ses yükleme hatası:', error);
    }
  }

  async playSound() {
    try {
      if (this.sound && !this.isPlaying) {
        await this.sound.playAsync();
        this.isPlaying = true;
      }
    } catch (error) {
      console.log('Ses çalma hatası:', error);
    }
  }

  async stopSound() {
    try {
      if (this.sound && this.isPlaying) {
        await this.sound.stopAsync();
        this.isPlaying = false;
      }
    } catch (error) {
      console.log('Ses durdurma hatası:', error);
    }
  }

  async cleanup() {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
        this.isPlaying = false;
      }
    } catch (error) {
      console.log('Ses temizleme hatası:', error);
    }
  }
}

export default new SoundService();