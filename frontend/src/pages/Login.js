import React, { useState } from "react";
import Menu from "../components/Menu";
import "../styles/loginSignup.css";
import {Link} from "react-router-dom";
import { Button } from "@mui/material";
import UserPool from "../components/UserPool";
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";

function Login () {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = (event) => {
        var authenticationDetails = new AuthenticationDetails( {Username: username, Password: password, });
        var cognitoUser = new CognitoUser({Username: username, Pool: UserPool,});

        cognitoUser.authenticateUser(authenticationDetails, {
	        onSuccess: function(result) {
                //console.log(result);
                alert("user " + cognitoUser.getUsername() + " has successfully logged in.");
		   //var accessToken = result.getAccessToken().getJwtToken();
	    },
            onFailure: function(err) {
                alert(err.message || JSON.stringify(err));
            },
        });

    };
    

    return (
        <div>
            <BasicMenu/>
            <div className="centered-login-form">
                <h1>Enter Sanctum</h1>
                <input className="credential-input" value={username} type="text" placeholder="Enter username..." onChange={(event) => setUsername(event.target.value)}></input>
                <br></br>
                <input className="credential-input" value={password} type="password" placeholder="Enter password..." onChange={(event) => setPassword(event.target.value)}></input>
                <p>Don't have an account? <Link to="/signup" className="sign-up-button">Sign up</Link></p>
            </div>
            <Button variant="contained" onClick={onSubmit}>Log In</Button>
        </div>
    );
}

export default Login;
