import React, { useState, useEffect } from 'react';
import { educationAPI } from '../services/api';
import './ManageEducation.css';

export default function ManageEducation() {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [certificateFiles, setCertificateFiles] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEducations();
  }, []);

  const loadEducations = async () => {
    try {
      const data = await educationAPI.get();
      console.log('Loaded educations:', data);
      setEducations(Array.isArray(data) ? data : data ? [data] : []);
      setError(null);
    } catch (error) {
      console.error('Error loading educations:', error);
      setError('Failed to load education data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (index, field, value) => {
    const updated = [...educations];
    updated[index] = { ...updated[index], [field]: value };
    setEducations(updated);
  };

  const handleFileChange = (id, file) => {
    setCertificateFiles(prev => ({ ...prev, [id]: file }));
  };

  const handleAddNew = () => {
    setEducations([
      ...educations,
      {
        id: 'temp-' + Date.now(),
        degree: '',
        university: '',
        startYear: '',
        expectedGraduationYear: '',
        description: '',
        coursesTaken: '',
        isNew: true
      }
    ]);
  };

  const handleSave = async (edu) => {
    setSavingId(edu.id);
    setError(null);
    
    try {
      console.log('Saving education:', edu);
      
      const submitData = new FormData();
      
      // Add all fields to FormData
      Object.entries(edu).forEach(([key, value]) => {
        if (value !== null && value !== undefined && 
            key !== 'Certifications' && key !== 'Courses' && 
            key !== 'isNew' && key !== 'id' && key !== 'certificateUrl' && 
            key !== 'certificatePublicId' && key !== 'createdAt' && 
            key !== 'updatedAt') {
          submitData.append(key, String(value));
        }
      });

      // Add certificate file if present
      if (certificateFiles[edu.id]) {
        submitData.append('certificate', certificateFiles[edu.id]);
        console.log('Adding certificate file:', certificateFiles[edu.id].name);
      }

      let response;
      
      // Check if this is a new entry OR if we should create it as new
      // If the ID doesn't exist in database, treat as new
      const isNewRecord = edu.isNew || String(edu.id).startsWith('temp-');
      
      if (isNewRecord) {
        // Create new education
        console.log('Creating new education...');
        // Remove the 'id' from FormData for new entries
        submitData.delete('id');
        response = await educationAPI.create(submitData);
        console.log('Created:', response);
      } else {
        // Try to update existing education
        console.log('Attempting to update education with ID:', edu.id);
        try {
          response = await educationAPI.update(edu.id, submitData);
          console.log('Updated:', response);
        } catch (updateError) {
          // If update fails with 404, try creating it instead
          if (updateError.message.includes('404') || updateError.message.includes('Not Found')) {
            console.log('Education not found, creating new instead...');
            submitData.delete('id');
            response = await educationAPI.create(submitData);
            console.log('Created new:', response);
          } else {
            throw updateError;
          }
        }
      }

      // Reload data to get latest from server
      await loadEducations();
      
      // Clear the file input for this education
      setCertificateFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[edu.id];
        return newFiles;
      });

      alert('Education saved successfully!');
    } catch (err) {
      console.error('Save error:', err);
      const errorMessage = err.message || 'Failed to save education';
      setError(errorMessage);
      alert(`Error: ${errorMessage}\n\nCheck console for details.`);
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this education entry?')) return;
    
    // If it's a temp ID, just remove from local state
    if (String(id).startsWith('temp-')) {
      setEducations(educations.filter(e => e.id !== id));
      return;
    }

    try {
      await educationAPI.delete(id);
      await loadEducations();
      alert('Education deleted successfully.');
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete education.');
    }
  };

  if (loading) {
    return <div className="manage-loading">Loading...</div>;
  }

  return (
    <div className="manage-section">
      <div className="manage-header-flex" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1.5rem' 
      }}>
        <h2>Education Settings</h2>
        <button type="button" className="save-btn" onClick={handleAddNew} style={{ margin: 0 }}>
          + Add Another School
        </button>
      </div>

      {error && (
        <div style={{ 
          background: '#FEE2E2', 
          color: '#991B1B', 
          padding: '0.75rem', 
          borderRadius: '8px', 
          marginBottom: '1rem',
          border: '1px solid #FECACA'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {educations.map((edu, index) => (
        <div key={edu.id || index} className="admin-form-block" style={{ 
          marginBottom: '2.5rem', 
          paddingBottom: '2rem', 
          borderBottom: '2px solid rgba(0,0,0,0.08)' 
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '1rem' 
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>
              School #{index + 1} {edu.isNew && '(New)'}
              {edu.id && !edu.isNew && !String(edu.id).startsWith('temp-') && ` (ID: ${edu.id.substring(0, 8)}...)`}
            </h3>
            <button 
              type="button" 
              onClick={() => handleDelete(edu.id)}
              style={{ 
                background: '#EF4444', 
                color: 'white', 
                border: 'none', 
                padding: '0.4rem 0.8rem', 
                borderRadius: '6px', 
                cursor: 'pointer', 
                fontSize: '0.75rem' 
              }}
            >
              Delete School
            </button>
          </div>

          <form className="admin-form" onSubmit={(e) => { 
            e.preventDefault(); 
            handleSave(edu); 
          }}>
            <div className="form-row">
              <div className="form-group">
                <label>Degree *</label>
                <input
                  type="text"
                  value={edu.degree || ''}
                  onChange={(e) => handleFieldChange(index, 'degree', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>University / Institution *</label>
                <input
                  type="text"
                  value={edu.university || ''}
                  onChange={(e) => handleFieldChange(index, 'university', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Year</label>
                <input
                  type="number"
                  value={edu.startYear || ''}
                  onChange={(e) => handleFieldChange(index, 'startYear', e.target.value)}
                  min="1900"
                  max="2100"
                />
              </div>
              <div className="form-group">
                <label>Expected Graduation Year</label>
                <input
                  type="number"
                  value={edu.expectedGraduationYear || ''}
                  onChange={(e) => handleFieldChange(index, 'expectedGraduationYear', e.target.value)}
                  min="1900"
                  max="2100"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                rows={4}
                value={edu.description || ''}
                onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
                placeholder="Describe your education experience..."
              />
            </div>

            <div className="form-group">
              <label>Relevant Coursework</label>
              <textarea
                rows={6}
                value={edu.coursesTaken || ''}
                onChange={(e) => handleFieldChange(index, 'coursesTaken', e.target.value)}
                placeholder="Write ONE course per line."
              />
            </div>

            <div className="form-group">
              <label>Diploma Certificate (PDF)</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleFileChange(edu.id, file);
                  }
                }}
              />
              {certificateFiles[edu.id] && (
                <small style={{ color: '#10B981' }}>
                  ✓ New file selected: {certificateFiles[edu.id].name}
                </small>
              )}
              {edu.certificateUrl && !certificateFiles[edu.id] && (
                <small>
                  Current Certificate:{' '}
                  <a href={edu.certificateUrl} target="_blank" rel="noopener noreferrer">
                    View Certificate
                  </a>
                </small>
              )}
            </div>

            <button type="submit" className="save-btn" disabled={savingId === edu.id}>
              {savingId === edu.id ? 'Saving...' : 'Save This Education'}
            </button>
          </form>
        </div>
      ))}

      {educations.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>
          <p>No education entries yet.</p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Click the <strong>"Add Another School"</strong> button to get started.
          </p>
        </div>
      )}
    </div>
  );
}