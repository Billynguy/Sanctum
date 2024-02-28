import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import "../styles/loginSignup.css";
import {Link} from "react-router-dom";
import { Button } from "@mui/material";
import UserPool from "../components/UserPool";
import { CognitoUserAttribute, CognitoUser } from "amazon-cognito-identity-js";

const Signup = () => {
    const [name, setName] = useState(''); 
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmationCode, setConfirmConfirmationCode] = useState('');
    const [isSignedUp, setIsSignedUp] = useState(false);
    const navigate = useNavigate()

    const onSubmit = (event) => {
        event.preventDefault();
        console.log('username: ', username);

        var attributeList = [];
        attributeList.push(new CognitoUserAttribute({Name: 'email', Value: email,}));
        attributeList.push(new CognitoUserAttribute({Name: 'phone_number', Value: phone,}));
        attributeList.push(new CognitoUserAttribute({Name: 'locale', Value: 'en_US',}));
        attributeList.push(new CognitoUserAttribute({Name: 'name', Value: name,}));


        UserPool.signUp(username, password, attributeList, null, (err, data) => {
            if (err) {
                alert(err)
            } else {
                setIsSignedUp(true);
            }
            //user = data.user;
        });
    };

    const onSubmitConfirmation = (event) => {
        event.preventDefault();
        var cognitoUser = new CognitoUser({
            Username: username,
            Pool: UserPool,
        });

        cognitoUser.confirmRegistration(confirmationCode, true, function(err, result) {
            if (err) {
                alert(err);
                return;
            }
            alert(username + " has been created.");
            navigate('/')
            console.log('confirmation result: ' + result);
        });
    };

    const onResendConfirmation = (event) => {  
        event.preventDefault();
        var cognitoUser = new CognitoUser({
            Username: username,
            Pool: UserPool,
        });
        cognitoUser.resendConfirmationCode(function(err, result) {
            if (err) {
                alert(err.message || JSON.stringify(err));
                return;
            }
            console.log(result);
        });
    }
    
    return (
        <div>
            <Menu/>
            <div className="centered-login-form">
                <h1>Join Sanctum</h1>
                {!isSignedUp && (
                    <>
                        <input className="credential-input" value={name} type="text" placeholder="Enter name..." onChange={(event) => setName(event.target.value)}></input>
                        <br></br>
                        <input className="credential-input" value={email} type="text" placeholder="Enter email..." onChange={(event) => setEmail(event.target.value)}></input>
                        <br></br>
                        <input className="credential-input" value={phone} type="text" placeholder="Enter phone number..." onChange={(event) => setPhone(event.target.value)}></input>
                        <br></br>
                        <input className="credential-input" value={username} type="text" placeholder="Enter username..." onChange={(event) => setUsername(event.target.value)}></input>
                        <br></br>
                        <input className="credential-input" value={password} type="password" placeholder="Enter password..." onChange={(event) => setPassword(event.target.value)}></input>
                        <br></br>
                        <input className="credential-input" value={confirmPassword} type="password" placeholder="Confirm password..." onChange={(event) => setConfirmPassword(event.target.value)}></input>
                        <br></br>
                        <Button variant="contained" onClick={onSubmit}>Sign Up</Button>
                        <p>Already have an account? <Link to="/login" className="sign-up-button">Log In</Link></p>
                    </>
                )}
                {isSignedUp && (
                    <div className ="confirmation-container">
                    <input className="credential-input" value={confirmationCode} type="text" placeholder="Enter confirmation code..." onChange={(event) => setConfirmConfirmationCode(event.target.value)}></input>
                    <br></br>
                    <Button variant="contained" onClick={onSubmitConfirmation}>Confirm Sign Up</Button>
                    <Button variant="contained" onClick={onResendConfirmation}>Resend Confirmation Code</Button>
                    </div>
                )}
            </div>
        </div>
    );

}

export default Signup;
