import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import UserContext from './UserContext';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import CreateDeck from './pages/CreateDeck';
import CardSearch from './pages/CardSearch';
import ModifyDeck from './pages/ModifyDeck';
import SignUp from './pages/SignUp';

const App = () => {
  const [user, setUser] = useState(null);

  const getLoggedInUserData = () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    return userData || null;
  };

  useEffect(() => {
    const loggedInUserData = getLoggedInUserData();
    setUser(loggedInUserData);
    console.log('User data set:', loggedInUserData);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div className="App">
        <header className="App-header"></header>
      </div>
      <AuthProvider>
        <Router>
          <Routes>
            <Route index path="/" element={<SignIn />} />
            <Route path="/home" element={<Home />} />
            <Route path="/create-deck" element={<CreateDeck />} />
            <Route path="/card-search" element={<CardSearch />} />
            <Route path="/modify-deck" element={<ModifyDeck userId={user ? user._id : null} />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </Router>
      </AuthProvider>
    </UserContext.Provider>
  );
};

export default App;
