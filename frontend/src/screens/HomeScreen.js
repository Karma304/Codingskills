import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function HomeScreen({ navigation }) {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>StoryVerse</Text>
        <Text style={styles.subtitle}>Deine Story. Dein Universum.</Text>
        <Text style={styles.tagline}>Von dir + AI erschaffen</Text>
      </View>

      {isAuthenticated ? (
        <View style={styles.content}>
          <Text style={styles.welcome}>Welcome back, {user?.username}!</Text>
          
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('StoryGenerator')}
          >
            <Text style={styles.buttonText}>✨ Generate New Story</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Library')}
          >
            <Text style={styles.buttonText}>📚 Browse Library</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.buttonText}>👤 My Profile & Stories</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={logout}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.description}>
            Create personalized stories with AI assistance. Write, edit, publish, and share your creative works with the community.
          </Text>

          <View style={styles.features}>
            <Text style={styles.featureTitle}>Features:</Text>
            <Text style={styles.feature}>✅ AI Story Generator</Text>
            <Text style={styles.feature}>✅ Rich Story Editor</Text>
            <Text style={styles.feature}>✅ Chapter Management</Text>
            <Text style={styles.feature}>✅ Publish & Share</Text>
            <Text style={styles.feature}>✅ Community Interaction</Text>
            <Text style={styles.feature}>✅ Likes & Comments</Text>
          </View>

          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Library')}
          >
            <Text style={styles.buttonText}>Browse Stories</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#6200ee',
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 5,
  },
  tagline: {
    fontSize: 14,
    color: '#e0e0e0',
    fontStyle: 'italic',
  },
  content: {
    padding: 20,
  },
  welcome: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  features: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  feature: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  primaryButton: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#03dac6',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#cf6679',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
