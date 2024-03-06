import React from 'react';
import Menu from '../components/Menu';
import User from "../components/User";
import { Button } from "@mui/material";

function MyUploadedData() {
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));



  return (
    <div>
      <Menu />
     <User/>
      
      <div className="header">
      <h2>Hello, {userSession['idToken']['payload']['name']}</h2>
      </div>    
      <p>Datasets I've Uploaded</p>

    </div>
  );
}

export default MyUploadedData;