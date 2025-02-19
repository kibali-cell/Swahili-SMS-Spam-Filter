import React, { createContext, useState } from 'react';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Default language is Swahili ('sw'); change to 'en' for English
  const [language, setLanguage] = useState('sw');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'sw' ? 'en' : 'sw'));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
