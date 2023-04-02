import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import NavigationMenu from './NavigationMenu';


const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const HomeButton = styled.button`
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

const Home = () => {
  const navigate = useNavigate();

  return (
    <HomeContainer>
      <h2>Welcome</h2>
      <NavigationMenu />
      <HomeButton onClick={() => navigate('/create-deck')}>Create Deck</HomeButton>
      <HomeButton onClick={() => navigate('/card-search')}>Card Search</HomeButton>
      <HomeButton onClick={() => navigate('/modify-deck')}>Modify Deck</HomeButton>
    </HomeContainer>
  );
};

export default Home;
