# One Minute Relaxation App

A simple meditation and breathing exercise app that helps you take a quick 1-minute break to reduce stress and refocus.

---

## 🌟 Features

- 🧘 **1-Minute Guided Breathing Exercise**
- 🌊 **Multiple Background Sound Options** (Ocean, Forest, None)
- 🔔 **Daily Reminder Notifications**
- 🌐 **Multi-language Support** (English, Turkish)
- 🎨 **Beautiful Animated Breathing Circle**
- ⚙️ **Customizable Settings**

---

## 📱 Screens

### ✅ Welcome Screen

- App introduction
- Start button
- Settings access

### 🌀 Breathing Screen

- Animated breathing circle
- 1-minute countdown timer
- Sound toggle
- Finish button

### ⚙️ Settings Screen

- Language selection
- Notification toggle
- Background sound selection
- App information

---

## 🔧 Technical Details

### 🏗 Built With

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Expo AV](https://docs.expo.dev/versions/latest/sdk/av/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

### 📁 Key Components

- `LanguageContext.js` – Handles language switching and text translations
- `soundService.js` – Manages background sound playback
- `notificationService.js` – Handles daily reminder notifications
- `BreathingScreen.js` – Main breathing exercise with animations
- `SettingsScreen.js` – User preferences configuration

### ⚙️ Configuration

The app configuration is managed in `app.json`, including:

- App name and metadata
- Platform-specific settings (iOS, Android)
- Notification plugin configuration
- Splash screen setup

---

## 🛠 Installation

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```

## 🌐 Localization

The app supports multiple languages via texts.js.

Available Languages

1. English (en)

2. Turkish (tr)

➕ To Add a New Language
Add the new language code to the languages object

Provide the corresponding translated text strings in texts

## 🚀 Future Improvements

Add more breathing exercises

Implement user profiles

Add meditation statistics

Expand language support

Add dark/light theme toggle
