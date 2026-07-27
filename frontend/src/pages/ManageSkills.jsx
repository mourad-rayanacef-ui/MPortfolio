import React, { useState, useEffect } from 'react';
import { skillAPI } from '../services/api';
import './ManageSkills.css';

export default function ManageSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [iconFile, setIconFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    level: 50,
    icon: '⚛️',
    iconType: 'emoji',
    iconUrl: '',
    description: '',
    since: '',
    projects: [],
    order: 0,
    isActive: true
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const data = await skillAPI.getAll();
      setSkills(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      console.error('Error loading skills:', error);
      setError('Failed to load skills');
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
      
      setIconFile(file);
      setError(null);
    }
  };

  const handleProjectsChange = (e) => {
    const projects = e.target.value.split(',').map(p => p.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, projects }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // ✅ Validate required fields
    if (!formData.name || formData.name.trim() === '') {
      setError('Skill name is required');
      alert('Skill name is required');
      return;
    }
    
    if (!formData.category || formData.category.trim() === '') {
      setError('Category is required');
      alert('Category is required');
      return;
    }
    
    try {
      console.log('📤 Submitting skill:', formData);
      
      // ✅ Create FormData and append all fields
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('category', formData.category.trim());
      submitData.append('level', formData.level || 50);
      submitData.append('icon', formData.icon || '⚛️');
      submitData.append('iconType', formData.iconType || 'emoji');
      submitData.append('description', formData.description || '');
      submitData.append('since', formData.since || '');
      submitData.append('projects', JSON.stringify(formData.projects || []));
      submitData.append('order', formData.order || 0);
      submitData.append('isActive', formData.isActive !== undefined ? formData.isActive : true);
      
      // ✅ Add icon file if selected
      if (iconFile) {
        submitData.append('iconImage', iconFile);
        console.log('📎 Icon file attached:', iconFile.name);
      }

      // ✅ Log FormData contents for debugging
      console.log('📤 FormData entries:');
      for (let [key, value] of submitData.entries()) {
        console.log(`  ${key}: ${value}`);
      }

      let response;
      if (editing) {
        response = await skillAPI.update(editing.id, submitData);
        console.log('✅ Skill updated:', response);
        setSuccess('Skill updated successfully!');
      } else {
        response = await skillAPI.create(submitData);
        console.log('✅ Skill created:', response);
        setSuccess('Skill added successfully!');
      }
      
      resetForm();
      await loadSkills();
      
      setTimeout(() => setSuccess(null), 5000);
    } catch (error) {
      console.error('❌ Error saving skill:', error);
      setError(error.message || 'Failed to save skill');
      alert('Error saving skill: ' + (error.message || 'Unknown error'));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      level: 50,
      icon: '⚛️',
      iconType: 'emoji',
      iconUrl: '',
      description: '',
      since: '',
      projects: [],
      order: 0,
      isActive: true
    });
    setIconFile(null);
    setEditing(null);
    setError(null);
    
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const handleEdit = (skill) => {
    setEditing(skill);
    setFormData({
      name: skill.name || '',
      category: skill.category || '',
      level: skill.level || 50,
      icon: skill.icon || '⚛️',
      iconType: skill.iconType || 'emoji',
      iconUrl: skill.iconUrl || '',
      description: skill.description || '',
      since: skill.since || '',
      projects: skill.projects || [],
      order: skill.order || 0,
      isActive: skill.isActive !== undefined ? skill.isActive : true
    });
    setIconFile(null);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      await skillAPI.delete(id);
      await loadSkills();
      setSuccess('Skill deleted successfully!');
      setTimeout(() => setSuccess(null), 5000);
    } catch (error) {
      console.error('Error deleting skill:', error);
      setError('Failed to delete skill');
      alert('Error deleting skill');
    }
  };

  if (loading) return <div className="manage-loading">Loading...</div>;

  return (
    <div className="manage-section">
      <h2>Manage Skills</h2>
      
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
            <label>Skill Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., React"
            />
          </div>
          <div className="form-group">
            <label>Category *</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              placeholder="Frontend, Backend, etc."
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Icon Type</label>
            <select
              name="iconType"
              value={formData.iconType}
              onChange={handleChange}
            >
              <option value="none">No Icon</option>
              <option value="emoji">Emoji</option>
              <option value="image">Upload Image</option>
              <option value="svg">SVG</option>
            </select>
          </div>
          <div className="form-group">
            {formData.iconType === 'none' && (
              <div style={{ padding: '0.5rem 0', color: '#6B7280' }}>
                No icon will be displayed
              </div>
            )}
            {formData.iconType === 'emoji' && (
              <>
                <label>Emoji</label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="⚛️"
                />
              </>
            )}
            {formData.iconType === 'image' && (
              <>
                <label>Upload Icon Image</label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
                  onChange={handleFileChange}
                />
                {iconFile && (
                  <small style={{ color: '#10B981' }}>
                    ✅ New file selected: {iconFile.name}
                  </small>
                )}
                {editing && editing.iconUrl && !iconFile && (
                  <small>
                    Current icon: <a href={editing.iconUrl} target="_blank" rel="noopener noreferrer">View Icon</a>
                  </small>
                )}
              </>
            )}
            {formData.iconType === 'svg' && (
              <>
                <label>SVG Code</label>
                <textarea
                  name="iconUrl"
                  value={formData.iconUrl}
                  onChange={handleChange}
                  rows="3"
                  placeholder="<svg>...</svg>"
                />
              </>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Level (0-100)</label>
            <input
              type="number"
              name="level"
              value={formData.level}
              onChange={handleChange}
              min="0"
              max="100"
            />
          </div>
          <div className="form-group">
            <label>Since</label>
            <input
              type="text"
              name="since"
              value={formData.since}
              onChange={handleChange}
              placeholder="2020"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            rows="2"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of your experience with this skill"
          />
        </div>

        <div className="form-group">
          <label>Projects (comma separated)</label>
          <input
            type="text"
            value={formData.projects.join(', ')}
            onChange={handleProjectsChange}
            placeholder="Project 1, Project 2, Project 3"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Order</label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
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
          <button type="submit" className="save-btn">
            {editing ? 'Update' : 'Add'} Skill
          </button>
          {editing && (
            <button type="button" className="cancel-btn" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="items-list">
        <h3>Existing Skills ({skills.length})</h3>
        {skills.length === 0 ? (
          <p className="no-items">No skills added yet</p>
        ) : (
          skills.map(skill => (
            <div key={skill.id} className="list-item">
              <div className="item-info">
                <strong>
                  {skill.iconType === 'image' && skill.iconUrl ? (
                    <img src={skill.iconUrl} alt={skill.name} style={{ width: 24, height: 24, marginRight: 8, objectFit: 'contain' }} />
                  ) : skill.iconType === 'svg' && skill.iconUrl ? (
                    <span dangerouslySetInnerHTML={{ __html: skill.iconUrl }} style={{ display: 'inline-block', width: 24, height: 24, marginRight: 8 }} />
                  ) : skill.iconType === 'none' ? (
                    <span style={{ marginRight: 8, color: '#9CA3AF' }}>⊘</span>
                  ) : (
                    <span style={{ marginRight: 8 }}>{skill.icon || '⚛️'}</span>
                  )}
                  {skill.name}
                </strong>
                <p className="item-description">
                  {skill.category} • Level: {skill.level}% • Since: {skill.since || 'N/A'}
                </p>
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(skill)} className="edit-btn">Edit</button>
                <button onClick={() => handleDelete(skill.id)} className="delete-btn">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}