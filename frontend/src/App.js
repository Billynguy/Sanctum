import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import UploadData from './pages/UploadData';
import ExploreData from './pages/ExploreData';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<UploadData />} />
        <Route path="/explore" element={<ExploreData />} />
      </Routes>
    </Router>
  );
}

export default App;
