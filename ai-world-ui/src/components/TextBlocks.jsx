import React from 'react';
import './TextBlocks.css';

export const TextBlocks = ({ texts = [], turn }) => {
  if (!texts || texts.length === 0) {
    return (
      <div className="text-blocks">
        <p className="no-texts">Waiting for narration...</p>
      </div>
    );
  }

  return (
    <div className="text-blocks">
      {turn && <div className="turn-indicator">Turn: {turn}</div>}
      <div className="texts-container">
        {texts.map((text, index) => (
          <div
            key={index}
            className={`text-block ${text.who.toLowerCase()}`}
          >
            <div className="text-header">
              <span className="text-who">{text.who}</span>
              {text.to && <span className="text-to">to {text.to}</span>}
              {text.action && <span className="text-action">{text.action}</span>}
            </div>
            <div className="text-content">
              {text.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
