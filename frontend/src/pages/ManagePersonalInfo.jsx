import React, { useState, useEffect } from 'react';
import { personalInfoAPI } from '../services/api';
import './ManagePersonalInfo.css';

export default function ManagePersonalInfo() {
  const [formData, setFormData] = useState({
    name: '', 
    title: '', 
    bio: '', 
    shortBio: '', 
    email: '', 
    phone: '',
    location: '',
    linkedin: '', 
    currentFocus: '',
    totalExperience: '', 
    currentJob: '', 
    currentCompany: '', 
    lastProject: '',
    profileImage: '',
    cvUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [cvFile, setCvFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await personalInfoAPI.get();
      console.log('Loaded personal info:', data);
      setFormData(prev => ({
        ...prev,
        ...data
      }));
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage('Error loading data');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImageFile(file);
    
    const imageFormData = new FormData();
    imageFormData.append('profileImage', file);
    
    try {
      const result = await personalInfoAPI.uploadImage(imageFormData);
      setFormData(prev => ({ 
        ...prev, 
        profileImage: result.url || result.profileImage 
      }));
      setMessage('Profile image updated!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Image upload error:', error);
      setMessage('Error uploading image');
      setMessageType('error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      console.log('Submitting form data:', formData);
      
      // Using FormData to send text fields + files together
      const submitData = new FormData();
      
      // Add all text fields to FormData
      const textFields = [
        'name', 'title', 'bio', 'shortBio', 'email', 'phone', 'location',
        'linkedin', 'currentFocus', 'totalExperience', 'currentJob', 
        'currentCompany', 'lastProject'
      ];
      
      textFields.forEach(field => {
        if (formData[field] !== null && formData[field] !== undefined) {
          submitData.append(field, formData[field]);
          console.log(`Adding ${field}:`, formData[field]);
        }
      });
      
      // Add CV file if selected
      if (cvFile) {
        submitData.append('cv', cvFile);
        console.log('Adding CV file:', cvFile.name);
      }
      
      // Add image file if selected (and not already uploaded)
      if (imageFile) {
        submitData.append('profileImage', imageFile);
        console.log('Adding profile image:', imageFile.name);
      }

      // Log all FormData entries for debugging
      console.log('FormData entries:');
      for (let [key, value] of submitData.entries()) {
        console.log(key, value);
      }

      const response = await personalInfoAPI.update(submitData);
      console.log('Update response:', response);
      
      // Reload data to get the latest from server
      await loadData();
      
      // Clear file inputs
      setCvFile(null);
      setImageFile(null);
      
      setMessage('Personal info saved successfully!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving data:', error);
      setMessage('Error saving data: ' + (error.message || 'Unknown error'));
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="manage-loading">Loading...</div>;

  return (
    <div className="manage-section">
      <h2>Personal Information</h2>
      
      {message && (
        <div className={messageType === 'success' ? 'success-message' : 'error-message'}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-row">
          <div className="form-group">
            <label>Profile Image</label>
            {formData.profileImage && (
              <div className="image-preview">
                <img src={formData.profileImage} alt="Profile" />
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
            {imageFile && (
              <small style={{ color: '#10B981' }}>
                New image selected: {imageFile.name}
              </small>
            )}
          </div>

          <div className="form-group">
            <label>CV / Resume (PDF)</label>
            <input 
              type="file" 
              accept=".pdf" 
              onChange={(e) => setCvFile(e.target.files[0])} 
            />
            {cvFile && (
              <small style={{ color: '#10B981' }}>
                New CV selected: {cvFile.name}
              </small>
            )}
            {formData.cvUrl && !cvFile && (
              <small>
                Current CV: <a href={formData.cvUrl} target="_blank" rel="noopener noreferrer">View File</a>
              </small>
            )}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name || ''} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title || ''} 
              onChange={handleChange} 
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Short Bio (1 sentence)</label>
          <input 
            type="text" 
            name="shortBio" 
            value={formData.shortBio || ''} 
            onChange={handleChange} 
          />
        </div>
        
        <div className="form-group">
          <label>Full Bio</label>
          <textarea 
            name="bio" 
            rows="4" 
            value={formData.bio || ''} 
            onChange={handleChange}
          ></textarea>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email || ''} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input 
              type="tel" 
              name="phone" 
              value={formData.phone || ''} 
              onChange={handleChange} 
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Location</label>
            <input 
              type="text" 
              name="location" 
              value={formData.location || ''} 
              onChange={handleChange} 
              placeholder="City, Country"
            />
          </div>
          <div className="form-group">
            <label>LinkedIn</label>
            <input 
              type="text" 
              name="linkedin" 
              value={formData.linkedin || ''} 
              onChange={handleChange} 
              placeholder="https://linkedin.com/in/username"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Total Experience</label>
            <input 
              type="text" 
              name="totalExperience" 
              value={formData.totalExperience || ''} 
              onChange={handleChange} 
              placeholder="3+ Years" 
            />
          </div>
          <div className="form-group">
            <label>Current Job Title</label>
            <input 
              type="text" 
              name="currentJob" 
              value={formData.currentJob || ''} 
              onChange={handleChange} 
              placeholder="Senior Developer"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Current Company</label>
            <input 
              type="text" 
              name="currentCompany" 
              value={formData.currentCompany || ''} 
              onChange={handleChange} 
              placeholder="Google, Microsoft, etc."
            />
          </div>
          <div className="form-group">
            <label>Last Project</label>
            <input 
              type="text" 
              name="lastProject" 
              value={formData.lastProject || ''} 
              onChange={handleChange} 
              placeholder="E-commerce Platform, Mobile App"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Current Focus</label>
          <textarea 
            name="currentFocus" 
            rows="2" 
            value={formData.currentFocus || ''} 
            onChange={handleChange}
            placeholder="What are you currently working on?"
          ></textarea>
        </div>
        
        <button type="submit" className="save-btn" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}