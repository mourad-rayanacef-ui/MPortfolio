import React, { useState, useEffect } from 'react';
import { educationAPI } from '../services/api';
import './ManageCourses.css';

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [education, setEducation] = useState(null);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '', grade: '', skills: []
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const edu = await educationAPI.get();
      setEducation(edu);
      setCourses(edu?.Courses || []);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkills = (e) => {
    setFormData({ ...formData, skills: e.target.value.split(',').map(s => s.trim()) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await educationAPI.updateCourse(editing.id, formData);
      } else {
        await educationAPI.addCourse(formData);
      }
      resetForm();
      loadData();
    } catch (error) { console.error('Error:', error); }
  };

  const resetForm = () => {
    setFormData({ name: '', grade: '', skills: [] });
    setEditing(null);
  };

  const handleEdit = (course) => {
    setEditing(course);
    setFormData(course);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this course?')) {
      await educationAPI.deleteCourse(id);
      loadData();
    }
  };

  if (loading) return <div className="manage-loading">Loading...</div>;

  return (
    <div className="manage-section">
      <h2>Manage Courses</h2>
      
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-row">
          <div className="form-group">
            <label>Course Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Grade</label>
            <input type="text" name="grade" value={formData.grade} onChange={handleChange} placeholder="A / 85%" />
          </div>
        </div>
        
        <div className="form-group">
          <label>Skills (comma separated)</label>
          <input type="text" value={formData.skills?.join(', ')} onChange={handleSkills} placeholder="React, Node.js, MongoDB" />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="save-btn">{editing ? 'Update' : 'Add'} Course</button>
          {editing && <button type="button" className="cancel-btn" onClick={resetForm}>Cancel</button>}
        </div>
      </form>
      
      <div className="items-list">
        <h3>Existing Courses</h3>
        {courses.map(course => (
          <div key={course.id} className="list-item">
            <div className="item-info">
              <strong>{course.name}</strong> - Grade: {course.grade}
              <div className="item-tech">{course.skills?.map(s => <span key={s} className="tech-tag">{s}</span>)}</div>
            </div>
            <div className="item-actions">
              <button onClick={() => handleEdit(course)} className="edit-btn">Edit</button>
              <button onClick={() => handleDelete(course.id)} className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}