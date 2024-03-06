import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from "./pages/Signup";
import UploadData from './pages/UploadData';
import ExploreData from './pages/ExploreData';
import Profile from './pages/Profile';
import UserContext from './contexts/UserContext';
// import './App.css';

function App() {
  const loggedIn = sessionStorage.getItem('userLoggedIn') === "true";
  const getUser = () => {
      if (loggedIn) {
          return JSON.parse(sessionStorage.getItem('userSession'))['idToken']['payload'][`cognito:username`];
      }
      return null
  }
  return (
    <Router>
      <UserContext.Provider value={{ getUser }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/upload" element={<UploadData />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/explore" element={<ExploreData />} />
        </Routes>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
