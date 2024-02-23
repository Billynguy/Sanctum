import React, { useState } from "react";
import Menu from "../components/Menu";
import "../styles/loginSignup.css";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleEmail = (event) => {
        setEmail(event.target.value);
    };

    const handleUsername = (event) => {
        setUsername(event.target.value);
    };

    const handlePassword = (event) => {
        setPassword(event.target.value);
    };

    const handleSignUp = (event) => {
        event.preventDefault();
        // TODO: send credentials to backend for user account creation
    };

    return (
        <div>
            <Menu />
            <div className="centered-login-form">
                <h1>Join Sanctum</h1>
                <input className="credential-input" type="text" placeholder="Enter email..." value={email} onChange={handleEmail}></input>
                <br />
                <input className="credential-input" type="text" placeholder="Enter username..." value={username} onChange={handleUsername}></input>
                <br />
                <input className="credential-input" type="password" placeholder="Enter password..." value={password} onChange={handlePassword}></input>
                {/* <br />
                <input className="credential-input" type="password" placeholder="Confirm password..."></input> */}
                <br />
                <Button type="submit" component="label" variant="contained" onClick={handleSignUp}>
                    CREATE ACCOUNT
                </Button>
                <p>Already have an account? <Link to="/login" className="sign-up-button">Log In</Link></p>
            </div>
        </div>
    );
}

export default Signup;
