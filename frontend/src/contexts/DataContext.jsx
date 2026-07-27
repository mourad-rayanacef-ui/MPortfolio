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

  const fetchAllData = async () => {
    setLoading(true);
    try {
      console.log('🔄 Fetching all data...');
      
      const [skillsData, projectsData, educationData, personalData, certsData, expData] = await Promise.all([
        skillAPI.getAll().catch(() => []),
        projectAPI.getAll().catch(() => []),
        educationAPI.get().catch(() => null),
        personalInfoAPI.get().catch(() => null),
        certificationAPI.getAll().catch(() => []),
        experienceAPI.getAll().catch(() => [])
      ]);
      
      console.log('✅ Skills loaded:', skillsData);
      console.log('✅ Projects loaded:', projectsData);
      console.log('✅ Education loaded:', educationData);
      console.log('✅ Personal Info loaded:', personalData);
      console.log('✅ Certifications loaded:', certsData);
      console.log('✅ Experiences loaded:', expData);
      
      setSkills(skillsData || []);
      setProjects(projectsData || []);
      setEducation(educationData || null);
      setPersonalInfo(personalData || null);
      setCertifications(certsData || []);
      setExperiences(expData || []);
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

  const refetch = () => fetchAllData();

  const refreshPersonalInfo = async () => {
    try {
      const data = await personalInfoAPI.get();
      setPersonalInfo(data || null);
      return data;
    } catch (error) {
      console.error('Error refreshing personal info:', error);
      throw error;
    }
  };

  const refreshExperiences = async () => {
    try {
      const data = await experienceAPI.getAll();
      setExperiences(data || []);
      return data;
    } catch (error) {
      console.error('Error refreshing experiences:', error);
      throw error;
    }
  };

  const refreshCertifications = async () => {
    try {
      const data = await certificationAPI.getAll();
      setCertifications(data || []);
      return data;
    } catch (error) {
      console.error('Error refreshing certifications:', error);
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
      refreshPersonalInfo,
      refreshExperiences,
      refreshCertifications
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