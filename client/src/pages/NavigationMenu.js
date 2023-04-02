import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { TiThMenuOutline } from 'react-icons/ti';

const MenuButton = styled.button`
  background-color: DodgerBlue; /* Blue background */
  border: none; /* Remove borders */
  color: white; /* White text */
  padding: 10px 12px; /* Some padding */
  font-size: 16px; /* Set a font size */
  cursor: pointer; /* Mouse pointer on hover */
  position: fixed; /* Fix position on the top left */
  top: 0; /* Position at the top */
  left: 0; /* Position at the left */
  text-decoration: none; /* Remove default link styling */
  display: flex;
  align-items: center;
  justify-content: center;

  /* Darker background on mouse-over */
  &:hover {
    background-color: RoyalBlue;
  }
`;

const NavigationPane = styled.div`
position: fixed;
top: 0;
left: 0;
width: 250px;
height: calc(100%);
background-color: #ffffff;
box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
z-index: 1000;
padding: 1rem;
display: flex;
flex-direction: column;
gap: 0.5rem;
overflow-y: auto;

&::-webkit-scrollbar {
  width: 5px;
}

&::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 5px;
}
`;

const MenuItem = styled(Link)`
text-decoration: none;
font-size: 1rem;
color: #333;
background-color: #f5f5f5;
padding: 0.5rem 1rem;
border-radius: 5px;
transition: background-color 0.2s ease;

&:hover {
  background-color: #e0e0e0;
}
`;

const SignOutButton = styled.button`
background-color: #f44336;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1rem;
  margin-top: auto;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.2s ease;
  position: fixed;
  bottom: 8px;
  left: 1rem;

  &:hover {
    background-color: #d32f2f;
  }
`;

const NavigationMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <>
      <MenuButton onClick={() => setMenuOpen(!menuOpen)}><TiThMenuOutline />Menu</MenuButton>
      {menuOpen && (
        <NavigationPane>
          <MenuItem to="/home" onClick={() => setMenuOpen(false)}>
            Home
          </MenuItem>
          <MenuItem to="/create-deck" onClick={() => setMenuOpen(false)}>
            Create Deck
          </MenuItem>
          <MenuItem to="/card-search" onClick={() => setMenuOpen(false)}>
            Card Search
          </MenuItem>
          <MenuItem to="/modify-deck" onClick={() => setMenuOpen(false)}>
            Modify Deck
          </MenuItem>
          <MenuItem to="/import-deck" onClick={() => setMenuOpen(false)}>
            Import Deck
          </MenuItem>
          <SignOutButton onClick={handleSignOut}>Sign Out</SignOutButton>
        </NavigationPane>
      )}
    </>
  );
};

export default NavigationMenu;
