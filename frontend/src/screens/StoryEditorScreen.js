import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { storyAPI } from '../services/api';

export default function StoryEditorScreen({ route, navigation }) {
  const { storyId, story: initialStory } = route.params || {};
  
  const [story, setStory] = useState(initialStory || {});
  const [title, setTitle] = useState(story.title || '');
  const [description, setDescription] = useState(story.description || '');
  const [content, setContent] = useState(story.content || '');
  const [status, setStatus] = useState(story.status || 'draft');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (storyId && !initialStory) {
      loadStory();
    }
  }, [storyId]);

  const loadStory = async () => {
    try {
      const response = await storyAPI.getStory(storyId);
      const storyData = response.data.story;
      setStory(storyData);
      setTitle(storyData.title);
      setDescription(storyData.description);
      setContent(storyData.content);
      setStatus(storyData.status);
    } catch (error) {
      Alert.alert('Error', 'Failed to load story');
      navigation.goBack();
    }
  };

  const handleSave = async () => {
    if (!title || !content) {
      Alert.alert('Error', 'Title and content are required');
      return;
    }

    setLoading(true);
    try {
      await storyAPI.updateStory(storyId, {
        title,
        description,
        content,
        status
      });
      Alert.alert('Success', 'Story saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save story');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!title || !content) {
      Alert.alert('Error', 'Title and content are required');
      return;
    }

    Alert.alert(
      'Publish Story',
      'Are you sure you want to publish this story? It will be visible to everyone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Publish',
          onPress: async () => {
            setLoading(true);
            try {
              await storyAPI.updateStory(storyId, {
                title,
                description,
                content,
                status: 'published'
              });
              setStatus('published');
              Alert.alert('Success', 'Story published successfully!');
              navigation.navigate('Home');
            } catch (error) {
              Alert.alert('Error', 'Failed to publish story');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Story Editor</Text>
      
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter story title"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Brief description of your story"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
      />

      <Text style={styles.label}>Content</Text>
      <TextInput
        style={[styles.input, styles.contentArea]}
        placeholder="Write your story here..."
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={15}
      />

      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status: </Text>
        <Text style={[styles.statusText, status === 'published' ? styles.published : styles.draft]}>
          {status.toUpperCase()}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.buttonText}>💾 Save Draft</Text>
        </TouchableOpacity>

        {status === 'draft' && (
          <TouchableOpacity
            style={[styles.publishButton, loading && styles.buttonDisabled]}
            onPress={handlePublish}
            disabled={loading}
          >
            <Text style={styles.buttonText}>🚀 Publish</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.wordCount}>
        Word count: {content.split(/\s+/).filter(w => w).length}
      </Text>
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
    marginBottom: 20,
    color: '#6200ee',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  contentArea: {
    minHeight: 300,
    textAlignVertical: 'top',
    fontFamily: 'monospace',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  statusLabel: {
    fontSize: 16,
    color: '#666',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  draft: {
    color: '#ff9800',
  },
  published: {
    color: '#4caf50',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#03dac6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
  },
  publishButton: {
    flex: 1,
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  wordCount: {
    marginTop: 15,
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
});
