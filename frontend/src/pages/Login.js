import React, { useState, useContext } from "react";
import {Link, useNavigate} from "react-router-dom";
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { SessionContext } from "../contexts/SessionContext";
import UserPool from "../components/UserPool";
import Menu from "../components/Menu";
import { Button } from "@mui/material";
import "../styles/loginSignup.css";


function Login () {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()
    const { login } = useContext(SessionContext);


    const onSubmit = (event) => {
        var authenticationDetails = new AuthenticationDetails( {Username: username, Password: password, });
        var cognitoUser = new CognitoUser({Username: username, Pool: UserPool,});

        cognitoUser.authenticateUser(authenticationDetails, {
	        onSuccess: function(result) {
                alert("user " + cognitoUser.getUsername() + " has successfully logged in.");
                const userData = {
                    username: cognitoUser.getUsername(),
                    userType: result.idToken.payload['custom:user-type'],
                    email: result.idToken.payload.email,
                    phone: result.idToken.payload.phone_number,
                    region: result.idToken.payload.locale
                };
                login(userData);
                navigate('/')
	    },
            onFailure: function(err) {
                alert(err.message || JSON.stringify(err));
            },
        });

    };

    return (
        <div>
            <Menu/>
            <div className="centered-login-form">
                <h1>Enter Sanctum</h1>
                <input className="credential-input" value={username} type="text" placeholder="Enter username..." onChange={(event) => setUsername(event.target.value)}></input>
                <br></br>
                <input className="credential-input" value={password} type="password" placeholder="Enter password..." onChange={(event) => setPassword(event.target.value)}></input>
                <br></br>
                <Button variant="contained" onClick={onSubmit}>Log In</Button>
                <p>Don't have an account? <Link to="/signup" className="sign-up-button">Sign up</Link></p>
            </div>
        </div>
    );
}

export default Login;
