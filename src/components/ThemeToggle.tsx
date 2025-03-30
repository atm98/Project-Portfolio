import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.div
      className="theme-toggle-container"
      onClick={toggleTheme}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="theme-toggle-track">
        <motion.div
          className="theme-toggle-thumb"
          animate={{
            x: isDark ? 24 : 0,
            backgroundColor: isDark ? '#4a4a4a' : '#ffffff'
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <FontAwesomeIcon
            icon={isDark ? faMoon : faSun}
            className="theme-icon"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}; 