import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../contexts/SessionContext';
import Menu from '../components/Menu';
import { Button } from "@mui/material";


function Profile() {
    const { session, logout } = useContext(SessionContext);
    const navigate = useNavigate()

    useEffect(() => {
      if (!session.loggedIn) {
          navigate('/login');
      }
    }, [session.loggedIn, navigate]);
    
    const { username, userType, email, phone, region } = session;

    const onSignOut = () => {
      logout();
      navigate('/');
      alert("You have been signed out.");
    };

  return (
    <div>
      <Menu />
      <div className="header">
        <h2>Hello, {username}</h2>
      </div>    
      <p>User type: {userType}</p>
      <p>Email: {email}</p>
      <p>Phone: {phone}</p>
      <p>Region: {region}</p>
      <Button variant="contained" onClick={onSignOut}>Sign Out</Button>
    </div>
  );
}

export default Profile;