import React, { useState, useContext } from "react";
import {Link, useNavigate} from "react-router-dom";
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import UserPool from "../components/UserPool";
import Menu from "../components/Menu";
import { Button } from "@mui/material";
import "../styles/loginSignup.css";


function Login () {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()


    const onSubmit = (event) => {
        var authenticationDetails = new AuthenticationDetails( {Username: username, Password: password, });
        var cognitoUser = new CognitoUser({Username: username, Pool: UserPool,});

        cognitoUser.authenticateUser(authenticationDetails, {
	        onSuccess: function(result) {
                alert("user " + cognitoUser.getUsername() + " has successfully logged in.");
                cognitoUser.getSession(function (err, session) { 
                    if (err) {
                      alert(err.message || JSON.stringify(err));
                      return;
                    }
                    console.log('session validity: ' + session.isValid());
                  });
                navigate('/')
	    },
            onFailure: function(err) {
                alert(err.message || JSON.stringify(err));
            },
        });
        //usersession

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
                <Button color="violet" variant="contained" onClick={onSubmit}>Log In</Button>
                <p>Don't have an account? <Link to="/signup" className="sign-up-button">Sign up</Link></p>
            </div>
        </div>
    );
}

export default Login;
