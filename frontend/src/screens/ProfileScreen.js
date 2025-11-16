import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { storyAPI } from '../services/api';

export default function ProfileScreen({ navigation }) {
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMyStories();
  }, []);

  const loadMyStories = async () => {
    setLoading(true);
    try {
      const response = await storyAPI.getMyStories();
      setStories(response.data.stories);
    } catch (error) {
      console.error('Failed to load stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStoryStats = () => {
    const published = stories.filter(s => s.status === 'published').length;
    const drafts = stories.filter(s => s.status === 'draft').length;
    const totalLikes = stories.reduce((sum, s) => sum + (parseInt(s.likes_count) || 0), 0);
    const totalComments = stories.reduce((sum, s) => sum + (parseInt(s.comments_count) || 0), 0);

    return { published, drafts, totalLikes, totalComments };
  };

  const stats = getStoryStats();

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={loadMyStories} />
      }
    >
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.username?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.published}</Text>
          <Text style={styles.statLabel}>Published</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.drafts}</Text>
          <Text style={styles.statLabel}>Drafts</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.totalLikes}</Text>
          <Text style={styles.statLabel}>Likes</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.totalComments}</Text>
          <Text style={styles.statLabel}>Comments</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Stories ({stories.length})</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('StoryGenerator')}
          >
            <Text style={styles.addButton}>+ New</Text>
          </TouchableOpacity>
        </View>

        {stories.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No stories yet</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate('StoryGenerator')}
            >
              <Text style={styles.createButtonText}>Create Your First Story</Text>
            </TouchableOpacity>
          </View>
        ) : (
          stories.map(story => (
            <TouchableOpacity
              key={story.id}
              style={styles.storyCard}
              onPress={() => navigation.navigate('StoryDetail', { storyId: story.id })}
            >
              <View style={styles.storyHeader}>
                <Text style={styles.storyTitle} numberOfLines={1}>
                  {story.title}
                </Text>
                <View style={[
                  styles.statusBadge,
                  story.status === 'published' ? styles.publishedBadge : styles.draftBadge
                ]}>
                  <Text style={styles.statusText}>
                    {story.status === 'published' ? '🌐' : '📝'} {story.status}
                  </Text>
                </View>
              </View>
              
              {story.description && (
                <Text style={styles.storyDescription} numberOfLines={2}>
                  {story.description}
                </Text>
              )}
              
              <View style={styles.storyFooter}>
                <Text style={styles.storyGenre}>{story.genre}</Text>
                <View style={styles.storyStats}>
                  <Text style={styles.stat}>❤️ {story.likes_count || 0}</Text>
                  <Text style={styles.stat}>💬 {story.comments_count || 0}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.editLink}
                onPress={() => navigation.navigate('StoryEditor', { storyId: story.id, story })}
              >
                <Text style={styles.editLinkText}>✏️ Edit</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    backgroundColor: '#6200ee',
    alignItems: 'center',
    padding: 30,
    paddingTop: 40,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#e0e0e0',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginTop: -20,
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    fontSize: 16,
    color: '#6200ee',
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#6200ee',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  publishedBadge: {
    backgroundColor: '#e8f5e9',
  },
  draftBadge: {
    backgroundColor: '#fff3e0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
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
    marginBottom: 10,
  },
  storyGenre: {
    fontSize: 12,
    color: '#6200ee',
    backgroundColor: '#e8e0ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  storyStats: {
    flexDirection: 'row',
  },
  stat: {
    fontSize: 13,
    color: '#666',
    marginLeft: 15,
  },
  editLink: {
    alignSelf: 'flex-end',
  },
  editLinkText: {
    color: '#6200ee',
    fontSize: 14,
    fontWeight: '600',
  },
});
