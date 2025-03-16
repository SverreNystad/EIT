const Colors: Record<'light' | 'dark', { background: string; text: string; primary: string; accent: string; card: string }> = {
  light: {
    background: '#f3f3f3', 
    text: '#1E1E1E',
    primary: '#5A67D8', 
    accent: '#1E1E1E',  
    card: '#ffffff', 
  },
  dark: {
    background: '#121417', // Darker charcoal for depth
    text: '#F5F5F5', // Softer off-white for better readability
    primary: '#C19A6B', // Muted gold for a professional touch
    accent: '#6BBF59', // Softer, premium green instead of harsh neon
    card: '#1B1D22', // Slightly lighter dark shade for layered elements
  },
  };

export const getTheme = (colorScheme: 'light' | 'dark' | null | undefined) => {
  return Colors[colorScheme ?? 'light']; // Default to 'light' if undefined
};

export default Colors;