import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from "./pages/Signup";
import UploadData from './pages/UploadData';
import ExploreData from './pages/ExploreData';
import ValidateData from './pages/ValidateData';
import Profile from './pages/Profile';
import MyUploadedData from './pages/MyUploadedData';
import PurchasedData from './pages/PurchasedData';
import PermissionDenied from './pages/PermissionDenied';
import ViewData from './pages/ViewData';
// import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/upload" element={<UploadData />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/explore" element={<ExploreData />} />
        <Route path="/myuploaded" element={<MyUploadedData />} />
        <Route path="/access" element={<PurchasedData />} />
        <Route path="/permissiondenied" element={<PermissionDenied />} />
        <Route path="/validate" element={<ValidateData/>} />
        <Route path="/view/:id/:uploadedBy" element = {<ViewData/>}/>
      </Routes>
    </Router>
  );
}

export default App;
