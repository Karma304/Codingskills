import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { aiAPI, storyAPI } from '../services/api';

const GENRES = ['Fantasy', 'Romance', 'Sci-Fi', 'Horror', 'Thriller', 'Mystery', 'Adventure', 'Drama'];
const LENGTHS = ['short', 'medium', 'long'];
const STYLES = ['descriptive', 'dialogue-heavy', 'action-packed', 'poetic', 'humorous', 'dark'];
const TONES = ['neutral', 'emotional', 'suspenseful', 'lighthearted', 'serious', 'edgy'];

export default function StoryGeneratorScreen({ navigation }) {
  const [genre, setGenre] = useState('Fantasy');
  const [setting, setSetting] = useState('');
  const [characters, setCharacters] = useState('');
  const [conflict, setConflict] = useState('');
  const [length, setLength] = useState('medium');
  const [style, setStyle] = useState('descriptive');
  const [tone, setTone] = useState('neutral');
  const [plotTwist, setPlotTwist] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!setting) {
      Alert.alert('Error', 'Please provide a setting for your story');
      return;
    }

    setLoading(true);
    try {
      const characterList = characters.split(',').map(c => c.trim()).filter(c => c);
      
      const response = await aiAPI.generateStory({
        genre,
        setting,
        characters: characterList,
        conflict,
        length,
        style,
        tone,
        plotTwist
      });

      const storyData = {
        title: `${genre} Story: ${setting.substring(0, 50)}`,
        description: `A ${genre.toLowerCase()} story set in ${setting}`,
        genre,
        setting,
        characters: characterList,
        content: response.data.content,
        status: 'draft'
      };

      const storyResponse = await storyAPI.createStory(storyData);
      
      Alert.alert(
        'Success!',
        'Your story has been generated and saved as a draft.',
        [
          {
            text: 'View Story',
            onPress: () => navigation.navigate('StoryEditor', { 
              storyId: storyResponse.data.story.id,
              story: storyResponse.data.story
            })
          },
          { text: 'Generate Another' }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to generate story. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Generate Your Story</Text>
      <Text style={styles.subheader}>AI-powered story creation</Text>

      <Text style={styles.label}>Genre *</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
        {GENRES.map(g => (
          <TouchableOpacity
            key={g}
            style={[styles.chip, genre === g && styles.chipSelected]}
            onPress={() => setGenre(g)}
          >
            <Text style={[styles.chipText, genre === g && styles.chipTextSelected]}>{g}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.label}>Setting / World *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Medieval castle, Futuristic city, Haunted mansion"
        value={setting}
        onChangeText={setSetting}
        multiline
      />

      <Text style={styles.label}>Characters (comma-separated)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Sarah the brave knight, Marcus the wise wizard"
        value={characters}
        onChangeText={setCharacters}
        multiline
      />

      <Text style={styles.label}>Central Conflict</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Must save the kingdom from darkness"
        value={conflict}
        onChangeText={setConflict}
        multiline
      />

      <Text style={styles.label}>Story Length</Text>
      <View style={styles.radioGroup}>
        {LENGTHS.map(l => (
          <TouchableOpacity
            key={l}
            style={[styles.radio, length === l && styles.radioSelected]}
            onPress={() => setLength(l)}
          >
            <Text style={[styles.radioText, length === l && styles.radioTextSelected]}>
              {l.charAt(0).toUpperCase() + l.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Writing Style</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
        {STYLES.map(s => (
          <TouchableOpacity
            key={s}
            style={[styles.chip, style === s && styles.chipSelected]}
            onPress={() => setStyle(s)}
          >
            <Text style={[styles.chipText, style === s && styles.chipTextSelected]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.label}>Tone</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
        {TONES.map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.chip, tone === t && styles.chipSelected]}
            onPress={() => setTone(t)}
          >
            <Text style={[styles.chipText, tone === t && styles.chipTextSelected]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => setPlotTwist(!plotTwist)}
      >
        <Text style={styles.checkboxText}>
          {plotTwist ? '☑' : '☐'} Include Plot Twist
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleGenerate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>✨ Generate Story</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#6200ee',
  },
  subheader: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    minHeight: 50,
  },
  chipContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  chip: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  chipSelected: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee',
  },
  chipText: {
    color: '#333',
  },
  chipTextSelected: {
    color: 'white',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  radio: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  radioSelected: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee',
  },
  radioText: {
    color: '#333',
  },
  radioTextSelected: {
    color: 'white',
  },
  checkbox: {
    marginTop: 15,
    marginBottom: 10,
  },
  checkboxText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
