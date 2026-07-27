import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import AnimatedSection from './AnimatedSection';
import './Contact.css';

export default function Contact({ personalInfo }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    
    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        to_email: personalInfo.email,
        message: formData.message,
        reply_to: formData.email
      };
      
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      
      setStatus('sent');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      console.error('Email error:', error);
      setStatus('error');
      setTimeout(() => setStatus(''), 3000);
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="contact-container">
        <AnimatedSection animation="fadeUp" delay={100}>
          <div className="section-header">
            <span className="section-badge">Get in touch</span>
            <h2 className="section-title">Let's Connect</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">
              I'm always interested in hearing about new opportunities and interesting projects
            </p>
          </div>
        </AnimatedSection>
        
        <AnimatedSection animation="fadeUp" delay={200} className="contact-content">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <textarea
                name="message"
                placeholder="Your Message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="submit-btn"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>
            
            {status === 'sent' && (
              <div className="success-message">
                ✨ Message sent successfully! I'll get back to you soon.
              </div>
            )}
            
            {status === 'error' && (
              <div className="error-message">
                ❌ Failed to send message. Please try again.
              </div>
            )}
          </form>
        </AnimatedSection>
      </div>
    </section>
  );
}