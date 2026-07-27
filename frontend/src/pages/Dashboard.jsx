import React, { useState } from 'react';
import ManageSkills from './ManageSkills';
import ManageProjects from './ManageProjects';
import ManageEducation from './ManageEducation';
import ManageCertifications from './ManageCertifications';
import ManageCourses from './ManageCourses';
import ManagePersonalInfo from './ManagePersonalInfo';
import ManageExperience from './ManageExperience'; // ✅ Import Experience
import './Dashboard.css';

export default function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('personal');

  const tabs = [
    { id: 'personal', label: ' Personal Info', icon: '👤' },
    { id: 'education', label: ' Education', icon: '🎓' },
    { id: 'certifications', label: ' Certifications', icon: '📜' },
    { id: 'courses', label: ' Courses', icon: '📚' },
    { id: 'experience', label: ' Experience', icon: '💼' }, // ✅ Added Experience tab
    { id: 'skills', label: ' Skills', icon: '💻' },
    { id: 'projects', label: ' Projects', icon: '🚀' },
  ];

  const adminEmail = localStorage.getItem('adminEmail');

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Portfolio Admin Dashboard</h1>
          <span className="admin-badge">Admin</span>
        </div>
        <div className="header-right">
          <span className="admin-email">{adminEmail}</span>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>
      
      <div className="dashboard-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'personal' && <ManagePersonalInfo />}
        {activeTab === 'education' && <ManageEducation />}
        {activeTab === 'certifications' && <ManageCertifications />}
        {activeTab === 'courses' && <ManageCourses />}
        {activeTab === 'experience' && <ManageExperience />} {/* ✅ Experience tab content */}
        {activeTab === 'skills' && <ManageSkills />}
        {activeTab === 'projects' && <ManageProjects />}
      </div>
    </div>
  );
}