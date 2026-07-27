const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
  
  // Check if we're sending FormData
  const isFormData = options.body instanceof FormData;
  
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Don't set Content-Type for FormData - browser will set it with boundary
  if (!isFormData && !options.headers?.['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  
  // Ensure endpoint starts with /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_URL}${cleanEndpoint}`;
  
  console.log('Making API request to:', url);
  console.log('Method:', options.method || 'GET');
  console.log('Is FormData:', isFormData);
  console.log('Token exists:', !!token);
  
  const defaultOptions = {
    headers: { ...headers, ...(options.headers || {}) }
  };
  
  try {
    // Prepare the body
    let body = options.body;
    if (!isFormData && body !== undefined && body !== null) {
      // If body is already a string, use it as is
      if (typeof body !== 'string') {
        body = JSON.stringify(body);
      }
    }
    
    const response = await fetch(url, { 
      ...defaultOptions, 
      ...options,
      body: body
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) { 
      let errorMessage = 'API request failed';
      let statusCode = response.status;
      
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch (e) {
        try {
          const text = await response.text();
          if (text) errorMessage = text;
        } catch (e2) {
          // Ignore
        }
      }
      
      const error = new Error(errorMessage);
      error.status = statusCode;
      throw error;
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    }
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const skillAPI = {
  getAll: () => fetchAPI('/skills'),
  create: (data) => {
    if (data instanceof FormData) {
      console.log('skillAPI.create with FormData');
      return fetchAPI('/skills', { method: 'POST', body: data });
    }
    return fetchAPI('/skills', { method: 'POST', body: JSON.stringify(data) });
  },
  update: (id, data) => {
    if (data instanceof FormData) {
      console.log('skillAPI.update with FormData for ID:', id);
      return fetchAPI(`/skills/${id}`, { method: 'PUT', body: data });
    }
    return fetchAPI(`/skills/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  delete: (id) => fetchAPI(`/skills/${id}`, { method: 'DELETE' })
};

export const projectAPI = {
  getAll: () => fetchAPI('/projects'),
  create: async (formData) => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    const response = await fetch(`${API_URL}/projects`, { 
      method: 'POST', 
      headers: { ...(token && { 'Authorization': `Bearer ${token}` }) }, 
      body: formData 
    });
    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  },
  update: async (id, formData) => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    const response = await fetch(`${API_URL}/projects/${id}`, { 
      method: 'PUT', 
      headers: { ...(token && { 'Authorization': `Bearer ${token}` }) }, 
      body: formData 
    });
    if (!response.ok) throw new Error('Update failed');
    return response.json();
  },
  delete: (id) => fetchAPI(`/projects/${id}`, { method: 'DELETE' })
};

export const educationAPI = {
  get: () => fetchAPI('/education'),
  create: (formData) => fetchAPI('/education', { method: 'POST', body: formData }),
  update: (id, formData) => {
    if (String(id).startsWith('temp-')) {
      return educationAPI.create(formData);
    }
    return fetchAPI(`/education/${id}`, { method: 'PUT', body: formData });
  },
  delete: (id) => fetchAPI(`/education/${id}`, { method: 'DELETE' }),
  
  addCertification: (data) => {
    console.log('addCertification called with:', data);
    if (data instanceof FormData) {
      console.log('FormData contents:');
      for (let [key, value] of data.entries()) {
        console.log(`${key}: ${value}`);
      }
      return fetchAPI('/education/certifications', { method: 'POST', body: data });
    }
    return fetchAPI('/education/certifications', { method: 'POST', body: JSON.stringify(data) });
  },
  
  updateCertification: (id, data) => {
    console.log('updateCertification called with ID:', id);
    if (data instanceof FormData) {
      console.log('FormData contents:');
      for (let [key, value] of data.entries()) {
        console.log(`${key}: ${value}`);
      }
      return fetchAPI(`/education/certifications/${id}`, { method: 'PUT', body: data });
    }
    return fetchAPI(`/education/certifications/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  
  deleteCertification: (id) => fetchAPI(`/education/certifications/${id}`, { method: 'DELETE' }),
  
  addCourse: (data) => fetchAPI('/education/courses', { method: 'POST', body: JSON.stringify(data) }),
  updateCourse: (id, data) => fetchAPI(`/education/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCourse: (id) => fetchAPI(`/education/courses/${id}`, { method: 'DELETE' })
};

export const certificationAPI = {
  getAll: () => fetchAPI('/certifications'),
  create: (formData) => {
    console.log('certificationAPI.create called with:', formData);
    if (formData instanceof FormData) {
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      return fetchAPI('/certifications', { method: 'POST', body: formData });
    }
    return fetchAPI('/certifications', { method: 'POST', body: JSON.stringify(formData) });
  },
  update: (id, formData) => {
    console.log('certificationAPI.update called with ID:', id);
    if (formData instanceof FormData) {
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      return fetchAPI(`/certifications/${id}`, { method: 'PUT', body: formData });
    }
    return fetchAPI(`/certifications/${id}`, { method: 'PUT', body: JSON.stringify(formData) });
  },
  delete: (id) => fetchAPI(`/certifications/${id}`, { method: 'DELETE' })
};

// ── Direct-to-Cloudinary upload ─────────────────────────────────────────────
// Uploads straight from the browser to Cloudinary using an UNSIGNED upload
// preset, bypassing our backend entirely for the file transfer. This avoids
// relying on our Render server's outbound network reaching Cloudinary
// (which can be blocked/flagged on shared-IP free tiers).
//
// Setup required in Cloudinary dashboard:
//   Settings → Upload → Upload presets → Add upload preset
//   → Signing Mode: "Unsigned" → name it, e.g. "portfolio_unsigned"
//
// And add to your frontend .env:
//   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
//   VITE_CLOUDINARY_UPLOAD_PRESET=portfolio_unsigned
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadToCloudinaryDirect = async (file, { resourceType = 'image', folder } = {}) => {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Cloudinary is not configured (missing VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET)');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  if (folder) formData.append('folder', folder);
  if (resourceType === 'raw') formData.append('flags', 'attachment');

  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

  const response = await fetch(url, { method: 'POST', body: formData });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.error?.message || 'Cloudinary upload failed');
  }

  return response.json(); // { secure_url, public_id, ... }
};

// ── PersonalInfo API ──────────────────────────────────────────────────────────
// Text fields go through our backend as JSON; files upload directly to
// Cloudinary, then the resulting URL/public_id is saved via the /media endpoint.
export const personalInfoAPI = {
  get: () => fetchAPI('/personal-info'),

  // Text-only update (no files)
  update: (data) => fetchAPI('/personal-info', { method: 'PUT', body: JSON.stringify(data) }),

  // Uploads the file directly to Cloudinary, then tells the backend to save
  // the resulting URL against the profileImage field.
  uploadImage: async (file) => {
    const result = await uploadToCloudinaryDirect(file, {
      resourceType: 'image',
      folder: 'portfolio/images'
    });
    return fetchAPI('/personal-info/media', {
      method: 'PUT',
      body: JSON.stringify({
        profileImage: result.secure_url,
        profileImagePublicId: result.public_id
      })
    });
  },

  // Uploads the CV PDF directly to Cloudinary, then tells the backend to
  // save the resulting URL against the cvUrl field.
  uploadCV: async (file) => {
    const result = await uploadToCloudinaryDirect(file, {
      resourceType: 'raw',
      folder: 'portfolio/documents'
    });
    return fetchAPI('/personal-info/media', {
      method: 'PUT',
      body: JSON.stringify({
        cvUrl: result.secure_url,
        cvPublicId: result.public_id
      })
    });
  }
};

export const experienceAPI = {
  getAll: () => fetchAPI('/experiences'),
  get: (id) => fetchAPI(`/experiences/${id}`),
  create: (formData) => {
    console.log('experienceAPI.create called with:', formData);
    if (formData instanceof FormData) {
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
    }
    return fetchAPI('/experiences', { method: 'POST', body: formData });
  },
  update: (id, formData) => {
    console.log('experienceAPI.update called with ID:', id);
    if (formData instanceof FormData) {
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
    }
    return fetchAPI(`/experiences/${id}`, { method: 'PUT', body: formData });
  },
  delete: (id) => fetchAPI(`/experiences/${id}`, { method: 'DELETE' })
};

export const authAPI = {
  login: (email, password) => {
    const data = { email, password };
    console.log('Login data:', data);
    return fetchAPI('/auth/login', { 
      method: 'POST', 
      body: data
    });
  },
  setup: () => fetchAPI('/auth/setup', { method: 'POST' })
};

// ── Helper function to upload PDF files directly to Cloudinary ──────────────
// This is a convenience wrapper around uploadToCloudinaryDirect with
// resourceType set to 'raw' for PDF files.
export const uploadPDFToCloudinaryDirect = async (file, { folder } = {}) => {
  return uploadToCloudinaryDirect(file, {
    resourceType: 'raw',
    folder: folder || 'portfolio/documents'
  });
};