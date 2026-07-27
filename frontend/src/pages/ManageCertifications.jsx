import React, { useState, useEffect } from 'react';
import { educationAPI, certificationAPI, uploadToCloudinaryDirect, uploadPDFToCloudinaryDirect } from '../services/api';
import './ManageCertifications.css';

export default function ManageCertifications() {
  const [certifications, setCertifications] = useState([]);
  const [educations, setEducations] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [certificateFile, setCertificateFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '', 
    issuer: '', 
    date: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => { 
    loadData(); 
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading certifications...');
      
      const certsData = await certificationAPI.getAll();
      console.log('📚 Loaded certifications:', certsData);
      
      setCertifications(Array.isArray(certsData) ? certsData : []);
      
      try {
        const eduData = await educationAPI.get();
        setEducations(Array.isArray(eduData) ? eduData : []);
      } catch (eduError) {
        console.log('Could not load education data:', eduError);
      }
      
      setError(null);
    } catch (error) { 
      console.error('❌ Error loading data:', error);
      setError('Failed to load certifications');
    } finally { 
      setLoading(false); 
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        e.target.value = '';
        return;
      }
      
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a PDF or image file (JPG, PNG, GIF, WEBP)');
        e.target.value = '';
        return;
      }
      
      if (type === 'certificate') {
        setCertificateFile(file);
        console.log('Certificate file selected:', file.name);
      } else if (type === 'logo') {
        setLogoFile(file);
        console.log('Logo file selected:', file.name);
      }
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setUploading(true);
    
    if (!formData.name || formData.name.trim() === '') {
      setError('Certification name is required');
      alert('Certification name is required');
      setUploading(false);
      return;
    }
    
    try {
      console.log('📤 Submitting certification:', formData);
      
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('issuer', formData.issuer || '');
      submitData.append('date', formData.date || '');
      
      // ✅ Upload certificate directly to Cloudinary
      if (certificateFile) {
        const resourceType = certificateFile.type === 'application/pdf' ? 'raw' : 'image';
        const folder = resourceType === 'raw' ? 'certifications' : 'certifications';
        const result = await uploadToCloudinaryDirect(certificateFile, { 
          resourceType: resourceType,
          folder: `portfolio/${folder}`
        });
        submitData.append('certificateUrl', result.secure_url);
        submitData.append('certificatePublicId', result.public_id);
        console.log('✅ Certificate uploaded:', result.secure_url);
      }
      
      // ✅ Upload logo directly to Cloudinary
      if (logoFile) {
        const result = await uploadToCloudinaryDirect(logoFile, { 
          resourceType: 'image',
          folder: 'portfolio/certification-logos'
        });
        submitData.append('logoUrl', result.secure_url);
        submitData.append('logoPublicId', result.public_id);
        console.log('✅ Logo uploaded:', result.secure_url);
      }

      let response;
      if (editing) {
        response = await certificationAPI.update(editing.id, submitData);
        console.log('✅ Certification updated:', response);
        setSuccess('Certification updated successfully!');
      } else {
        response = await certificationAPI.create(submitData);
        console.log('✅ Certification created:', response);
        setSuccess('Certification added successfully!');
      }
      
      resetForm();
      await loadData();
      
      setTimeout(() => setSuccess(null), 5000);
      
    } catch (error) { 
      console.error('❌ Error saving certification:', error);
      setError(error.message || 'Unknown error occurred');
      alert('Error saving certification: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: '', 
      issuer: '', 
      date: '' 
    });
    setCertificateFile(null);
    setLogoFile(null);
    setEditing(null);
    setError(null);
    
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => input.value = '');
  };

  const handleEdit = (cert) => {
    setEditing(cert);
    setFormData({
      name: cert.name || '',
      issuer: cert.issuer || '',
      date: cert.date || ''
    });
    setCertificateFile(null);
    setLogoFile(null);
    setError(null);
    
    document.querySelector('.admin-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certification?')) {
      return;
    }
    
    try {
      console.log('🗑️ Deleting certification:', id);
      await certificationAPI.delete(id);
      console.log('✅ Certification deleted');
      await loadData();
      setSuccess('Certification deleted successfully!');
      setTimeout(() => setSuccess(null), 5000);
    } catch (error) {
      console.error('❌ Delete error:', error);
      setError('Failed to delete certification');
      alert('Error deleting certification');
    }
  };

  const handleDownload = (certificateUrl, fileName) => {
    if (!certificateUrl) {
      alert('No certificate file available');
      return;
    }
    window.open(certificateUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="manage-section">
        <div className="manage-loading">Loading certifications...</div>
      </div>
    );
  }

  return (
    <div className="manage-section">
      <h2>Manage Certifications</h2>
      
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
            <label>Certification Name *</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              placeholder="e.g., AWS Certified Developer"
            />
          </div>
          <div className="form-group">
            <label>Issuer</label>
            <input 
              type="text" 
              name="issuer" 
              value={formData.issuer} 
              onChange={handleChange} 
              placeholder="e.g., Amazon Web Services"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Date</label>
            <input 
              type="text" 
              name="date" 
              value={formData.date} 
              onChange={handleChange} 
              placeholder="e.g., 2024 or March 2024"
            />
          </div>
          <div className="form-group">
            <label>Issuer Logo (Image)</label>
            <input 
              type="file" 
              accept=".jpg,.jpeg,.png,.gif,.webp,.svg" 
              onChange={(e) => handleFileChange(e, 'logo')} 
              disabled={uploading}
            />
            {logoFile && (
              <small style={{ color: '#10B981' }}>
                ✅ New logo selected: {logoFile.name} 
                ({(logoFile.size / 1024).toFixed(1)} KB)
              </small>
            )}
            {editing && editing.logoUrl && !logoFile && (
              <small>
                🖼️ Current logo: <a href={editing.logoUrl} target="_blank" rel="noopener noreferrer">View Logo</a>
              </small>
            )}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Certificate File (PDF/Image)</label>
            <input 
              type="file" 
              accept=".pdf,.jpg,.jpeg,.png,.gif,.webp" 
              onChange={(e) => handleFileChange(e, 'certificate')} 
              disabled={uploading}
            />
            {certificateFile && (
              <small style={{ color: '#10B981' }}>
                ✅ New file selected: {certificateFile.name} 
                ({(certificateFile.size / 1024).toFixed(1)} KB)
              </small>
            )}
            {editing && editing.certificateUrl && !certificateFile && (
              <small>
                📎 Current file: <a href={editing.certificateUrl} target="_blank" rel="noopener noreferrer">View Certificate</a>
              </small>
            )}
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="save-btn" disabled={uploading}>
            {uploading ? 'Uploading...' : (editing ? 'Update' : 'Add') + ' Certification'}
          </button>
          {editing && (
            <button type="button" className="cancel-btn" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>
      
      <div className="items-list">
        <h3>Existing Certifications ({certifications.length})</h3>
        {certifications.length === 0 ? (
          <p className="no-items">No certifications added yet</p>
        ) : (
          certifications.map((cert, index) => (
            <div key={cert.id || index} className="list-item">
              <div className="item-info">
                <div className="cert-item-header">
                  {cert.logoUrl && (
                    <img 
                      src={cert.logoUrl} 
                      alt={cert.issuer || 'Logo'} 
                      className="cert-logo-thumb"
                    />
                  )}
                  <div>
                    <strong>{cert.name || 'Unnamed'}</strong> 
                    {cert.issuer && ` - ${cert.issuer}`}
                    <p className="item-description">
                      Date: {cert.date || 'Not specified'}
                    </p>
                    {cert.certificateUrl && (
                      <span className="file-status">📄 Certificate uploaded</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="item-actions">
                {cert.certificateUrl && (
                  <button 
                    onClick={() => handleDownload(cert.certificateUrl, cert.name)} 
                    className="download-btn"
                    title="Download Certificate"
                  >
                    📥 Download
                  </button>
                )}
                <button 
                  onClick={() => handleEdit(cert)} 
                  className="edit-btn"
                >
                  ✏️ Edit
                </button>
                <button 
                  onClick={() => handleDelete(cert.id)} 
                  className="delete-btn"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}