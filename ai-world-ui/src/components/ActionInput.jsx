import React, { useState } from 'react';
import './ActionInput.css';

export const ActionInput = ({ onSubmitAction, loading, currentStateIndex }) => {
  const [actionContent, setActionContent] = useState('');
  const [actionTarget, setActionTarget] = useState('');
  const [actionType, setActionType] = useState('says');
  const [duration, setDuration] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!actionContent.trim()) return;

    onSubmitAction({
      stateIndex: currentStateIndex,
      to: actionTarget || 'all',
      action: actionType,
      content: actionContent,
      duration: duration
    });

    // Clear form
    setActionContent('');
    setActionTarget('');
    setActionType('says');
    setDuration(5);
  };

  return (
    <form onSubmit={handleSubmit} className="action-input">
      <div className="action-input-row">
        <div className="form-group">
          <label htmlFor="target">Target:</label>
          <input
            id="target"
            type="text"
            value={actionTarget}
            onChange={(e) => setActionTarget(e.target.value)}
            placeholder="(optional)"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="action-type">Action:</label>
          <select
            id="action-type"
            value={actionType}
            onChange={(e) => setActionType(e.target.value)}
            disabled={loading}
          >
            <option value="says">says</option>
            <option value="does">does</option>
            <option value="asks">asks</option>
            <option value="thinks">thinks</option>
            <option value="shouts">shouts</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="duration">Duration (s):</label>
          <input
            id="duration"
            type="number"
            min="1"
            max="60"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            disabled={loading}
          />
        </div>
      </div>

      <div className="form-group full-width">
        <label htmlFor="content">Your Action:</label>
        <textarea
          id="content"
          value={actionContent}
          onChange={(e) => setActionContent(e.target.value)}
          placeholder="Describe what your character does..."
          disabled={loading}
          rows="3"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !actionContent.trim()}
        className="btn-submit"
      >
        {loading ? 'Submitting...' : 'Submit Action'}
      </button>
    </form>
  );
};
