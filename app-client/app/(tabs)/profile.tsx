import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { getTheme } from '@/constants/Colors';

// Keys for AsyncStorage
const STORAGE_KEY = 'userProfileData';

// Example values for the pickers
const GENDER_OPTIONS = ['male', 'female'];
const ACTIVITY_OPTIONS = [
  'sedentary',
  'lightly_active',
  'moderately_active',
  'very_active',
  'extra_active',
];
const OBJECTIVE_OPTIONS = ['weight_loss', 'muscle_gain', 'health_maintenance'];

export default function ProfilePage() {
  const colorScheme = useColorScheme() || 'light';
  const theme = getTheme(colorScheme);

  // Form states (example)
  const [gender, setGender] = useState('male');
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('175');
  const [age, setAge] = useState('25');
  const [activity, setActivity] = useState('sedentary');
  const [objective, setObjective] = useState('weight_loss');

  // Load user data on mount
  useEffect(() => {
    (async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (jsonValue) {
          const storedProfile = JSON.parse(jsonValue);
          if (storedProfile?.gender) setGender(storedProfile.gender);
          if (storedProfile?.weight) setWeight(String(storedProfile.weight));
          if (storedProfile?.height) setHeight(String(storedProfile.height));
          if (storedProfile?.age) setAge(String(storedProfile.age));
          if (storedProfile?.activity) setActivity(storedProfile.activity);
          if (storedProfile?.objective) setObjective(storedProfile.objective);
        }
      } catch (e) {
        console.log('Failed to load profile data:', e);
      }
    })();
  }, []);

  // Save data to AsyncStorage
  const handleSaveProfile = async () => {
    try {
      const profileData = {
        gender,
        weight: parseFloat(weight),
        height: parseFloat(height),
        age: parseInt(age, 10),
        activity,
        objective,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profileData));
      Alert.alert('Profile saved', 'Your profile information has been saved.');
    } catch (error) {
      console.log('Failed to save profile data:', error);
      Alert.alert('Error', 'Failed to save profile data.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: theme.text }]}>My Profile</Text>

        {/* Gender */}
        <Text style={[styles.label, { color: theme.text }]}>Gender</Text>
        <View style={styles.row}>
          {GENDER_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.pickerButton,
                {
                  backgroundColor:
                    gender === option ? theme.primary : theme.background,
                },
              ]}
              onPress={() => setGender(option)}
            >
              <Text
                style={{
                  color: gender === option ? theme.background : theme.text,
                }}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Weight */}
        <Text style={[styles.label, { color: theme.text }]}>Weight (kg)</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.background, color: theme.text },
          ]}
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />

        {/* Height */}
        <Text style={[styles.label, { color: theme.text }]}>Height (cm)</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.background, color: theme.text },
          ]}
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
        />

        {/* Age */}
        <Text style={[styles.label, { color: theme.text }]}>Age</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.background, color: theme.text },
          ]}
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />

        {/* Activity Level */}
        <Text style={[styles.label, { color: theme.text }]}>
          Activity Intensity
        </Text>
        <View style={styles.row}>
          {ACTIVITY_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.pickerButton,
                {
                  backgroundColor:
                    activity === option ? theme.primary : theme.background,
                },
              ]}
              onPress={() => setActivity(option)}
            >
              <Text
                style={{
                  color: activity === option ? theme.background : theme.text,
                }}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Objective */}
        <Text style={[styles.label, { color: theme.text }]}>Objective</Text>
        <View style={styles.row}>
          {OBJECTIVE_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.pickerButton,
                {
                  backgroundColor:
                    objective === option ? theme.primary : theme.background,
                },
              ]}
              onPress={() => setObjective(option)}
            >
              <Text
                style={{
                  color: objective === option ? theme.background : theme.text,
                }}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.primary }]}
          onPress={handleSaveProfile}
        >
          <Text style={[styles.saveButtonText, { color: theme.background }]}>
            Save Profile
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    marginTop: 20,
    marginBottom: 6,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pickerButton: {
    marginRight: 8,
    marginVertical: 4,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  saveButton: {
    marginTop: 30,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
