const Colors: Record<'light' | 'dark', { background: string; text: string; primary: string; accent: string; card: string }> = {
  light: {
    background: '#ead8c0', 
    text: '#1E1E1E',
    primary: '#5A67D8', // 🟣 Muted purple for modern look
    accent: '#1E1E1E',  // 🟠 Orange for better highlights
    card: '#fff2e1', // ✅ Light for contrast
  },
  dark: {
    background: '#121212', // ✅ True dark mode
    text: '#EAEAEA',
    primary: '#5A67D8',  
    accent: '#4cbb17',  
    card: '#1E1E1E', // ✅ Contrast with background
  },
  };

export const getTheme = (colorScheme: 'light' | 'dark' | null | undefined) => {
  return Colors[colorScheme ?? 'light']; // Default to 'light' if undefined
};

export default Colors;