import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://magicbrosbackend.azurewebsites.net/',
});

// Add an interceptor to attach the JWT token to requests
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Add an interceptor to handle errors on response
instance.interceptors.response.use(
  (response) => {
    // If the response is successful, return the response data
    return response;
  },
  (error) => {
    // Handle response errors
    if (error.response.status === 401) {
      // Unauthorized error - you can add your own logic to handle this, e.g., redirecting to the login page
      console.error('Unauthorized error: ', error);
    } else {
      console.error('API request error: ', error);
    }
    return Promise.reject(error);
  }
);

export default instance;
