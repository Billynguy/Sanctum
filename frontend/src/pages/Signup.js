import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import "../styles/loginSignup.css";
import {Link} from "react-router-dom";
import { Button } from "@mui/material";
import UserPool from "../components/UserPool";
import { CognitoUserAttribute, CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';

const userTypes = ["Validator", "Data Provider"];

const Signup = () => {
    const [name, setName] = useState(''); 
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmationCode, setConfirmConfirmationCode] = useState('');
    const [isSignedUp, setIsSignedUp] = useState(false);
    const [resendMessage, setResendMessage] = useState('');
    const [userType, setUserType] = useState('');
    const navigate = useNavigate()


    const onSubmit = (event) => {
        event.preventDefault();

        if (password !== confirmPassword) { alert("Passwords do not match."); return; }

        var attributeList = [];
        attributeList.push(new CognitoUserAttribute({Name: 'email', Value: email,}));
        attributeList.push(new CognitoUserAttribute({Name: 'phone_number', Value: phone,}));
        attributeList.push(new CognitoUserAttribute({Name: 'locale', Value: 'en_US',}));
        attributeList.push(new CognitoUserAttribute({Name: 'name', Value: name,}));
        attributeList.push(new CognitoUserAttribute({Name: 'custom:user-type', Value: userType,}));


        UserPool.signUp(username, password, attributeList, null, (err, data) => {
            if (err) {
                alert(err)
            } else {
                setIsSignedUp(true);
            }
            //user = data.user;
        });
    };

    const onSubmitConfirmation = async (event) => {
        event.preventDefault();
        var cognitoUser = new CognitoUser({
            Username: username,
            Pool: UserPool,
        });

        cognitoUser.confirmRegistration(confirmationCode, true, async function(err, result) {
            if (err) {
                alert(err);
                return;
            }
            await addUser(username, userType);
            alert(username + " has been created.");
            login(cognitoUser);
            //console.log('confirmation result: ' + result);
        });
    };

    const addUser = async (username, userType) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/adduser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username, userType: userType })
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log(data);
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred while adding the user.');
        }
    };

    const login = (cognitoUser) => {
        var authenticationDetails = new AuthenticationDetails( {Username: username, Password: password, });

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function(result) {
                sessionStorage.setItem('userLoggedIn', "true");
                sessionStorage.setItem('userSession', JSON.stringify(result));
                navigate('/')
        },
            onFailure: function(err) {
                alert(err.message || JSON.stringify(err));
            },
        });

    };

    const onResendConfirmation = (event) => {  
        event.preventDefault();
        var cognitoUser = new CognitoUser({Username: username, Pool: UserPool,});
        cognitoUser.resendConfirmationCode(function(err, result) {
            if (err) {
                alert(err.message || JSON.stringify(err));
                return;
            }
            setResendMessage("Confirmation code sent to " + result["CodeDeliveryDetails"]["Destination"] + ".");
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
                        <PhoneInput className="credential-input phone-input" placeholder="Enter phone number..." value={phone} onChange={setPhone}/>
                        <br></br>
                        <input className="credential-input" value={username} type="text" placeholder="Enter username..." onChange={(event) => setUsername(event.target.value)}></input>
                        <br></br>
                        <Box sx={{ minWidth: 120 }} > <FormControl className="credential-input">
                        <InputLabel id="demo-simple-select-label">Choose user type...</InputLabel>
                        <Select className="credential-input" labelId="demo-simple-select-filled-label" id="demo-simple-select" label="Choose user type..." value={userType} onChange={(event) => setUserType(event.target.value)  } >
                            {userTypes.map((type) => (
                                <MenuItem value={type}>{type}</MenuItem>
                            ))}
                        </Select> </FormControl> </Box>
                        <br/>
                        <input className="credential-input pass-input" value={password} type="password" placeholder="Enter password..." onChange={(event) => setPassword(event.target.value)}></input>
                        <p className="detail-text">Password must contain at least 1 number, 1 special character, 1 uppercase letter, and 1 lowercase letter</p>
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
                    {resendMessage && <p className="detail-text">{resendMessage}</p>}
                    </div>
                )}
            </div>
        </div>
    );

}

export default Signup;
