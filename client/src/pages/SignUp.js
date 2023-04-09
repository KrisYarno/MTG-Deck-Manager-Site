import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../UserContext';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';


const SignInContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const SignInForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 2rem;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SignInButton = styled.button`
  background-color: #007bff;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1rem;
  margin: 1rem 2px;
  cursor: pointer;
  border-radius: 5px;
`;


const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { user } = useContext(UserContext);

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://magicbrosbackend.azurewebsites.net/register', {
        username,
        password,
      });

      if (response.status === 201) {
        alert('Account created successfully. Please sign in.');
        navigate('/');
      } else {
        alert('An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred. Please try again.');
    }
  };
      
      

  
  return (
    <SignInContainer>
      <SignInForm onSubmit={handleSignUp}>
        {user ? (
          <p>Welcome, {user.username}! You are already registered.</p>
        ) : (
          <>
            <h2>Sign Up</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <SignInButton type="submit">Sign Up</SignInButton>
            <p>
              Already have an account? <Link to="/">Sign in here</Link>.
            </p>
          </>
        )}
      </SignInForm>
    </SignInContainer>
  );
};

export default SignUp;