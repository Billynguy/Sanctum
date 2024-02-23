import React, { useState } from "react";
import Menu from "../components/Menu";
import "../styles/loginSignup.css";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsername = (event) => {
        console.log(event.target.value)
        setUsername(event.target.value);
    };

    const handlePassword = (event) => {
        console.log(event.target.value)
        setPassword(event.target.value);
    };

    const handleLogIn = (event) => {
        event.preventDefault();
        // TODO: send credentials to backend for login verification
    };

    return (
        <div>
            <Menu />
            <div className="centered-login-form">
                <h1>Enter Sanctum</h1>
                <input className="credential-input" type="text" placeholder="Enter username..." value={username} onChange={handleUsername} />
                <br />
                <input className="credential-input" type="password" placeholder="Enter password..." value={password} onChange={handlePassword} />
                <br />
                <Button type="submit" component="label" variant="contained" onClick={handleLogIn}>
                    LOG IN
                </Button>
                <p>Don't have an account? <Link to="/signup" className="sign-up-button">Sign up</Link></p>
            </div>
        </div>
    );
}

export default Login;
