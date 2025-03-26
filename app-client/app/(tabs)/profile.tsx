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
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { getTheme } from '@/constants/Colors';
import * as ImagePicker from 'expo-image-picker';


const STORAGE_KEY = 'userProfileData';

//Below are the English keys we store, plus a mapping to Norwegian labels for display.

// Gender in English and Norwegian
const GENDER_OPTIONS_EN = ['male', 'female'] as const;
const GENDER_LABELS: Record<string, string> = {
  male: 'Mann',
  female: 'Kvinne',
};

const ACTIVITY_OPTIONS_EN = [
  'sedentary',
  'lightly_active',
  'moderately_active',
  'very_active',
  'extra_active',
] as const;
const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: 'Stillesittende',
  lightly_active: 'Lett aktiv',
  moderately_active: 'Moderat aktiv',
  very_active: 'Veldig aktiv',
  extra_active: 'Ekstremt aktiv',
};

const OBJECTIVE_OPTIONS_EN = [
  'weight_loss',
  'muscle_gain',
  'health_maintenance',
] as const;
const OBJECTIVE_LABELS: Record<string, string> = {
  weight_loss: 'Vektnedgang',
  muscle_gain: 'Muskeløkning',
  health_maintenance: 'Vedlikehold',
};

type GenderType = typeof GENDER_OPTIONS_EN[number];
type ActivityType = typeof ACTIVITY_OPTIONS_EN[number];
type ObjectiveType = typeof OBJECTIVE_OPTIONS_EN[number];

// grey bordercolor
const bordercolor="#6a6a6a"

export default function ProfilePage() {
  const colorScheme = useColorScheme() || 'light';
  const theme = getTheme(colorScheme);

  // States 
  const [name, setName] = useState<string>('Demo User'); // or from the auth
  const [gender, setGender] = useState<GenderType>('male');
  const [weight, setWeight] = useState<string>('70');
  const [height, setHeight] = useState<string>('175');
  const [age, setAge] = useState<string>('25');
  const [activity, setActivity] = useState<ActivityType>('sedentary');
  const [objective, setObjective] = useState<ObjectiveType>('weight_loss');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  // Load user data on mount
  useEffect(() => {
    (async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (jsonValue) {
          const storedProfile = JSON.parse(jsonValue);
          if (storedProfile?.name) setName(storedProfile.name);
          if (storedProfile?.gender) setGender(storedProfile.gender);
          if (storedProfile?.weight) setWeight(String(storedProfile.weight));
          if (storedProfile?.height) setHeight(String(storedProfile.height));
          if (storedProfile?.age) setAge(String(storedProfile.age));
          if (storedProfile?.activity) setActivity(storedProfile.activity);
          if (storedProfile?.objective) setObjective(storedProfile.objective);
          if (storedProfile?.profilePicture) {
            setProfilePicture(storedProfile.profilePicture);
          }
        }
      } catch (e) {
        console.log('Failed to load profile data:', e);
      }
    })();
  }, []);

  // Pick image from gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Tillatelse avslått', 'Vi trenger tilgang til galleriet.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const pickedUri = result.assets[0]?.uri;
      if (pickedUri) {
        setProfilePicture(pickedUri);
      }
    }
  };

  // Save profile in AsyncStorage
  const handleSaveProfile = async () => {
    // Basic validations
    const errors: string[] = [];
    const trimmedName = name.trim();
    const trimmedWeight = weight.trim();
    const trimmedHeight = height.trim();
    const trimmedAge = age.trim();

    // Navn
    if (!trimmedName) {
      errors.push('Navn kan ikke være tomt.');
    }

    // Vekt
    const weightNum = Number(trimmedWeight);
    if (!trimmedWeight || isNaN(weightNum)) {
      errors.push('Vekt må være et tall.');
    } else {
      if (weightNum < 20) {
        errors.push('Vekt må være minst 20 kg.');
      } else if (weightNum > 300) {
        errors.push('Vekt kan ikke overstige 300 kg.');
      }
    }

    // Høyde
    const heightNum = Number(trimmedHeight);
    if (!trimmedHeight || isNaN(heightNum)) {
      errors.push('Høyde må være et tall.');
    } else {
      if (heightNum < 100) {
        errors.push('Høyde må være minst 100 cm.');
      } else if (heightNum > 250) {
        errors.push('Høyde kan ikke overstige 250 cm.');
      }
    }

    // Alder
    const ageNum = Number(trimmedAge);
    if (!trimmedAge || isNaN(ageNum)) {
      errors.push('Alder må være et tall.');
    } else {
      if (ageNum < 12) {
        errors.push('Alder må være minst 12 år.');
      } else if (ageNum > 120) {
        errors.push('Alder kan ikke overstige 120 år.');
      }
    }

    // Gyldige engelske keys
    if (!GENDER_OPTIONS_EN.includes(gender)) {
      errors.push('Vennligst velg et gyldig kjønn.');
    }
    if (!ACTIVITY_OPTIONS_EN.includes(activity)) {
      errors.push('Vennligst velg et gyldig aktivitetsnivå.');
    }
    if (!OBJECTIVE_OPTIONS_EN.includes(objective)) {
      errors.push('Vennligst velg et gyldig mål.');
    }

    // Oppsummerer eventuelle feil
    if (errors.length > 0) {
      Alert.alert('Valideringsfeil', errors.join('\n'));
      return;
    }

    try {
      const profileData = {
        name: trimmedName,
        gender, 
        weight: parseFloat(trimmedWeight),
        height: parseFloat(trimmedHeight),
        age: parseInt(trimmedAge, 10),
        activity, 
        objective, 
        profilePicture,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profileData));
      Alert.alert('Profil lagret', 'profil informasjonen er lagret.');
    } catch (err) {
      console.log('Failed to save profile data:', err);
      Alert.alert('Error', 'Failed to save profile data.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: theme.text }]}>Min Profil</Text>

        {/* Profile Picture */}
        <View style={styles.profilePictureContainer}>
          {profilePicture ? (
            <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
          ) : (
            <View style={[styles.placeholderImage, { backgroundColor: theme.primary + '33' }]}>
              <Text style={{ color: theme.text }}>Ingen profilbilde</Text>
            </View>
          )}
          <TouchableOpacity
            style={[styles.changePhotoButton, { backgroundColor: theme.primary }]}
            onPress={pickImage}
          >
            <Text style={[styles.changePhotoButtonText, { color: theme.background }]}>
              Velg bilde
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.label, { color: theme.text }]}>Navn</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.card,
              color: theme.text,
              borderColor: bordercolor,
            },
          ]}
          value={name}
          onChangeText={setName}
          placeholder="F.eks. Ola Nordmann"
          placeholderTextColor={theme.text + '55'}
        />

       
        <Text style={[styles.label, { color: theme.text }]}>Kjønn</Text>
        <View style={styles.row}>
          {GENDER_OPTIONS_EN.map((option) => {
            const norwegianLabel = GENDER_LABELS[option];
            const selected = gender === option;
            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.pickerButton,
                  {
                    backgroundColor: selected ? theme.primary : theme.card,
                    borderColor: bordercolor,
                  },
                ]}
                onPress={() => setGender(option)}
              >
                <Text
                  style={{
                    color: selected ? theme.text : theme.text,
                  }}
                >
                  {norwegianLabel}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Weight */}
        <Text style={[styles.label, { color: theme.text }]}>Vekt (kg)</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.card,
              color: theme.text,
              borderColor: bordercolor,
            },
          ]}
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
          placeholder="F.eks. 73"
          placeholderTextColor={theme.text + '55'}
        />

        {/* Height */}
        <Text style={[styles.label, { color: theme.text }]}>Høyde (cm)</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.card,
              color: theme.text,
              borderColor: bordercolor,
            },
          ]}
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
          placeholder="F.eks. 162"
          placeholderTextColor={theme.text + '55'}
        />

        {/* Age */}
        <Text style={[styles.label, { color: theme.text }]}>Alder</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.card,
              color: theme.text,
              borderColor: bordercolor,
            },
          ]}
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
          placeholder="F.eks. 41"
          placeholderTextColor={theme.text + '55'}
        />

        {/* Activity*/}
        <Text style={[styles.label, { color: theme.text }]}>Aktivitetsnivå</Text>
        <View style={styles.row}>
          {ACTIVITY_OPTIONS_EN.map((option) => {
            const norwegianLabel = ACTIVITY_LABELS[option];
            const selected = activity === option;
            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.pickerButton,
                  {
                    backgroundColor: selected ? theme.primary : theme.card,
                    borderColor: bordercolor,
                  },
                ]}
                onPress={() => setActivity(option)}
              >
                <Text style={{ color: selected ? theme.text : theme.text }}>
                  {norwegianLabel}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Objective*/}
        <Text style={[styles.label, { color: theme.text }]}>Mål</Text>
        <View style={styles.row}>
          {OBJECTIVE_OPTIONS_EN.map((option) => {
            const norwegianLabel = OBJECTIVE_LABELS[option];
            const selected = objective === option;
            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.pickerButton,
                  {
                    backgroundColor: selected ? theme.primary : theme.card,
                    borderColor: bordercolor,
                  },
                ]}
                onPress={() => setObjective(option)}
              >
                <Text style={{ color: selected ? theme.text : theme.text }}>
                  {norwegianLabel}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.primary }]}
          onPress={handleSaveProfile}
        >
          <Text style={[styles.saveButtonText, { color: theme.background }]}>
            Lagre profil
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// STYLING
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    alignSelf: 'center',
    marginTop: 30,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  changePhotoButton: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  changePhotoButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  label: {
    marginTop: 10,
    marginBottom: 6,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    marginBottom: 10,
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
    borderWidth: 1,
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
