import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from "./pages/Signup";
import UploadData from './pages/UploadData';
import ExploreData from './pages/ExploreData';
import Profile from './pages/Profile';
import MyUploadedData from './pages/MyUploadedData';
import AccessMyDatasets from './pages/AccessMyDatasets';
// import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/upload" element={<UploadData />} />
        <Route path="/explore" element={<ExploreData />} />
        <Route path="/myuploaded" element={<MyUploadedData />} />
        <Route path="/access" element={<AccessMyDatasets />} />
      
      </Routes>
    </Router>
  );
}

export default App;
