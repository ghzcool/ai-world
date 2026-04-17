import React, { useState } from 'react';
import { useWorld } from './hooks/useWorld';
import { WorldSelector } from './components/WorldSelector';
import { GameBoard } from './components/GameBoard';
import './App.css';

function App() {
  const {
    world,
    currentState,
    loading,
    error,
    loadWorld,
    submitAction,
    createNewWorld,
    loadState,
    exitWorld
  } = useWorld();

  const [showError, setShowError] = useState(false);

  React.useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleWorldSelect = async (worldId) => {
    try {
      await loadWorld(worldId);
    } catch (err) {
      console.error('Failed to load world:', err);
    }
  };

  const handleCreateWorld = async (worldData) => {
    try {
      await createNewWorld(worldData);
    } catch (err) {
      console.error('Failed to create world:', err);
    }
  };

  const handleSubmitAction = async (actionData) => {
    try {
      await submitAction(world.id, actionData);
    } catch (err) {
      console.error('Failed to submit action:', err);
    }
  };

  const handleSelectState = async (stateIndex) => {
    try {
      await loadState(world.id, stateIndex);
    } catch (err) {
      console.error('Failed to load state:', err);
    }
  };

  const handleExitWorld = () => {
    exitWorld();
  };

  return (
    <div className="app">
      {!world ? (
        <WorldSelector
          onWorldSelect={handleWorldSelect}
          onCreateWorld={handleCreateWorld}
          loading={loading}
        />
      ) : (
        <GameBoard
          world={world}
          currentState={currentState}
          onSubmitAction={handleSubmitAction}
          onSelectState={handleSelectState}
          onExitWorld={handleExitWorld}
          loading={loading}
        />
      )}

      {showError && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setShowError(false)}>×</button>
        </div>
      )}
    </div>
  );
}

export default App;
