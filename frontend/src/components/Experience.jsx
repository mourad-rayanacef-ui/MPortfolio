import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import AnimatedSection from './AnimatedSection';
import './Experience.css';

export default function Experience() {
  const { experiences, loading } = useData();
  const [expandedItem, setExpandedItem] = useState(null);

  const toggleExpand = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getDateRange = (experience) => {
    const start = formatDate(experience.startDate);
    const end = experience.isCurrent ? 'Present' : formatDate(experience.endDate);
    return `${start} - ${end}`;
  };

  const getTypeColor = (type) => {
    const colors = {
      'Full-Time': '#10B981',
      'Part-Time': '#3B82F6',
      'Internship': '#F59E0B',
      'Contract': '#8B5CF6',
      'Freelance': '#EC4899'
    };
    return colors[type] || '#6B7280';
  };

  if (loading) {
    return (
      <section id="experience" className="experience">
        <div className="experience-container">
          <div className="section-header">
            <span className="section-badge">💼 Professional</span>
            <h2 className="section-title">Experience & Internships</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">Loading experience...</p>
          </div>
        </div>
      </section>
    );
  }

  const fullTimeExperiences = experiences.filter(exp => exp.type === 'Full-Time' || exp.type === 'Part-Time' || exp.type === 'Contract' || exp.type === 'Freelance');
  const internships = experiences.filter(exp => exp.type === 'Internship');

  if (experiences.length === 0) {
    return (
      <section id="experience" className="experience">
        <div className="experience-container">
          <div className="section-header">
            <span className="section-badge">💼 Professional</span>
            <h2 className="section-title">Experience & Internships</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">No experience data available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="experience">
      <div className="experience-container">
        <AnimatedSection animation="fadeUp" delay={100}>
          <div className="section-header">
            <span className="section-badge">💼 Professional</span>
            <h2 className="section-title">Experience & Internships</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">
              My professional journey and work experience
            </p>
          </div>
        </AnimatedSection>

        <div className="experience-timeline">
          {fullTimeExperiences.length > 0 && (
            <div className="experience-group">
              <AnimatedSection animation="fadeUp" delay={150}>
                <h3 className="experience-group-title">Professional Experience</h3>
              </AnimatedSection>
              {fullTimeExperiences.map((exp, index) => (
                <AnimatedSection 
                  key={exp.id || index} 
                  animation="fadeUp" 
                  delay={200 + (index * 80)}
                  className="experience-item"
                >
                  <div className="experience-item-marker">
                    <span className="marker-dot"></span>
                    {index < fullTimeExperiences.length - 1 && <span className="marker-line"></span>}
                  </div>
                  <div className="experience-item-content">
                    <div className="experience-header">
                      {exp.companyLogo && (
                        <img 
                          src={exp.companyLogo} 
                          alt={exp.company} 
                          className="experience-company-logo"
                          loading="lazy"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                      <div className="experience-title-group">
                        <h3 className="experience-title">{exp.title}</h3>
                        <p className="experience-company">{exp.company}</p>
                      </div>
                      <span 
                        className="experience-type-badge"
                        style={{ backgroundColor: getTypeColor(exp.type) }}
                      >
                        {exp.type}
                      </span>
                    </div>

                    <div className="experience-meta">
                      <span className="experience-date">{getDateRange(exp)}</span>
                      {exp.location && (
                        <>
                          <span className="meta-divider">•</span>
                          <span className="experience-location">{exp.location}</span>
                        </>
                      )}
                    </div>

                    {exp.description && (
                      <div className={`experience-description ${expandedItem === exp.id ? 'expanded' : ''}`}>
                        <p>{exp.description}</p>
                      </div>
                    )}

                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="experience-achievements">
                        <h4>Key Achievements</h4>
                        <ul>
                          {exp.achievements.map((achievement, i) => (
                            <li key={i}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="experience-technologies">
                        {exp.technologies.map((tech, i) => (
                          <span key={i} className="tech-tag">{tech}</span>
                        ))}
                      </div>
                    )}

                    {exp.website && (
                      <a 
                        href={exp.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="experience-website"
                      >
                        Visit Website →
                      </a>
                    )}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}

          {internships.length > 0 && (
            <div className="experience-group">
              <AnimatedSection animation="fadeUp" delay={150}>
                <h3 className="experience-group-title">Internships</h3>
              </AnimatedSection>
              {internships.map((exp, index) => (
                <AnimatedSection 
                  key={exp.id || index} 
                  animation="fadeUp" 
                  delay={200 + (index * 80)}
                  className="experience-item"
                >
                  <div className="experience-item-marker">
                    <span className="marker-dot internship"></span>
                    {index < internships.length - 1 && <span className="marker-line"></span>}
                  </div>
                  <div className="experience-item-content">
                    <div className="experience-header">
                      {exp.companyLogo && (
                        <img 
                          src={exp.companyLogo} 
                          alt={exp.company} 
                          className="experience-company-logo"
                          loading="lazy"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                      <div className="experience-title-group">
                        <h3 className="experience-title">{exp.title}</h3>
                        <p className="experience-company">{exp.company}</p>
                      </div>
                      <span 
                        className="experience-type-badge internship-badge"
                        style={{ backgroundColor: getTypeColor(exp.type) }}
                      >
                        {exp.type}
                      </span>
                    </div>

                    <div className="experience-meta">
                      <span className="experience-date">{getDateRange(exp)}</span>
                      {exp.location && (
                        <>
                          <span className="meta-divider">•</span>
                          <span className="experience-location">{exp.location}</span>
                        </>
                      )}
                    </div>

                    {exp.description && (
                      <div className="experience-description">
                        <p>{exp.description}</p>
                      </div>
                    )}

                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="experience-achievements">
                        <h4>Key Achievements</h4>
                        <ul>
                          {exp.achievements.map((achievement, i) => (
                            <li key={i}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="experience-technologies">
                        {exp.technologies.map((tech, i) => (
                          <span key={i} className="tech-tag">{tech}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}