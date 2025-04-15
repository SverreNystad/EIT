// ReminderModal.tsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

type ReminderModalProps = {
  visible: boolean;
  onDismiss: () => void;
};

const ReminderModal: React.FC<ReminderModalProps> = ({ visible, onDismiss }) => {
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme] || Colors.light;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.message, { color: theme.text }]}>
            Husk pose: Ta med pose for å redusere plastforbruket!
          </Text>
          <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={onDismiss}>
            <Text style={[styles.buttonText, { color: 'white' }]}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    borderRadius: 8,
    elevation: 5,
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    padding: 10,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
  },
});

export default ReminderModal;
