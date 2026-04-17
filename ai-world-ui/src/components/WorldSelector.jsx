import React, { useState, useEffect } from 'react';
import { worldApi } from '../api/worldApi';
import './WorldSelector.css';

export const WorldSelector = ({ onWorldSelect, onCreateWorld, loading }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [worlds, setWorlds] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: ''
  });

  useEffect(() => {
    const fetchWorlds = async () => {
      try {
        const { data } = await worldApi.getWorlds();
        setWorlds(data);
      } catch (error) {
        console.error('Failed to fetch worlds:', error);
      }
    };

    fetchWorlds();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    onCreateWorld({
      id: formData.id.trim(),
      name: formData.name,
      description: formData.description
    });
    setFormData({ id: '', name: '', description: '' });
    setShowCreateForm(false);
  };

  const handleLoadExisting = (e) => {
    e.preventDefault();
    const worldId = formData.id.trim();
    if (worldId) {
      // Try to parse as number, but allow string IDs too
      const parsedId = isNaN(worldId) ? worldId : parseInt(worldId);
      onWorldSelect(parsedId);
    }
  };

  return (
    <div className="world-selector">
      <div className="world-selector-container">
        <h1>AI World - Interactive Storytelling</h1>
        <p className="subtitle">Enter an existing world or create a new adventure</p>

        {!showCreateForm ? (
          <div className="selector-options">
            <form onSubmit={handleLoadExisting} className="load-form">
              <div className="form-group">
                <label htmlFor="world-id">World ID or Name:</label>
                <input
                  id="world-id"
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  placeholder="Select or enter world ID/name"
                  disabled={loading}
                  required
                  list="worlds-list"
                />
                <datalist id="worlds-list">
                  {worlds.map(world => (
                    <option key={world.id} value={world.id}>
                      {world.name} (ID: {world.id})
                    </option>
                  ))}
                </datalist>
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Loading...' : 'Load World'}
              </button>
            </form>

            <div className="divider">OR</div>

            <button
              onClick={() => setShowCreateForm(true)}
              className="btn btn-secondary"
              disabled={loading}
            >
              Create New World
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreateSubmit} className="create-form">
            <div className="form-group">
              <label htmlFor="new-world-id">World ID:</label>
              <input
                id="new-world-id"
                type="text"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                placeholder="Choose a unique ID (can be text or number)"
                disabled={loading}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="new-world-name">World Name:</label>
              <input
                id="new-world-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., The Enchanted Forest"
                disabled={loading}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="new-world-description">Description:</label>
              <textarea
                id="new-world-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your world..."
                disabled={loading}
                required
                rows="4"
              />
            </div>
            <div className="form-buttons">
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Creating...' : 'Create World'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="btn btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading && <p className="loading-text">Loading...</p>}
      </div>
    </div>
  );
};
