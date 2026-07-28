import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import AnimatedSection from './AnimatedSection';
import './Skills.css';

export default function Skills({ darkMode }) {
  const { skills, loading } = useData();
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', ...new Set(skills.map(skill => skill.category))];
  
  const filteredSkills = selectedCategory === 'All' 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory);

  const renderSkillIcon = (skill) => {
    if (skill.iconType === 'none') {
      return null;
    }
    if (skill.iconType === 'image' && skill.iconUrl) {
      return (
        <img 
          src={skill.iconUrl} 
          alt={skill.name} 
          className="skill-image-icon"
          loading="lazy"
        />
      );
    } else if (skill.iconType === 'svg' && skill.iconUrl) {
      return (
        <div 
          className="skill-svg-icon"
          dangerouslySetInnerHTML={{ __html: skill.iconUrl }}
        />
      );
    } else {
      return <span className="skill-emoji-icon">{skill.icon || '⚛️'}</span>;
    }
  };

  if (loading) {
    return (
      <section id="skills" className={`skills ${darkMode ? 'dark' : ''}`}>
        <div className="skills-container">
          <div className="section-header">
            <span className="section-badge">💻 Technical</span>
            <h2 className="section-title">Skills & Technologies</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">Loading skills...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className={`skills ${darkMode ? 'dark' : ''}`}>
      <div className="skills-container">
        <AnimatedSection animation="fadeUp" delay={100}>
          <div className="section-header">
            <span className="section-badge">💻 Technical</span>
            <h2 className="section-title">Skills & Technologies</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">
              A collection of technologies and tools I've worked with
            </p>
          </div>
        </AnimatedSection>
        
        <AnimatedSection animation="fadeUp" delay={150}>
          <div className="skills-filter">
            {categories.map(category => (
              <button
                key={category}
                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </AnimatedSection>
        
        <div className="skills-grid">
          {filteredSkills.length > 0 ? (
            filteredSkills.map((skill, index) => {
              const icon = renderSkillIcon(skill);
              const level = Math.min(Math.max(Number(skill.level) || 0, 0), 100);
              
              return (
                <AnimatedSection 
                  key={skill.id || index} 
                  animation="fadeUp" 
                  delay={200 + (index * 80)}
                  className="skill-card"
                >
                  <div className="skill-header">
                    {icon && (
                      <div className="skill-icon-container">
                        {icon}
                      </div>
                    )}
                    <div className="skill-info">
                      <h3 className="skill-name">{skill.name}</h3>
                      <span className="skill-category">{skill.category}</span>
                    </div>
                  </div>
                  
                  <p className="skill-description">{skill.description}</p>
                  
                  <div className="skill-progress-wrapper">
                    <div className="skill-progress-bar">
                      <div 
                        className="skill-progress-fill"
                        style={{ 
                          '--progress-width': `${level}%`,
                          width: `${level}%`,
                          animation: `fillProgress 0.8s ease ${index * 0.08}s forwards`
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="skill-footer">
                    <span className="skill-since">Since {skill.since || '2020'}</span>
                    <div className="skill-projects">
                      {(skill.projects || []).slice(0, 2).map(project => (
                        <span key={project} className="project-tag">{project}</span>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              );
            })
          ) : (
            <div className="no-skills">No skills found in this category</div>
          )}
        </div>
      </div>
    </section>
  );
}