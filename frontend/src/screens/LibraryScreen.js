import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { storyAPI } from '../services/api';

export default function LibraryScreen({ navigation }) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);

  const GENRES = ['All', 'Fantasy', 'Romance', 'Sci-Fi', 'Horror', 'Thriller', 'Mystery', 'Adventure', 'Drama'];

  useEffect(() => {
    loadStories();
  }, [selectedGenre]);

  const loadStories = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedGenre && selectedGenre !== 'All') {
        params.genre = selectedGenre;
      }
      const response = await storyAPI.getAllStories(params);
      setStories(response.data.stories);
    } catch (error) {
      console.error('Failed to load stories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Story Library</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.genreFilter}
      >
        {GENRES.map(genre => (
          <TouchableOpacity
            key={genre}
            style={[
              styles.genreChip,
              (selectedGenre === genre || (genre === 'All' && !selectedGenre)) && styles.genreChipSelected
            ]}
            onPress={() => setSelectedGenre(genre === 'All' ? null : genre)}
          >
            <Text style={[
              styles.genreText,
              (selectedGenre === genre || (genre === 'All' && !selectedGenre)) && styles.genreTextSelected
            ]}>
              {genre}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.storiesList}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadStories} />
        }
      >
        {stories.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No stories found</Text>
            <Text style={styles.emptySubtext}>Be the first to create one!</Text>
          </View>
        ) : (
          stories.map(story => (
            <TouchableOpacity
              key={story.id}
              style={styles.storyCard}
              onPress={() => navigation.navigate('StoryDetail', { storyId: story.id })}
            >
              <View style={styles.storyHeader}>
                <Text style={styles.storyTitle}>{story.title}</Text>
                <Text style={styles.storyGenre}>{story.genre}</Text>
              </View>
              
              {story.description && (
                <Text style={styles.storyDescription} numberOfLines={2}>
                  {story.description}
                </Text>
              )}
              
              <View style={styles.storyFooter}>
                <Text style={styles.storyAuthor}>by {story.author_username}</Text>
                <View style={styles.storyStats}>
                  <Text style={styles.stat}>❤️ {story.likes_count || 0}</Text>
                  <Text style={styles.stat}>💬 {story.comments_count || 0}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 10,
    color: '#6200ee',
  },
  genreFilter: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    maxHeight: 50,
  },
  genreChip: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  genreChipSelected: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee',
  },
  genreText: {
    color: '#333',
  },
  genreTextSelected: {
    color: 'white',
  },
  storiesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  storyCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  storyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  storyGenre: {
    fontSize: 12,
    color: '#6200ee',
    backgroundColor: '#e8e0ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  storyDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  storyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  storyAuthor: {
    fontSize: 13,
    color: '#888',
  },
  storyStats: {
    flexDirection: 'row',
  },
  stat: {
    fontSize: 13,
    color: '#666',
    marginLeft: 15,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
  },
});
