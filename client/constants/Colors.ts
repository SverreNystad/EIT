const Colors: Record<'light' | 'dark', { background: string; text: string; primary: string; card: string }> = {
  light: {
    background: '#ffffff',
    text: '#000000',
    primary: '#007AFF',
    card: '#f8f9fa',
  },
  dark: {
    background: '#121212',
    text: '#ffffff',
    primary: '#0A84FF',
    card: '#1e1e1e',
  },
};

export const getTheme = (colorScheme: 'light' | 'dark' | null | undefined) => {
  return Colors[colorScheme ?? 'light']; // Default to 'light' if undefined
};

export default Colors;