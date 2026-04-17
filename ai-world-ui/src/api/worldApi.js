import axios from 'axios';

// Configure base URL - update this to match your backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const worldApi = {
  // World endpoints
  getWorlds: () => {
    return api.get('/worlds');
  },

  getWorld: (worldId) => {
    return api.get(`/world/${worldId}`);
  },

  createWorld: (world) => {
    // world: { id, name, description }
    return api.post('/world', world);
  },

  // State endpoints
  getLatestState: (worldId) => {
    return api.get(`/world/${worldId}/state/latest`);
  },

  getState: (worldId, stateIndex) => {
    return api.get(`/world/${worldId}/state/${stateIndex}`);
  },

  getStateList: (worldId, page = 0, limit = 20) => {
    return api.get(`/world/${worldId}/state/list`, {
      params: { page, limit }
    });
  },

  // Action endpoint
  submitAction: (worldId, action) => {
    // action: { stateIndex, to, action, content, duration }
    return api.post(`/world/${worldId}/action`, action);
  },

  // Media endpoints
  getGeneratedImage: (prompt) => {
    return api.get('/image', {
      params: { prompt },
      responseType: 'blob'
    });
  },

  getGeneratedVoice: (text, voice) => {
    return api.get('/voice', {
      params: { text, voice },
      responseType: 'blob'
    });
  }
};

export default api;
