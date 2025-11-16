import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getProfile: () => api.get('/users/profile'),
  updatePreferences: (preferences) => api.put('/users/preferences', { preferences }),
};

export const storyAPI = {
  createStory: (storyData) => api.post('/stories', storyData),
  getAllStories: (params) => api.get('/stories', { params }),
  getStory: (id) => api.get(`/stories/${id}`),
  getMyStories: () => api.get('/stories/my-stories'),
  updateStory: (id, updates) => api.put(`/stories/${id}`, updates),
  deleteStory: (id) => api.delete(`/stories/${id}`),
  
  addChapter: (storyId, chapterData) => api.post(`/stories/${storyId}/chapters`, chapterData),
  getChapters: (storyId) => api.get(`/stories/${storyId}/chapters`),
  
  likeStory: (storyId) => api.post(`/stories/${storyId}/like`),
  unlikeStory: (storyId) => api.delete(`/stories/${storyId}/like`),
  
  addComment: (storyId, content) => api.post(`/stories/${storyId}/comments`, { content }),
  getComments: (storyId) => api.get(`/stories/${storyId}/comments`),
};

export const aiAPI = {
  generateStory: (params) => api.post('/ai/generate-story', params),
  enhanceStory: (content, enhancement) => api.post('/ai/enhance-story', { content, enhancement }),
  generateCharacter: (characterData) => api.post('/ai/generate-character', characterData),
};

export default api;
