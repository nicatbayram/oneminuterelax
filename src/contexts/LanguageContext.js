// contexts/LanguageContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { texts, languages } from '../constants/texts';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const loadLanguage = async () => {
      const storedLang = await AsyncStorage.getItem('appLanguage');
      if (storedLang && Object.keys(texts).includes(storedLang)) {
        setLanguage(storedLang);
      }
    };
    loadLanguage();
  }, []);

  const changeLanguage = async (lang) => {
    if (Object.keys(texts).includes(lang)) {
      await AsyncStorage.setItem('appLanguage', lang);
      setLanguage(lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, texts: texts[language], languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
