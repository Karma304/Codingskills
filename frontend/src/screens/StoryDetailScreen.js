import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { storyAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function StoryDetailScreen({ route, navigation }) {
  const { storyId } = route.params;
  const { isAuthenticated, user } = useAuth();
  
  const [story, setStory] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoryDetails();
  }, [storyId]);

  const loadStoryDetails = async () => {
    setLoading(true);
    try {
      const [storyResponse, commentsResponse] = await Promise.all([
        storyAPI.getStory(storyId),
        storyAPI.getComments(storyId)
      ]);
      setStory(storyResponse.data.story);
      setComments(commentsResponse.data.comments);
    } catch (error) {
      Alert.alert('Error', 'Failed to load story');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please login to like stories');
      return;
    }

    try {
      if (isLiked) {
        await storyAPI.unlikeStory(storyId);
        setIsLiked(false);
        setStory({ ...story, likes_count: (story.likes_count || 1) - 1 });
      } else {
        await storyAPI.likeStory(storyId);
        setIsLiked(true);
        setStory({ ...story, likes_count: (story.likes_count || 0) + 1 });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update like');
    }
  };

  const handleAddComment = async () => {
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please login to comment');
      return;
    }

    if (!newComment.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }

    try {
      await storyAPI.addComment(storyId, newComment);
      setNewComment('');
      loadStoryDetails();
    } catch (error) {
      Alert.alert('Error', 'Failed to add comment');
    }
  };

  if (loading || !story) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{story.title}</Text>
        <Text style={styles.author}>by {story.author_username}</Text>
        <View style={styles.metadata}>
          <Text style={styles.genre}>{story.genre}</Text>
          {story.setting && <Text style={styles.setting}>📍 {story.setting}</Text>}
        </View>
        {story.description && (
          <Text style={styles.description}>{story.description}</Text>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.likeButton, isLiked && styles.likeButtonActive]}
          onPress={handleLike}
        >
          <Text style={styles.actionText}>
            {isLiked ? '❤️' : '🤍'} {story.likes_count || 0} Likes
          </Text>
        </TouchableOpacity>
        
        {isAuthenticated && story.user_id === user?.id && (
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => navigation.navigate('StoryEditor', { storyId, story })}
          >
            <Text style={styles.actionText}>✏️ Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.contentText}>{story.content}</Text>
      </View>

      <View style={styles.commentsSection}>
        <Text style={styles.commentsHeader}>
          💬 Comments ({comments.length})
        </Text>

        {isAuthenticated && (
          <View style={styles.addComment}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <TouchableOpacity 
              style={styles.commentButton}
              onPress={handleAddComment}
            >
              <Text style={styles.commentButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        )}

        {comments.map(comment => (
          <View key={comment.id} style={styles.comment}>
            <Text style={styles.commentAuthor}>{comment.username}</Text>
            <Text style={styles.commentText}>{comment.content}</Text>
            <Text style={styles.commentDate}>
              {new Date(comment.created_at).toLocaleDateString()}
            </Text>
          </View>
        ))}

        {comments.length === 0 && (
          <Text style={styles.noComments}>
            No comments yet. Be the first to comment!
          </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  metadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  genre: {
    fontSize: 14,
    color: '#6200ee',
    backgroundColor: '#e8e0ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 10,
  },
  setting: {
    fontSize: 14,
    color: '#666',
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginTop: 10,
  },
  actions: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
  },
  likeButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  likeButtonActive: {
    backgroundColor: '#ffe0e0',
  },
  editButton: {
    flex: 1,
    backgroundColor: '#6200ee',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 28,
    color: '#333',
  },
  commentsSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 20,
  },
  commentsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  addComment: {
    marginBottom: 20,
  },
  commentInput: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  commentButton: {
    backgroundColor: '#6200ee',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  commentButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  comment: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 5,
  },
  commentText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 5,
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
  },
  noComments: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 20,
  },
});
