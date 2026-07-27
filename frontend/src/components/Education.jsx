import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { certificationAPI } from '../services/api';
import AnimatedSection from './AnimatedSection';
import './Education.css';

export default function Education() {
  const { education, loading } = useData();
  const [showAllCourses, setShowAllCourses] = useState({});
  const [standaloneCertifications, setStandaloneCertifications] = useState([]);
  const [certsLoading, setCertsLoading] = useState(true);

  useEffect(() => {
    fetchStandaloneCertifications();
  }, []);

  const fetchStandaloneCertifications = async () => {
    try {
      const data = await certificationAPI.getAll();
      setStandaloneCertifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching standalone certifications:', error);
    } finally {
      setCertsLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="education" className="education">
        <div className="education-container">
          <div className="section-header">
            <span className="section-badge">Academic Background</span>
            <h2 className="section-title">Education & Certifications</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">Loading education...</p>
          </div>
        </div>
      </section>
    );
  }

  const educationsList = Array.isArray(education) ? education : education ? [education] : [];

  if (educationsList.length === 0 && standaloneCertifications.length === 0) {
    return (
      <section id="education" className="education">
        <div className="education-container">
          <div className="section-header">
            <span className="section-badge">Academic Background</span>
            <h2 className="section-title">Education & Certifications</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">No education data available</p>
          </div>
        </div>
      </section>
    );
  }

  const toggleCourses = (id) => {
    setShowAllCourses(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDownloadCertificate = (certificateUrl, fileName) => {
    if (!certificateUrl) {
      alert('No certificate available');
      return;
    }
    window.open(certificateUrl, '_blank');
  };

  const getAllCertifications = () => {
    const allCerts = [];
    educationsList.forEach(edu => {
      if (edu.Certifications && Array.isArray(edu.Certifications)) {
        allCerts.push(...edu.Certifications);
      }
    });
    allCerts.push(...standaloneCertifications);
    return allCerts.filter((cert, index, self) => 
      index === self.findIndex(c => c.id === cert.id)
    );
  };

  const allCertifications = getAllCertifications();

  return (
    <section id="education" className="education">
      <div className="education-container">
        <AnimatedSection animation="fadeUp" delay={100}>
          <div className="section-header">
            <span className="section-badge">Academic Background</span>
            <h2 className="section-title">Education & Certifications</h2>
            <div className="section-divider"></div>
          </div>
        </AnimatedSection>

        <div className="education-wrapper">
          {educationsList.map((edu, index) => (
            <AnimatedSection 
              key={edu.id} 
              animation="fadeUp" 
              delay={150 + (index * 100)}
              className="education-school-block"
              style={{ marginBottom: '3.5rem' }}
            >
              <div className="education-main-card">
                <div className="education-header">
                  <div className="education-header-info">
                    <h3 className="education-degree">{edu.degree}</h3>
                    <p className="education-university">{edu.university}</p>
                  </div>
                </div>

                <div className="education-details">
                  <div className="detail-item">
                    <span className="detail-label">Duration:</span>
                    <span className="detail-value">
                      {edu.startYear} - {edu.expectedGraduationYear}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className="detail-value status-badge">
                      {new Date().getFullYear() >= edu.expectedGraduationYear ? 'Graduated' : 'In Progress'}
                    </span>
                  </div>
                </div>

                {edu.description && (
                  <div className="education-description">
                    <h4>Description</h4>
                    <p>{edu.description}</p>
                  </div>
                )}

                {edu.coursesTaken && (
                  <div className="education-coursework">
                    <h4>Relevant Coursework</h4>
                    <ul>
                      {edu.coursesTaken.split('\n').filter(c => c.trim()).map((course, idx) => (
                        <li key={idx}>• {course.trim()}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {edu.certificateUrl && (
                  <div className="certificate-download">
                    <button 
                      className="download-cert-small" 
                      onClick={() => handleDownloadCertificate(edu.certificateUrl, edu.degree)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 10L12 15L17 10" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 15V3" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      Download Certificate
                    </button>
                  </div>
                )}
              </div>

              {edu.Courses && edu.Courses.length > 0 && (
                <div className="courses-section" style={{ marginTop: '1.5rem' }}>
                  <h3 className="courses-title">Associated Courses</h3>
                  <div className="courses-grid">
                    {(edu.Courses || []).slice(0, 4).map((course) => (
                      <div key={course.id} className="course-card">
                        <div className="course-header">
                          <h4 className="course-name">{course.name}</h4>
                        </div>
                        {course.grade && (
                          <div className="course-grade">Grade: {course.grade}</div>
                        )}
                        {course.skills && course.skills.length > 0 && (
                          <div className="course-skills">
                            {course.skills.map((skill, idx) => (
                              <span key={idx} className="course-skill-tag">{skill}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </AnimatedSection>
          ))}

          {standaloneCertifications.length > 0 && (
            <AnimatedSection animation="fadeUp" delay={200} className="standalone-certifications-section" style={{ marginTop: '2rem' }}>
              <h3 className="certifications-title">Professional Certifications</h3>
              <div className="certifications-list">
                {standaloneCertifications.map((cert) => (
                  <div key={cert.id} className="certification-card">
                    <div className="certification-header">
                      <div className="certification-info">
                        <div className="certification-title-row">
                          {cert.logoUrl && (
                            <img 
                              src={cert.logoUrl} 
                              alt={cert.issuer || 'Logo'} 
                              className="cert-logo"
                              loading="lazy"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                          )}
                          <div>
                            <h4 className="certification-name">{cert.name}</h4>
                            <p className="certification-issuer">{cert.issuer}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="certification-details">
                      <div className="cert-date">
                        <span className="cert-label">Date:</span>
                        <span className="cert-value">{cert.date}</span>
                      </div>
                      {cert.certificateUrl && (
                        <button 
                          className="download-cert-btn"
                          onClick={() => handleDownloadCertificate(cert.certificateUrl, cert.name)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M7 10L12 15L17 10" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 15V3" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                          View Certificate
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          )}
        </div>
      </div>
    </section>
  );
}