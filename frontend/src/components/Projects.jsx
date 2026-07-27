import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import ProjectModal from './ProjectModal';
import AnimatedSection from './AnimatedSection';
import './Projects.css';

export default function Projects({ darkMode }) {
  const { projects, loading } = useData();
  const [selectedProject, setSelectedProject] = useState(null);

  const handleProjectClick = (project) => {
    console.log('🔍 Project clicked:', project);
    console.log('🔍 Project name:', project?.name);
    console.log('🔍 Project id:', project?.id);
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    console.log('🔒 Closing modal');
    setSelectedProject(null);
  };

  if (loading) {
    return (
      <section id="projects" className={`projects ${darkMode ? 'dark' : ''}`}>
        <div className="projects-container">
          <div className="section-header">
            <span className="section-badge">💼 Portfolio</span>
            <h2 className="section-title">Projects</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  // Debug: log projects when they load
  console.log('📊 Projects loaded:', projects);

  return (
    <>
      <section id="projects" className={`projects ${darkMode ? 'dark' : ''}`}>
        <div className="projects-container">
          <AnimatedSection animation="fadeUp" delay={100}>
            <div className="section-header">
              <span className="section-badge">💼 Portfolio</span>
              <h2 className="section-title">Projects</h2>
              <div className="section-divider"></div>
              <p className="section-subtitle">
                A selection of projects that demonstrate my skills and experience
              </p>
            </div>
          </AnimatedSection>
          
          {projects && projects.length > 0 ? (
            <div className="projects-grid">
              {projects.map((project, index) => (
                <div 
                  key={project.id || index}
                  className="project-card"
                  onClick={() => {
                    console.log('👆 Card clicked for:', project.name);
                    handleProjectClick(project);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="project-image">
                    {project.image ? (
                      <img src={project.image} alt={project.name} />
                    ) : (
                      <div className="project-image-placeholder">📁</div>
                    )}
                  </div>
                  <div className="project-info">
                    <h3 className="project-title">{project.name || 'Untitled'}</h3>
                    <p className="project-description">{project.description || 'No description'}</p>
                    <div className="project-tech-stack">
                      {project.techStack && project.techStack.slice(0, 4).map((tech, idx) => (
                        <span key={idx} className="project-tech-tag">{tech}</span>
                      ))}
                      {project.techStack && project.techStack.length > 4 && (
                        <span className="project-tech-tag">+{project.techStack.length - 4}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-projects">
              <p>No projects available yet.</p>
            </div>
          )}
        </div>
      </section>
      
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={handleCloseModal}
          darkMode={darkMode}
        />
      )}
    </>
  );
}