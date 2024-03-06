import React from 'react';
import Menu from '../components/Menu';
import User from "../components/User";
import { Button } from "@mui/material";

function Profile() {
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));

    if (userSession === null) {
        window.location.href = '/login';
    }

    const onSignOut = (event) => {
        event.preventDefault();
        sessionStorage.setItem('userLoggedIn', "false");
        sessionStorage.removeItem('userSession');
        //window.location.reload();
        alert("You have been signed out.");
        window.location.href = '/';
    };

  return (
    <div>
      <Menu />
      <User/>
      
      <div className="header">
      <h2>Hello, {userSession['idToken']['payload']['name']}</h2>
      </div>    
      <p>User type: {userSession['idToken']['payload']['custom:user-type']}</p>
      <p>Email: {userSession['idToken']['payload']['email']}</p>
      <p>Phone: {userSession['idToken']['payload']['phone_number']}</p>
      <p>Region: {userSession['idToken']['payload']['locale']}</p>
      <Button variant="contained" onClick={onSignOut}>Sign Out</Button>
    </div>
  );
}

export default Profile;