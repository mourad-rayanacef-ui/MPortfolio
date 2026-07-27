import React, { useState } from 'react';
import { FaInstagram, FaFacebook, FaWhatsapp, FaLinkedinIn } from 'react-icons/fa';
import './Hero.css';

export default function Hero({ personalInfo, darkMode }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDownloadCV = () => {
    if (personalInfo?.cvUrl) {
      window.open(personalInfo.cvUrl, '_blank');
    } else {
      alert('CV not available. Please check back later.');
    }
  };

  return (
    <section id="home" className={`hero ${darkMode ? 'dark' : ''}`}>
      <div className="hero-container">
        {/* Left: Text Content */}
        <div className="hero-content">
          <span className="hero-greeting">Hello, I'm</span>

          <h1 className="hero-name">{personalInfo?.name || 'Your Name'}</h1>

          <h2 className="hero-title">{personalInfo?.title || 'Your Title'}</h2>

          <p className="hero-description">
            Network engineer by training, builder by instinct.
            I turn complex infrastructure challenges into observable, secure, and resilient systems.from deploying enterprise firewalls to building monitoring platforms from the ground up. Based in Algeria, open to opportunities worldwide.
          </p>

          <div className="hero-buttons">
            <button className="btn-primary" onClick={handleDownloadCV}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download CV
            </button>
          </div>

          <div className="hero-socials">
            {/* Instagram */}
            {personalInfo?.instagram ? (
              <a 
                href={personalInfo.instagram} 
                className="social-link" 
                aria-label="Instagram" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
            ) : (
              <a 
                href="#" 
                className="social-link" 
                aria-label="Instagram" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
            )}

            {/* Facebook */}
            {personalInfo?.facebook ? (
              <a 
                href={personalInfo.facebook} 
                className="social-link" 
                aria-label="Facebook" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FaFacebook />
              </a>
            ) : (
              <a 
                href="#" 
                className="social-link" 
                aria-label="Facebook" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FaFacebook />
              </a>
            )}

            {/* WhatsApp */}
            {personalInfo?.phone ? (
              <a 
                href={`https://wa.me/${personalInfo.phone.replace(/[^0-9]/g, '')}`} 
                className="social-link" 
                aria-label="WhatsApp" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FaWhatsapp />
              </a>
            ) : (
              <a 
                href="#" 
                className="social-link" 
                aria-label="WhatsApp" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FaWhatsapp />
              </a>
            )}

            {/* LinkedIn */}
            {personalInfo?.linkedin ? (
              <a 
                href={personalInfo.linkedin} 
                className="social-link" 
                aria-label="LinkedIn" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FaLinkedinIn />
              </a>
            ) : (
              <a 
                href="#" 
                className="social-link" 
                aria-label="LinkedIn" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FaLinkedinIn />
              </a>
            )}
          </div>
        </div>

        {/* Right: Profile Image */}
        <div className="hero-image">
          {personalInfo?.profileImage && !imageError ? (
            <img
              src={personalInfo.profileImage}
              alt={personalInfo?.name || 'Profile'}
              className={`profile-image ${imageLoaded ? 'loaded' : ''}`}
              loading="lazy"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              style={{ 
                opacity: imageLoaded ? 1 : 0, 
                transition: 'opacity 0.5s ease' 
              }}
            />
          ) : (
            <div className="profile-image-placeholder">
              <span className="placeholder-text">{personalInfo?.name?.charAt(0) || '👤'}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}