import React from 'react';
import Menu from '../components/Menu';
import User from "../components/User";
import EditIcon from '@mui/icons-material/Edit';

import { Button } from "@mui/material";

function Profile() {
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));

    if (userSession === null) {
        window.location.href = '/login';
    }


  return (
    <div>
      <Menu />
     <User/>
      
      <div className="header">
      <h2>Hello, {userSession['idToken']['payload']['name']}</h2>
      </div>    
      <p>User type: {userSession['idToken']['payload']['custom:user-type']} <EditIcon sx={{ fontSize: 15 }} onClick={console.log("bleh")}/> </p>
      <p>Email: {userSession['idToken']['payload']['email']} <EditIcon sx={{ fontSize: 15 }}/>  </p>
      <p>Phone: {userSession['idToken']['payload']['phone_number']} <EditIcon sx={{ fontSize: 15 }}/>  </p>
      <p>Region: {userSession['idToken']['payload']['locale']} <EditIcon sx={{ fontSize: 15 }}/> </p>
    </div>
  );
}

export default Profile;