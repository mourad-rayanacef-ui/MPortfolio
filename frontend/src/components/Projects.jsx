import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import ProjectModal from './ProjectModal';
import AnimatedSection from './AnimatedSection';
import './Projects.css';

export default function Projects({ darkMode }) {
  const { projects, loading } = useData();
  const [selectedProject, setSelectedProject] = useState(null);

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
          
          {projects.length > 0 && (
            <div className="projects-grid">
              {projects.map((project, index) => (
                <AnimatedSection 
                  key={project.id} 
                  animation="fadeUp" 
                  delay={150 + (index * 100)}
                  className="project-card"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="project-image">
                    <img src={project.image} alt={project.name} />
                  </div>
                  <div className="project-info">
                    <h3 className="project-title">{project.name}</h3>
                    <p className="project-description">{project.description}</p>
                    <div className="project-tech-stack">
                      {project.techStack && project.techStack.slice(0, 4).map((tech, idx) => (
                        <span key={idx} className="project-tech-tag">{tech}</span>
                      ))}
                      {project.techStack && project.techStack.length > 4 && (
                        <span className="project-tech-tag">+{project.techStack.length - 4}</span>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
          
          {projects.length === 0 && (
            <div className="no-projects">
              <p>No projects available yet.</p>
            </div>
          )}
        </div>
      </section>
      
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)}
          darkMode={darkMode}
        />
      )}
    </>
  );
}