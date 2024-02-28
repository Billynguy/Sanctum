import React from 'react';
import Menu from '../components/Menu';
import User from "../components/User";

function Profile() {
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));
    const name = userSession['idToken']['payload']['name'];
  return (
    <div>
      <User/>
      <Menu />
      <div className="header">
        <h2>Hello, {name}</h2>
      </div>    
      <p>User permissions: tbd</p>
      <p>Email: {userSession['idToken']['payload']['email']}</p>
      <p>Phone: {userSession['idToken']['payload']['phone_number']}</p>
      <p>Region: {userSession['idToken']['payload']['locale']}</p>
    </div>
  );
}

export default Profile;