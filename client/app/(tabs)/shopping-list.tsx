import { StyleSheet, View, Text} from 'react-native';
import { useTheme } from '@react-navigation/native';


export default function TabTwoScreen() {
  // Get the current theme colors from React Navigation.
    const { colors } = useTheme();
  
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>
          Hello, this is the handeliste Screen!
        </Text>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
  });
  
