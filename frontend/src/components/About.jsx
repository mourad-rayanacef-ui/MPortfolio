import React from 'react';
import AnimatedSection from './AnimatedSection';
import './About.css';

export default function About({ personalInfo }) {
  return (
    <section id="about" className="about">
      <div className="about-container">
        <AnimatedSection animation="fadeUp" delay={100}>
          <div className="section-header">
            <span className="section-badge">Get to know me</span>
            <h2 className="section-title">About Me</h2>
            <div className="section-divider"></div>
          </div>
        </AnimatedSection>
        
        <div className="about-content">
          {/* Left Column - Bio & CV */}
          <AnimatedSection animation="fadeRight" delay={200} className="about-bio-section">
            <p className="about-bio">
              {personalInfo.bio}
            </p>
            
            {/* Contact Info */}
            <div className="about-contact-info">
              {personalInfo.email && (
                <div className="contact-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
                </div>
              )}
              
              {personalInfo.phone && (
                <div className="contact-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7294C21.7209 20.9845 21.5573 21.2136 21.352 21.4019C21.1467 21.5901 20.9041 21.7335 20.6397 21.8227C20.3754 21.9119 20.0949 21.945 19.816 21.92C16.743 21.5856 13.787 20.5341 11.18 18.85C8.77352 17.3147 6.70989 15.2511 5.174 12.85C3.48386 10.2409 2.43097 7.28032 2.1 4.204C2.07503 3.92514 2.10812 3.64459 2.19731 3.3802C2.2865 3.1158 2.42988 2.87322 2.61814 2.66791C2.8064 2.46261 3.0355 2.29898 3.29063 2.18739C3.54577 2.0758 3.82145 2.01878 4.1 2.01999H7.1C7.64507 2.01557 8.16988 2.2239 8.56 2.58999C8.95012 2.95609 9.16844 3.44322 9.18 3.95999C9.32623 5.28061 9.63678 6.57433 10.1 7.79999C10.2473 8.17436 10.2769 8.58386 10.1852 8.97442C10.0935 9.36498 9.88477 9.71424 9.594 9.96999L8.44 11.07C9.99712 13.9924 12.8679 16.3318 15.894 17.46L17.036 16.33C17.2954 16.0425 17.6459 15.8376 18.0352 15.7488C18.4245 15.66 18.8314 15.6918 19.202 15.84C20.4045 16.3074 21.6778 16.6243 22.978 16.78C23.4947 16.7923 23.9818 17.0115 24.3474 17.4028C24.7131 17.7941 24.9208 18.3199 24.916 18.866L22 16.92Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <a href={`tel:${personalInfo.phone}`}>{personalInfo.phone}</a>
                </div>
              )}
            </div>
            
            {/* Download CV Button */}
            {personalInfo.cvUrl && (
              <div className="about-cv-wrapper">
                <a href={personalInfo.cvUrl} target="_blank" rel="noopener noreferrer" className="about-cv-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Download CV
                </a>
              </div>
            )}
          </AnimatedSection>

          {/* Right Column - Info Cards */}
          <AnimatedSection animation="fadeLeft" delay={300} className="about-info-section">
            <div className="info-cards-grid">
              {/* Education Card */}
              <AnimatedSection animation="fadeUp" delay={350} className="info-card">
                <div className="info-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3L1 9L12 15L23 9L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 12L5 17.5C5 18.5 6 19.5 8 20.5C10 21.5 14 21.5 16 20.5C18 19.5 19 18.5 19 17.5V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19 9V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="info-card-content">
                  <h3 className="info-card-title">Education</h3>
                  <p className="info-card-value">{personalInfo.education || "Computer Science"}</p>
                  <p className="info-card-sub">{personalInfo.university || "University"}</p>
                </div>
              </AnimatedSection>

              {/* Experience Card */}
              <AnimatedSection animation="fadeUp" delay={400} className="info-card">
                <div className="info-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15 8H22L16 12.5L18.5 19L12 15L5.5 19L8 12.5L2 8H9L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 22V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="info-card-content">
                  <h3 className="info-card-title">Experience</h3>
                  <p className="info-card-value">{personalInfo.totalExperience || "1.5 Years"}</p>
                </div>
              </AnimatedSection>

              {/* Current Role Card */}
              <AnimatedSection animation="fadeUp" delay={450} className="info-card">
                <div className="info-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 11H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12 15H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="info-card-content">
                  <h3 className="info-card-title">Current Role</h3>
                  <p className="info-card-value">{personalInfo.currentJob || "Network Security & Operations Engineer"}</p>
                  <p className="info-card-sub">{personalInfo.currentCompany || "Algérie Presse Service (APS) — National Press Agency, Algiers"}</p>
                </div>
              </AnimatedSection>

              {/* Last Project Card */}
              <AnimatedSection animation="fadeUp" delay={500} className="info-card">
                <div className="info-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 11.1C22.0035 12.7465 21.54 14.3598 20.671 15.7529C19.8021 17.146 18.5679 18.2619 17.1076 18.9735C15.6473 19.685 14.0194 19.9628 12.4194 19.7743C10.8194 19.5858 9.30133 18.9395 8.03 17.91L2 22L3.09 16.03C2.37499 14.9498 1.89234 13.7309 1.67886 12.4515C1.46538 11.1722 1.52644 9.86231 1.85816 8.60793C2.18989 7.35356 2.78415 6.18735 3.59577 5.18697C4.40739 4.18658 5.4156 3.37796 6.55 2.82001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 8H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M8 8H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="info-card-content">
                  <h3 className="info-card-title">Last Project</h3>
                  <p className="info-card-value">{personalInfo.lastProject || "Built a full SIEM from scratch using ELK Stack"}</p>
                  <p className="info-card-sub">Completed / Ongoing</p>
                </div>
              </AnimatedSection>

              {/* Firewall & Network Expertise Card (NEW) */}
              <AnimatedSection animation="fadeUp" delay={550} className="info-card">
                <div className="info-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.5 12L11 13.5L14.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="info-card-content">
                  <h3 className="info-card-title">Network & Firewalling</h3>
                  <p className="info-card-value">FortiGate & Zabbix</p>
                  <p className="info-card-sub">NAT, IPsec/SSL VPN, OSPF/BGP, Anti-DDoS</p>
                </div>
              </AnimatedSection>

              {/* Certifications In Progress Card (NEW) */}
              <AnimatedSection animation="fadeUp" delay={600} className="info-card">
                <div className="info-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 14L7 22L12 19L17 22L15 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="info-card-content">
                  <h3 className="info-card-title">Certifications</h3>
                  <p className="info-card-value">Arbor Edge Defense (AED)</p>
                  <p className="info-card-sub">Completed</p>
                </div>
              </AnimatedSection>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}