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
    }
    return fetchAPI('/certifications', { method: 'POST', body: formData });
  },
  update: (id, formData) => {
    console.log('certificationAPI.update called with ID:', id);
    if (formData instanceof FormData) {
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
    }
    return fetchAPI(`/certifications/${id}`, { method: 'PUT', body: formData });
  },
  delete: (id) => fetchAPI(`/certifications/${id}`, { method: 'DELETE' })
};

// ✅ FIXED: PersonalInfo API with direct fetch for FormData
export const personalInfoAPI = {
  get: () => fetchAPI('/personal-info'),
  update: (formData) => {
    console.log('Updating personal info with form data');
    if (formData instanceof FormData) {
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
    }
    // ✅ Use direct fetch for FormData
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    return fetch(`${API_URL}/personal-info`, { 
      method: 'PUT', 
      headers: { 
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: formData 
    }).then(async res => {
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || 'Update failed');
      }
      return res.json();
    });
  },
  uploadImage: (formData) => {
    console.log('Uploading profile image');
    if (formData instanceof FormData) {
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
    }
    // ✅ Use direct fetch for FormData
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    return fetch(`${API_URL}/personal-info/upload-image`, { 
      method: 'POST', 
      headers: { 
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: formData 
    }).then(async res => {
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || 'Upload failed');
      }
      return res.json();
    });
  },
  uploadCV: (formData) => {
    console.log('Uploading CV');
    if (formData instanceof FormData) {
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
    }
    // ✅ Use direct fetch for FormData
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    return fetch(`${API_URL}/personal-info/upload-cv`, { 
      method: 'POST', 
      headers: { 
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: formData 
    }).then(async res => {
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || 'Upload failed');
      }
      return res.json();
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