import React, { useState, useEffect } from 'react';
import { projectAPI } from '../services/api';
import './ManageProjects.css';

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    techStack: [],
    description: '',
    details: '',
    startDate: '',
    endDate: '',
    challenges: '',
    learnings: ''
  });

  useEffect(() => { loadProjects(); }, []);

  const loadProjects = async () => {
    try { 
      const data = await projectAPI.getAll(); 
      setProjects(data); 
    } catch (error) { 
      console.error('Error:', error); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTechStack = (e) => {
    setFormData({ ...formData, techStack: e.target.value.split(',').map(t => t.trim()).filter(Boolean) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'techStack') submitData.append(key, JSON.stringify(formData[key]));
      else if (formData[key] !== undefined && formData[key] !== null) submitData.append(key, formData[key]);
    });
    if (imageFile) submitData.append('image', imageFile);
    
    try {
      if (editing) {
        await projectAPI.update(editing.id, submitData);
      } else {
        await projectAPI.create(submitData);
      }
      resetForm();
      loadProjects();
    } catch (error) { 
      console.error('Error:', error); 
      alert('Error saving project: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: '', 
      techStack: [], 
      description: '', 
      details: '', 
      startDate: '', 
      endDate: '', 
      challenges: '', 
      learnings: '' 
    });
    setImageFile(null);
    setEditing(null);
  };

  const handleEdit = (project) => {
    setEditing(project);
    setFormData(project);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this project?')) {
      await projectAPI.delete(id);
      loadProjects();
    }
  };

  if (loading) return <div className="manage-loading">Loading...</div>;

  return (
    <div className="manage-section">
      <h2>Manage Projects</h2>
      
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-row">
          <div className="form-group">
            <label>Project Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              placeholder="e.g., E-Commerce Platform"
            />
          </div>
          <div className="form-group">
            <label>Tech Stack (comma separated)</label>
            <input 
              type="text" 
              value={formData.techStack?.join(', ')} 
              onChange={handleTechStack} 
              placeholder="React, Node.js, MongoDB"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Start Date</label>
            <input 
              type="text" 
              name="startDate" 
              value={formData.startDate} 
              onChange={handleChange} 
              placeholder="Jan 2024"
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input 
              type="text" 
              name="endDate" 
              value={formData.endDate} 
              onChange={handleChange} 
              placeholder="Present"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Project Image</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => setImageFile(e.target.files[0])} 
          />
          {formData.image && !imageFile && (
            <small>Current: {formData.image.split('/').pop()}</small>
          )}
        </div>
        
        <div className="form-group">
          <label>Short Description</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            rows="2" 
            placeholder="Brief description of the project"
          />
        </div>
        
        <div className="form-group">
          <label>Full Details</label>
          <textarea 
            name="details" 
            value={formData.details} 
            onChange={handleChange} 
            rows="4" 
            placeholder="Detailed description of the project, its purpose, and your role"
          />
        </div>
        
        <div className="form-group">
          <label>Challenges</label>
          <textarea 
            name="challenges" 
            value={formData.challenges} 
            onChange={handleChange} 
            rows="2" 
            placeholder="What challenges did you face?"
          />
        </div>
        
        <div className="form-group">
          <label>Key Learnings</label>
          <textarea 
            name="learnings" 
            value={formData.learnings} 
            onChange={handleChange} 
            rows="2" 
            placeholder="What did you learn from this project?"
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="save-btn">
            {editing ? 'Update' : 'Create'} Project
          </button>
          {editing && (
            <button type="button" className="cancel-btn" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>
      
      <div className="items-list">
        <h3>Existing Projects</h3>
        {projects.map(project => (
          <div key={project.id} className="list-item">
            <div className="item-info">
              {project.image && (
                <img 
                  src={project.image} 
                  alt={project.name} 
                  className="item-thumbnail"
                />
              )}
              <div>
                <strong>{project.name}</strong>
                <p className="item-description">{project.description}</p>
                <div className="item-tech">
                  {project.techStack?.slice(0, 3).map(t => (
                    <span key={t} className="tech-tag">{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="item-actions">
              <button onClick={() => handleEdit(project)} className="edit-btn">Edit</button>
              <button onClick={() => handleDelete(project.id)} className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}