import React from 'react';
import Menu from '../components/Menu';
import User from "../components/User";
import { Button } from "@mui/material";

function PermissionDenied() {
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));

    

  return (
    <div>
      <Menu />
     <User/>
      
      <div className="header">
      <h2>Hello, {userSession['idToken']['payload']['name']}</h2>
      </div>    
      <p>You do not have permission to access this page.</p>

    </div>
  );
}

export default PermissionDenied;