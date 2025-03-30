import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme, lightTheme, darkTheme } from '../theme/theme';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Check if user has manually set a preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // If no manual preference, use system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const theme = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    // Apply theme
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    Object.entries(theme.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [isDark, theme]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    // Save user preference when manually toggled
    localStorage.setItem('theme', !isDark ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 