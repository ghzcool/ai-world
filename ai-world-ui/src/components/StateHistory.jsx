import React, { useState, useEffect } from 'react';
import './StateHistory.css';

export const StateHistory = ({ worldId, onSelectState, currentStateIndex, loading }) => {
  const [historyItems, setHistoryItems] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const loadHistory = async () => {
    if (!showHistory) {
      // History would be loaded from the useWorld hook
      // For now, just toggle the panel
      setShowHistory(true);
    } else {
      setShowHistory(false);
    }
  };

  return (
    <div className="state-history">
      <button
        onClick={loadHistory}
        className="history-toggle"
        disabled={loading}
      >
        {showHistory ? '▼ History' : '▶ History'}
      </button>

      {showHistory && (
        <div className="history-panel">
          <p className="history-note">
            Click on any state to view or load it
          </p>
          <div className="history-list">
            {historyItems.length === 0 ? (
              <p className="no-history">Loading history...</p>
            ) : (
              historyItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => onSelectState(item.stateIndex)}
                  className={`history-item ${
                    item.stateIndex === currentStateIndex ? 'active' : ''
                  }`}
                  disabled={loading}
                >
                  <span className="history-index">#{item.stateIndex}</span>
                  <span className="history-turn">{item.turn}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
