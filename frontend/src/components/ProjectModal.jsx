import React, { useEffect } from 'react';
import './ProjectModal.css';

export default function ProjectModal({ project, onClose, darkMode }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // If project is null or undefined, don't render
  if (!project) {
    return null;
  }

  return (
    <div className={`modal-backdrop ${darkMode ? 'dark' : ''}`} onClick={handleBackdropClick}>
      <div className="modal-container">
        <button className="modal-close" onClick={onClose} title="Close modal">
          ✕
        </button>
        
        <div className="modal-header-sticky">
          <div className="modal-header-content">
            <div className="modal-image-wrapper">
              {project.image ? (
                <img src={project.image} alt={project.name || 'Project'} className="modal-image" />
              ) : (
                <div className="modal-image-placeholder">
                  <span>📁</span>
                </div>
              )}
            </div>
            <div className="modal-header-info">
              <h2 className="modal-title">{project.name || 'Untitled Project'}</h2>
              {project.startDate && (
                <span className="modal-date">
                  {project.startDate} {project.endDate ? `— ${project.endDate}` : ''}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="modal-body">
          {/* Technologies */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="modal-section">
              <h3 className="modal-section-title">Technologies</h3>
              <div className="modal-tech-stack">
                {project.techStack.map((tech, index) => (
                  <span key={index} className="modal-tech">{tech}</span>
                ))}
              </div>
            </div>
          )}
          
          {/* Description */}
          {project.details && (
            <div className="modal-section">
              <h3 className="modal-section-title">Overview</h3>
              <p className="modal-text">{project.details}</p>
            </div>
          )}
          
          {/* Challenges */}
          {project.challenges && (
            <div className="modal-section">
              <h3 className="modal-section-title">Challenges</h3>
              <p className="modal-text">{project.challenges}</p>
            </div>
          )}
          
          {/* Learnings */}
          {project.learnings && (
            <div className="modal-section">
              <h3 className="modal-section-title">Key Learnings</h3>
              <p className="modal-text">{project.learnings}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}