import { useState, useEffect } from 'react';

const DEFAULT_SETTINGS = {
  fontSize: 18,
  fontFamily: 'default',
  theme: 'default',
};

export function useReaderSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('reader-settings');
      return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
    } catch (e) {
      console.warn('Failed to parse reader settings from local storage:', e);
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    localStorage.setItem('reader-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // Generate CSS style object based on current settings
  const getReaderStyles = () => {
    let fontFamily = 'inherit';
    switch (settings.fontFamily) {
      case 'merriweather':
        fontFamily = '"Merriweather", serif';
        break;
      case 'lora':
        fontFamily = '"Lora", serif';
        break;
      case 'roboto':
        fontFamily = '"Roboto", sans-serif';
        break;
      case 'open-sans':
        fontFamily = '"Open Sans", sans-serif';
        break;
      case 'default':
      default:
        fontFamily = 'inherit';
        break;
    }

    let backgroundColor = 'transparent';
    let color = 'inherit';

    switch (settings.theme) {
      case 'sepia':
        backgroundColor = '#f4ecd8';
        color = '#5b4636';
        break;
      case 'dark':
        backgroundColor = '#1e1e20';
        color = '#d4d4d6';
        break;
      case 'eye-care':
        backgroundColor = '#cce8cf';
        color = '#1f3d23';
        break;
      case 'default':
      default:
        // Let the global dark mode / light mode dictate
        break;
    }

    return {
      fontSize: `${settings.fontSize}px`,
      fontFamily,
      backgroundColor,
      color,
      transition: 'background-color 0.3s ease, color 0.3s ease, font-size 0.2s ease',
      // Ensure the container has some padding if a background color is applied
      padding: settings.theme !== 'default' ? '1.5rem' : '0',
      borderRadius: settings.theme !== 'default' ? '0.75rem' : '0',
    };
  };

  return {
    settings,
    updateSetting,
    getReaderStyles,
  };
}
