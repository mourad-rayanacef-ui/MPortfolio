import React from 'react';
import './Footer.css';

export default function Footer({ personalInfo }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-text">{personalInfo?.name?.charAt(0) || 'P'}</span>
            <span className="logo-dot">.</span>
          </div>
          <p className="footer-tagline">
            Building digital experiences, one line of code at a time.
          </p>
          
          <div className="footer-social">
            <a href={personalInfo?.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href={personalInfo?.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href={personalInfo?.twitter} target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} {personalInfo?.name || 'Portfolio'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}