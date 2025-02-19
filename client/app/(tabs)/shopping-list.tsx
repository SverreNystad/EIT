import { StyleSheet, View, Text, useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';


export default function TabTwoScreen() {
  const colorScheme = useColorScheme() ?? 'light';
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: Colors[colorScheme].background },
        ]}
      >
        <Text style={{ color: Colors[colorScheme].text }}>
          Hello, this is the handleliste Screen!
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
