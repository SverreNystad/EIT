type ThemeColors = {
    text: string;
    background: string;
    tint: string;
    tabIconDefault: string;
    tabIconSelected: string;
    icon: string; 
  };

  const tintColorLight = '#2f95dc';
  const tintColorDark = '#fff';
  
  const Colors: { light: ThemeColors; dark: ThemeColors } = {
    light: {
      text: '#000',
      background: '#fff',
      tint: tintColorLight,
      tabIconDefault: '#ccc',
      tabIconSelected: tintColorLight,
      icon: '#555555',
    },
    dark: {
      text: '#fff',
      background: '#000',
      tint: tintColorDark,
      tabIconDefault: '#ccc',
      tabIconSelected: tintColorDark,
      icon: '#dddddd',
    },
  };

  
  export default Colors;