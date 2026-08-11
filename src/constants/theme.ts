import { Platform } from 'react-native';
import { MD3LightTheme as PaperDefaultTheme, MD3DarkTheme as PaperDarkTheme } from 'react-native-paper';

export const Fonts = {
  mono: Platform.select({
    ios: 'Courier',
    android: 'monospace',
    default: 'monospace',
  }),
};

export const Spacing = {
  half: 4,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  six: 24,
};

export const BottomTabInset = 80;
export const MaxContentWidth = 800;

const customColors = {
  primary: '#10B981',
  primaryContainer: '#10B981',
  onPrimaryContainer: '#ffffff',
};

export const theme = {
  ...PaperDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...customColors,
    text: PaperDefaultTheme.colors.onSurface,
    textSecondary: PaperDefaultTheme.colors.onSurfaceVariant,
    backgroundElement: PaperDefaultTheme.colors.surfaceVariant,
    backgroundSelected: PaperDefaultTheme.colors.primaryContainer,
  },
};

export const Colors = {
  light: theme.colors,
  dark: {
    ...PaperDarkTheme.colors,
    ...customColors,
    text: PaperDarkTheme.colors.onSurface,
    textSecondary: PaperDarkTheme.colors.onSurfaceVariant,
    backgroundElement: PaperDarkTheme.colors.surfaceVariant,
    backgroundSelected: PaperDarkTheme.colors.primaryContainer,
  },
};

export type ThemeColor = Exclude<keyof typeof theme.colors, 'elevation'>;
