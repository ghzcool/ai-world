import { useState, useCallback, useEffect } from 'react';
import { worldApi } from '../api/worldApi';
import { storage } from '../utils/storage';

export const useWorld = () => {
  const [world, setWorld] = useState(null);
  const [currentState, setCurrentState] = useState(null);
  const [stateHistory, setStateHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load world on mount
  useEffect(() => {
    const loadWorldOnMount = async () => {
      const worldId = storage.getWorldId();
      if (worldId) {
        await loadWorld(worldId);
      }
    };
    loadWorldOnMount();
  }, []);

  const loadWorld = useCallback(async (worldId) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await worldApi.getWorld(worldId);
      setWorld(data);
      storage.setWorldId(worldId);
      await loadLatestState(worldId);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load world:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadLatestState = useCallback(async (worldId) => {
    try {
      const { data } = await worldApi.getLatestState(worldId);
      setCurrentState(data);
      storage.setStateIndex(data.stateIndex);
    } catch (err) {
      console.error('Failed to load latest state:', err);
    }
  }, []);

  const loadState = useCallback(async (worldId, stateIndex) => {
    try {
      const { data } = await worldApi.getState(worldId, stateIndex);
      setCurrentState(data);
      storage.setStateIndex(stateIndex);
    } catch (err) {
      console.error('Failed to load state:', err);
    }
  }, []);

  const loadHistory = useCallback(async (worldId, page = 0, limit = 20) => {
    try {
      const { data } = await worldApi.getStateList(worldId, page, limit);
      setStateHistory(data.items);
      return data;
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  }, []);

  const submitAction = useCallback(async (worldId, actionData) => {
    try {
      setLoading(true);
      const { data: newState } = await worldApi.submitAction(worldId, actionData);
      setCurrentState(newState);
      storage.setStateIndex(newState.stateIndex);
      return newState;
    } catch (err) {
      setError(err.message);
      console.error('Failed to submit action:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewWorld = useCallback(async (worldData) => {
    try {
      setLoading(true);
      setError(null);
      const { data: newWorld } = await worldApi.createWorld(worldData);
      setWorld(newWorld);
      storage.setWorldId(newWorld.id);
      await loadLatestState(newWorld.id);
      return newWorld;
    } catch (err) {
      setError(err.message);
      console.error('Failed to create world:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const exitWorld = useCallback(() => {
    setWorld(null);
    setCurrentState(null);
    setStateHistory([]);
    storage.clearWorldId();
    storage.clearStateIndex();
  }, []);

  return {
    world,
    currentState,
    stateHistory,
    loading,
    error,
    loadWorld,
    loadLatestState,
    loadState,
    loadHistory,
    submitAction,
    createNewWorld,
    exitWorld
  };
};
