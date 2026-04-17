import React, { useState, useEffect } from 'react';
import { worldApi } from '../api/worldApi';
import './ImageDisplay.css';

export const ImageDisplay = ({ prompt, loading }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(null);

  useEffect(() => {
    if (prompt) {
      loadImage(prompt);
    }
  }, [prompt]);

  const loadImage = async (imagePrompt) => {
    try {
      setImageLoading(true);
      setImageError(null);
      const response = await worldApi.getGeneratedImage(imagePrompt);
      const url = URL.createObjectURL(response.data);
      setImageSrc(url);
    } catch (err) {
      console.error('Failed to load image:', err);
      setImageError('Failed to generate image');
      // Fallback placeholder
      setImageSrc('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="%23333" width="400" height="300"/><text x="50%" y="50%" font-size="16" fill="%23999" text-anchor="middle" dy=".3em">Image not available</text></svg>');
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <div className="image-display">
      <div className="image-container">
        {imageLoading ? (
          <div className="image-loading">
            <div className="spinner"></div>
            <p>Generating image...</p>
          </div>
        ) : imageSrc ? (
          <img src={imageSrc} alt="World situation" className="world-image" />
        ) : (
          <div className="image-placeholder">
            <p>No image available</p>
          </div>
        )}
      </div>
      {imageError && <p className="image-error">{imageError}</p>}
    </div>
  );
};
