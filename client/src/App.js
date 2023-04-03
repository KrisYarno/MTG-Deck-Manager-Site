import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import CreateDeck from './pages/CreateDeck';
import CardSearch from './pages/CardSearch';
import ModifyDeck from './pages/ModifyDeck';
import SignUp from './pages/SignUp';


const App = () => {
  const [userId, setUserId] = useState(null);

  const getLoggedInUserId = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user._id : null;
  };

  useEffect(() => {
    const loggedInUserId = getLoggedInUserId();
    setUserId(loggedInUserId);
    console.log('User ID set:', loggedInUserId);
  }, []);


  return (
    <>
      <div className="App">
        <header className="App-header"></header>
      </div>
      <Router>
        <Routes>
          <Route index path="/" element={<SignIn />} />
          <Route path="/home" element={<Home />} />
          <Route path="/create-deck" element={<CreateDeck />} />
          <Route path="/card-search" element={<CardSearch />} />
          <Route path="/modify-deck" element={<ModifyDeck userId={userId} />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
