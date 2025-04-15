// PurchaseModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

type PurchaseModalProps = {
  visible: boolean;
  onConfirm: (rememberedBag: boolean, bagCount: number) => void;
  onCancel: () => void;
};

const PurchaseModal: React.FC<PurchaseModalProps> = ({ visible, onConfirm, onCancel }) => {
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme] || Colors.light;

  // Use null to represent "no selection yet"
  const [bagChoice, setBagChoice] = useState<boolean | null>(null);
  const [bagCount, setBagCount] = useState<string>('0');

  // Reset the internal state when the modal is shown
  useEffect(() => {
    if (visible) {
      setBagChoice(null);
      setBagCount('0');
    }
  }, [visible]);

  const handleConfirm = () => {
    const count = bagChoice ? Number(bagCount) : 0;
    onConfirm(bagChoice!, count);
  };

  return (
    <Modal 
      transparent 
      visible={visible} 
      animationType="fade" 
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: theme.card }]}>
          {/* Cancel button in top right */}
          <TouchableOpacity style={styles.closeButton} onPress={onCancel}>
            <Text style={[styles.closeText, { color: theme.text }]}>×</Text>
          </TouchableOpacity>

          <Text style={[styles.title, { color: theme.text }]}>Bekreft Kjøp</Text>
          <Text style={[styles.description, { color: theme.text }]}>Husket du å ta med pose?</Text>

          <View style={styles.choiceContainer}>
            <TouchableOpacity 
              style={[
                styles.choiceButton, 
                { backgroundColor: colorScheme === 'dark' ? '#333' : '#ccc' },
                bagChoice === true && { backgroundColor: theme.primary }
              ]} 
              onPress={() => setBagChoice(true)}
            >
              <Text style={[styles.choiceText, { color: 'white' }]}>Ja</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.choiceButton, 
                { backgroundColor: colorScheme === 'dark' ? '#333' : '#ccc' },
                bagChoice === false && { backgroundColor: theme.primary }
              ]} 
              onPress={() => setBagChoice(false)}
            >
              <Text style={[styles.choiceText, { color: 'white' }]}>Nei</Text>
            </TouchableOpacity>
          </View>

          {/* If user chose "Ja", display input for the number of bags */}
          {bagChoice === true && (
            <>
              <Text style={[styles.description, { color: theme.text }]}>Hvor mange poser tok du med?</Text>
              <TextInput
                style={[styles.input, { borderColor: colorScheme === 'dark' ? '#888' : 'gray', color: theme.text }]}
                keyboardType="number-pad"
                value={bagCount}
                onChangeText={setBagCount}
                placeholder="Antall poser"
                placeholderTextColor={colorScheme === 'dark' ? '#bbb' : '#888'}
              />
            </>
          )}

          {/* Only show the confirm button once a choice is made */}
          {bagChoice !== null && (
            <TouchableOpacity style={[styles.confirmButton, { backgroundColor: theme.primary }]} onPress={handleConfirm}>
              <Text style={[styles.confirmButtonText, { color: 'white' }]}>Bekreft</Text>
            </TouchableOpacity>
          )}
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
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  closeText: {
    fontSize: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    marginBottom: 12,
    textAlign: 'center',
  },
  choiceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  choiceButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 6,
    alignItems: 'center',
  },
  choiceText: {
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmButton: {
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  confirmButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PurchaseModal;
