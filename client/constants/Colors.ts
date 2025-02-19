/** Type that tells which color properties every theme must include */
type ThemeColors = {
    text: string; 
    background: string;
    iconActive: string;     // Color for icons when they are selected/active.
    iconInactive: string;   // Color for icons when they are not selected/inactive.
  };
  
  /** Color objects for dark and white theme */
  const Colors: { light: ThemeColors; dark: ThemeColors } = {
    light: {
      text: '#000',
      background: '#fff',
      iconInactive: '#ccc',
      iconActive: '0000FF',
    },
    dark: {
      text: '#fff',
      background: '#000',
      iconInactive: '#ccc',
      iconActive: '#fff',
    },
  };


  export default Colors;