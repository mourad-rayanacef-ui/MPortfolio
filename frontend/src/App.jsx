import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider, useData } from './contexts/DataContext';
import { useDarkMode } from './hooks/useDarkMode';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Education from './components/Education';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/admin" replace />;
  }
  return children;
}

function MainApp() {
  const { isDark, toggleDarkMode } = useDarkMode();
  const { personalInfo, loading } = useData();

  if (loading) {
    return (
      <div className={`loading-screen ${isDark ? 'dark' : ''}`}>
        <LoadingSpinner size="large" color="#F9977B" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={`app ${isDark ? 'dark' : ''}`}>
      <Navigation darkMode={isDark} toggleDarkMode={toggleDarkMode} />
      <Hero personalInfo={personalInfo} darkMode={isDark} />
      <About personalInfo={personalInfo} />
      <Education />
      <Skills darkMode={isDark} />
      <Experience />
      <Projects darkMode={isDark} />
      <Contact personalInfo={personalInfo} />
      <Footer personalInfo={personalInfo} />
    </div>
  );
}

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsAdminLoggedIn(!!token);
  }, []);

  const handleLogin = () => {
    setIsAdminLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    setIsAdminLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <DataProvider>
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route path="/admin" element={
            isAdminLoggedIn ? 
              <Navigate to="/admin/dashboard" replace /> : 
              <AdminLogin onLogin={handleLogin} />
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <Dashboard onLogout={handleLogout} />
            </ProtectedRoute>
          } />
        </Routes>
      </DataProvider>
    </BrowserRouter>
  );
}

export default App;