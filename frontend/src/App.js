import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from "./pages/Signup";
import NewUploadData from './pages/NewUploadData';
import ExploreData from './pages/ExploreData';
import Profile from './pages/Profile';
// import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/upload" element={<NewUploadData />} /> */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/upload" element={<UploadData />} />
        <Route path="/explore" element={<ExploreData />} />
      </Routes>
    </Router>
  );
}

export default App;
