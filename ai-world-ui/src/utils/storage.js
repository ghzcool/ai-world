// Local storage utilities for world state
const STORAGE_KEY_WORLD_ID = 'ai_world_current_id';
const STORAGE_KEY_STATE_INDEX = 'ai_world_state_index';

export const storage = {
  // World ID methods
  setWorldId: (id) => {
    localStorage.setItem(STORAGE_KEY_WORLD_ID, id);
  },

  getWorldId: () => {
    return localStorage.getItem(STORAGE_KEY_WORLD_ID);
  },

  clearWorldId: () => {
    localStorage.removeItem(STORAGE_KEY_WORLD_ID);
  },

  // State index methods
  setStateIndex: (index) => {
    localStorage.setItem(STORAGE_KEY_STATE_INDEX, index);
  },

  getStateIndex: () => {
    const index = localStorage.getItem(STORAGE_KEY_STATE_INDEX);
    return index ? parseInt(index, 10) : null;
  },

  clearStateIndex: () => {
    localStorage.removeItem(STORAGE_KEY_STATE_INDEX);
  },

  // Clear all
  clearAll: () => {
    localStorage.removeItem(STORAGE_KEY_WORLD_ID);
    localStorage.removeItem(STORAGE_KEY_STATE_INDEX);
  }
};
