import { Platform } from 'react-native';
import { MD3LightTheme as PaperDefaultTheme } from 'react-native-paper';

export const Fonts = {
  mono: Platform.select({
    ios: 'Courier',
    android: 'monospace',
    default: 'monospace',
  }),
};

export const Spacing = {
  half: 4,
  two: 8,
  five: 20,
};

export const theme = {
  ...PaperDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    primary: '#10B981',
    primaryContainer: '#10B981',
    onPrimaryContainer: '#ffffff',
  },
};

export type ThemeColor = keyof typeof theme.colors;
