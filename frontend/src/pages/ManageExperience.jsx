import React, { useState, useEffect } from 'react';
import { experienceAPI, uploadToCloudinaryDirect } from '../services/api';
import './ManageExperience.css';

export default function ManageExperience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-Time',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    achievements: [],
    technologies: [],
    website: '',
    order: 0,
    isActive: true
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    try {
      setLoading(true);
      const data = await experienceAPI.getAll();
      setExperiences(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      console.error('Error loading experiences:', error);
      setError('Failed to load experiences');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAchievementsChange = (e) => {
    const achievements = e.target.value.split('\n').filter(a => a.trim());
    setFormData(prev => ({ ...prev, achievements }));
  };

  const handleTechnologiesChange = (e) => {
    const technologies = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, technologies }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        e.target.value = '';
        return;
      }
      
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload an image file (JPG, PNG, GIF, WEBP, SVG)');
        e.target.value = '';
        return;
      }
      
      setLogoFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setUploading(true);
    
    if (!formData.title || !formData.company || !formData.startDate) {
      setError('Title, Company, and Start Date are required');
      setUploading(false);
      return;
    }
    
    try {
      const submitData = new FormData();
      
      submitData.append('title', formData.title);
      submitData.append('company', formData.company);
      submitData.append('location', formData.location || '');
      submitData.append('type', formData.type);
      submitData.append('startDate', formData.startDate);
      submitData.append('endDate', formData.isCurrent ? '' : (formData.endDate || ''));
      submitData.append('isCurrent', formData.isCurrent);
      submitData.append('description', formData.description || '');
      submitData.append('achievements', JSON.stringify(formData.achievements));
      submitData.append('technologies', JSON.stringify(formData.technologies));
      submitData.append('website', formData.website || '');
      submitData.append('order', formData.order);
      submitData.append('isActive', formData.isActive);
      
      // ✅ Upload logo directly to Cloudinary from browser
      if (logoFile) {
        const result = await uploadToCloudinaryDirect(logoFile, { 
          resourceType: 'image',
          folder: 'portfolio/company-logos'
        });
        submitData.append('companyLogo', result.secure_url);
        submitData.append('companyLogoPublicId', result.public_id);
        console.log('✅ Logo uploaded:', result.secure_url);
      }

      let response;
      if (editing) {
        response = await experienceAPI.update(editing.id, submitData);
        setSuccess('Experience updated successfully!');
      } else {
        response = await experienceAPI.create(submitData);
        setSuccess('Experience added successfully!');
      }
      
      resetForm();
      await loadExperiences();
      
      setTimeout(() => setSuccess(null), 5000);
    } catch (error) {
      console.error('Error saving experience:', error);
      setError(error.message || 'Failed to save experience');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      location: '',
      type: 'Full-Time',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
      achievements: [],
      technologies: [],
      website: '',
      order: 0,
      isActive: true
    });
    setLogoFile(null);
    setEditing(null);
    setError(null);
    
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const handleEdit = (exp) => {
    setEditing(exp);
    setFormData({
      title: exp.title || '',
      company: exp.company || '',
      location: exp.location || '',
      type: exp.type || 'Full-Time',
      startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
      endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
      isCurrent: exp.isCurrent || false,
      description: exp.description || '',
      achievements: exp.achievements || [],
      technologies: exp.technologies || [],
      website: exp.website || '',
      order: exp.order || 0,
      isActive: exp.isActive !== undefined ? exp.isActive : true
    });
    setLogoFile(null);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return;
    
    try {
      await experienceAPI.delete(id);
      await loadExperiences();
      setSuccess('Experience deleted successfully!');
      setTimeout(() => setSuccess(null), 5000);
    } catch (error) {
      console.error('Error deleting experience:', error);
      setError('Failed to delete experience');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (loading) {
    return <div className="manage-loading">Loading experiences...</div>;
  }

  return (
    <div className="manage-section">
      <h2>Manage Experience & Internships</h2>
      
      {success && (
        <div className="success-message">
          ✅ {success}
        </div>
      )}
      
      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-row">
          <div className="form-group">
            <label>Job Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Senior Software Engineer"
            />
          </div>
          <div className="form-group">
            <label>Company *</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              placeholder="e.g., Google"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., San Francisco, CA"
            />
          </div>
          <div className="form-group">
            <label>Employment Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Date *</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              disabled={formData.isCurrent}
            />
          </div>
        </div>

        <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ margin: 0 }}>Currently Working Here</label>
          <input
            type="checkbox"
            name="isCurrent"
            checked={formData.isCurrent}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your role and responsibilities..."
          />
        </div>

        <div className="form-group">
          <label>Key Achievements (one per line)</label>
          <textarea
            rows="4"
            value={formData.achievements.join('\n')}
            onChange={handleAchievementsChange}
            placeholder="Led a team of 5 developers..."
          />
        </div>

        <div className="form-group">
          <label>Technologies (comma separated)</label>
          <input
            type="text"
            value={formData.technologies.join(', ')}
            onChange={handleTechnologiesChange}
            placeholder="React, Node.js, Python, AWS"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Company Logo</label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
              onChange={handleFileChange}
              disabled={uploading}
            />
            {logoFile && (
              <small style={{ color: '#10B981' }}>
                {uploading ? 'Uploading...' : `New logo selected: ${logoFile.name}`}
              </small>
            )}
            {editing && editing.companyLogo && !logoFile && (
              <small>
                Current logo: <a href={editing.companyLogo} target="_blank" rel="noopener noreferrer">View Logo</a>
              </small>
            )}
          </div>
          <div className="form-group">
            <label>Company Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://company.com"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Display Order</label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ margin: 0 }}>Active</label>
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn" disabled={uploading}>
            {uploading ? 'Uploading...' : (editing ? 'Update' : 'Add') + ' Experience'}
          </button>
          {editing && (
            <button type="button" className="cancel-btn" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="items-list">
        <h3>Existing Experiences ({experiences.length})</h3>
        {experiences.length === 0 ? (
          <p className="no-items">No experiences added yet</p>
        ) : (
          experiences.map(exp => (
            <div key={exp.id} className="list-item">
              <div className="item-info">
                <div className="exp-item-header">
                  {exp.companyLogo && (
                    <img 
                      src={exp.companyLogo} 
                      alt={exp.company} 
                      className="exp-logo-thumb"
                    />
                  )}
                  <div>
                    <strong>{exp.title}</strong> at {exp.company}
                    <p className="item-description">
                      {exp.type} • {formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                      {exp.location && ` • ${exp.location}`}
                    </p>
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="exp-tech-tags">
                        {exp.technologies.slice(0, 3).map((tech, i) => (
                          <span key={i} className="tech-tag">{tech}</span>
                        ))}
                        {exp.technologies.length > 3 && (
                          <span className="tech-tag">+{exp.technologies.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(exp)} className="edit-btn">Edit</button>
                <button onClick={() => handleDelete(exp.id)} className="delete-btn">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}