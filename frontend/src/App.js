import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from "./pages/Signup";
import UploadData from './pages/UploadData';
import ExploreData from './pages/ExploreData';
import ViewData from './pages/viewData';
// import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/upload" element={<UploadData />} />
        <Route path="/explore" element={<ExploreData />} />
        <Route path="/view/:id" element = {<ViewData/>}/>
      </Routes>
    </Router>
  );
}

export default App;
