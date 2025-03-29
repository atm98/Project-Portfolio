export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

export interface Theme {
  colors: ThemeColors;
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
  transitions: {
    default: string;
    fast: string;
    slow: string;
  };
}

export const lightTheme: Theme = {
  colors: {
    primary: '#1976D2', // Material Blue 700
    secondary: '#9C27B0', // Material Purple 500
    background: '#FFFFFF',
    surface: '#F5F5F5', // Material Grey 100
    text: '#212121', // Material Grey 900
    textSecondary: '#757575', // Material Grey 600
    border: '#E0E0E0', // Material Grey 300
    accent: '#FF4081', // Material Pink A200
    error: '#D32F2F', // Material Red 700
    success: '#388E3C', // Material Green 700
    warning: '#FFA000', // Material Amber 700
    info: '#0288D1', // Material Light Blue 700
  },
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.1)',
    medium: '0 4px 8px rgba(0,0,0,0.1)',
    large: '0 8px 16px rgba(0,0,0,0.1)',
  },
  transitions: {
    default: '0.3s ease-in-out',
    fast: '0.15s ease-in-out',
    slow: '0.5s ease-in-out',
  },
};

export const darkTheme: Theme = {
  colors: {
    primary: '#90CAF9', // Material Blue 200
    secondary: '#CE93D8', // Material Purple 200
    background: '#121212', // Material Dark theme background
    surface: '#1E1E1E', // Material Dark theme surface
    text: '#FFFFFF',
    textSecondary: '#B0BEC5', // Material Blue Grey 100
    border: '#424242', // Material Grey 800
    accent: '#FF80AB', // Material Pink A100
    error: '#EF5350', // Material Red 400
    success: '#66BB6A', // Material Green 400
    warning: '#FFB74D', // Material Orange 300
    info: '#4FC3F7', // Material Light Blue 300
  },
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.3)',
    medium: '0 4px 8px rgba(0,0,0,0.3)',
    large: '0 8px 16px rgba(0,0,0,0.3)',
  },
  transitions: {
    default: '0.3s ease-in-out',
    fast: '0.15s ease-in-out',
    slow: '0.5s ease-in-out',
  },
}; 