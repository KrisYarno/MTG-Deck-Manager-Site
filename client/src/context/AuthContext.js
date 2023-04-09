import { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loginUser = async (username, password) => {
    try {
      const response = await axios.post('https://magicbrosbackend.azurewebsites.net/login', {
        username,
        password,
      });
  
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setIsAuthenticated(true);
        return {
          success: true,
          user: response.data.user,
        };
      } else {
        return {
          success: false,
        };
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
      return {
        success: false,
      };
    }
  };  

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loginUser, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
