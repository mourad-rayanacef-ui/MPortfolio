import React, { createContext, useContext, useState, useEffect } from 'react';
import { skillAPI, projectAPI, educationAPI, personalInfoAPI, certificationAPI, experienceAPI } from '../services/api';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [education, setEducation] = useState(null);
  const [personalInfo, setPersonalInfo] = useState(null);
  const [certifications, setCertifications] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cache duration (5 minutes)
  const CACHE_DURATION = 5 * 60 * 1000;

  const fetchAllData = async () => {
    setLoading(true);
    try {
      console.log('🔄 Fetching all data...');
      
      // Check cache first
      const cached = localStorage.getItem('portfolioData');
      const cacheTime = localStorage.getItem('portfolioDataTime');
      
      if (cached && cacheTime && (Date.now() - parseInt(cacheTime)) < CACHE_DURATION) {
        console.log('📦 Using cached data');
        const data = JSON.parse(cached);
        setSkills(data.skills || []);
        setProjects(data.projects || []);
        setEducation(data.education || null);
        setPersonalInfo(data.personalInfo || null);
        setCertifications(data.certifications || []);
        setExperiences(data.experiences || []);
        setLoading(false);
        return;
      }
      
      // Fetch fresh data with Promise.all
      const [skillsData, projectsData, educationData, personalData, certsData, expData] = await Promise.all([
        skillAPI.getAll().catch(() => []),
        projectAPI.getAll().catch(() => []),
        educationAPI.get().catch(() => null),
        personalInfoAPI.get().catch(() => null),
        certificationAPI.getAll().catch(() => []),
        experienceAPI.getAll().catch(() => [])
      ]);
      
      const data = {
        skills: skillsData || [],
        projects: projectsData || [],
        education: educationData || null,
        personalInfo: personalData || null,
        certifications: certsData || [],
        experiences: expData || []
      };
      
      // Save to cache
      localStorage.setItem('portfolioData', JSON.stringify(data));
      localStorage.setItem('portfolioDataTime', String(Date.now()));
      
      setSkills(data.skills);
      setProjects(data.projects);
      setEducation(data.education);
      setPersonalInfo(data.personalInfo);
      setCertifications(data.certifications);
      setExperiences(data.experiences);
      setError(null);
    } catch (err) { 
      console.error('❌ Error fetching data:', err); 
      setError(err.message);
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    fetchAllData(); 
  }, []);

  const refetch = () => {
    localStorage.removeItem('portfolioData');
    localStorage.removeItem('portfolioDataTime');
    fetchAllData();
  };

  const refreshPersonalInfo = async () => {
    try {
      const data = await personalInfoAPI.get();
      setPersonalInfo(data || null);
      // Update cache
      const cached = localStorage.getItem('portfolioData');
      if (cached) {
        const parsed = JSON.parse(cached);
        parsed.personalInfo = data || null;
        localStorage.setItem('portfolioData', JSON.stringify(parsed));
      }
      return data;
    } catch (error) {
      console.error('Error refreshing personal info:', error);
      throw error;
    }
  };

  return (
    <DataContext.Provider value={{ 
      skills, 
      projects, 
      education, 
      personalInfo, 
      certifications,
      experiences,
      loading, 
      error, 
      refetch,
      refreshPersonalInfo
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export default DataProvider;