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
  const [uploadingCv, setUploadingCv] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

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
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('Image must be less than 5MB');
      setMessageType('error');
      e.target.value = '';
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage('Please upload an image file');
      setMessageType('error');
      e.target.value = '';
      return;
    }
    
    setUploadingImage(true);
    setMessage('');

    try {
      // Uploads directly to Cloudinary from the browser, then saves the
      // resulting URL to the backend — see personalInfoAPI.uploadImage.
      const result = await personalInfoAPI.uploadImage(file);
      console.log('Upload result:', result);
      setFormData(prev => ({
        ...prev,
        profileImage: result.profileImage
      }));
      setMessage('Profile image updated!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Image upload error:', error);
      setMessage('Error uploading image: ' + (error.message || 'Unknown error'));
      setMessageType('error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setMessage('CV must be a PDF file');
      setMessageType('error');
      e.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage('CV must be less than 10MB');
      setMessageType('error');
      e.target.value = '';
      return;
    }

    setUploadingCv(true);
    setMessage('');

    try {
      // Uploads directly to Cloudinary from the browser, then saves the
      // resulting URL to the backend — see personalInfoAPI.uploadCV.
      const result = await personalInfoAPI.uploadCV(file);
      console.log('CV upload result:', result);
      setFormData(prev => ({
        ...prev,
        cvUrl: result.cvUrl
      }));
      setMessage('CV updated!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('CV upload error:', error);
      setMessage('Error uploading CV: ' + (error.message || 'Unknown error'));
      setMessageType('error');
    } finally {
      setUploadingCv(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      console.log('Submitting form data:', formData);

      // Profile image and CV are already uploaded and saved (they go out
      // immediately on file selection — see handleImageUpload/handleCvUpload).
      // This submit only needs to send the text fields, as plain JSON.
      const textFields = [
        'name', 'title', 'bio', 'shortBio', 'email', 'phone', 'location',
        'linkedin', 'currentFocus', 'totalExperience', 'currentJob',
        'currentCompany', 'lastProject'
      ];

      const textData = {};
      textFields.forEach(field => {
        if (formData[field] !== null && formData[field] !== undefined) {
          textData[field] = formData[field];
        }
      });

      console.log('Submitting text data:', textData);

      const response = await personalInfoAPI.update(textData);
      console.log('Update response:', response);

      // Reload data to get the latest from server
      await loadData();

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
              disabled={uploadingImage}
            />
            {uploadingImage && (
              <small style={{ color: '#6B7280' }}>Uploading image…</small>
            )}
          </div>

          <div className="form-group">
            <label>CV / Resume (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleCvUpload}
              disabled={uploadingCv}
            />
            {uploadingCv && (
              <small style={{ color: '#6B7280' }}>Uploading CV…</small>
            )}
            {formData.cvUrl && !uploadingCv && (
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
              placeholder="Your full name"
            />
          </div>
          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title || ''} 
              onChange={handleChange} 
              placeholder="e.g., Senior Developer"
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
            placeholder="A brief one-liner about yourself"
          />
        </div>
        
        <div className="form-group">
          <label>Full Bio</label>
          <textarea 
            name="bio" 
            rows="4" 
            value={formData.bio || ''} 
            onChange={handleChange}
            placeholder="Tell your story..."
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
              placeholder="your@email.com"
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