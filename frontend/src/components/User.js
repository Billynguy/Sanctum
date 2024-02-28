import React from 'react';
import UserPool from "../components/UserPool";
import {Link, useNavigate} from "react-router-dom";
import "../styles/user.css";

function User() {


    const loggedIn = UserPool.getCurrentUser() != null;

    const getUser = () => {
        return JSON.parse(sessionStorage.getItem('userSession'))['idToken']['payload'][`cognito:username`];
    }
    return (
        <div className="user">
            <Link to="/profile">{loggedIn && <p>{getUser()}</p>}</Link>
        </div>
    );
}   

export default User;