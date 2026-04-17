import React from 'react';
import { ImageDisplay } from './ImageDisplay';
import { TextBlocks } from './TextBlocks';
import { ActionInput } from './ActionInput';
import { StateHistory } from './StateHistory';
import './GameBoard.css';

export const GameBoard = ({
  world,
  currentState,
  onSubmitAction,
  onSelectState,
  onExitWorld,
  loading
}) => {
  if (!world || !currentState) {
    return <div className="game-board">Loading game...</div>;
  }

  return (
    <div className="game-board">
      <div className="game-header">
        <div>
          <h1 className="world-title">{world.name}</h1>
          <p className="world-description">{world.description}</p>
        </div>
        <div className="game-meta">
          <span>World ID: {world.id}</span>
          <span>•</span>
          <span>State: {currentState.stateIndex}</span>
          <button className="exit-button" onClick={onExitWorld} disabled={loading}>
            Exit World
          </button>
        </div>
      </div>

      <div className="game-content">
        <div className="left-panel">
          <ImageDisplay
            prompt={currentState.imagePrompt}
            loading={loading}
          />
        </div>

        <div className="right-panel">
          <TextBlocks
            texts={currentState.texts}
            turn={currentState.turn}
          />

          <ActionInput
            onSubmitAction={onSubmitAction}
            loading={loading}
            currentStateIndex={currentState.stateIndex}
          />

          <StateHistory
            worldId={world.id}
            onSelectState={onSelectState}
            currentStateIndex={currentState.stateIndex}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};
