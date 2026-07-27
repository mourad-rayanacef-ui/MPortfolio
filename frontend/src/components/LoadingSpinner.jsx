import React from 'react';
import './LoadingSpinner.css';

export default function LoadingSpinner({ size = 'medium', color = '#F9977B' }) {
  const sizes = {
    small: '24px',
    medium: '40px',
    large: '60px'
  };

  return (
    <div className="loading-spinner-container">
      <div 
        className="loading-spinner" 
        style={{ 
          width: sizes[size], 
          height: sizes[size],
          borderColor: `${color}33`,
          borderTopColor: color
        }}
      />
    </div>
  );
}