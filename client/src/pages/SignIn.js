import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
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


const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { loginUser } = useContext(AuthContext);
  const { user, setUser } = useContext(UserContext);

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const responseData = await loginUser(username, password);

      if (responseData.success) {
        setUser({
          _id: responseData.user._id,
          username: responseData.user.username,
          // any other user data you want to store
        });
      } else {
        alert('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);
  
  

  return (
    <SignInContainer>
      <SignInForm onSubmit={handleSignIn}>
        <h2>Sign In</h2>
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
        <SignInButton type="submit">Sign In</SignInButton>
        <p>
        Don't have an account? <Link to="/signup">Sign up here</Link>.
      </p>
      </SignInForm>
    </SignInContainer>
  );
};

export default SignIn;
