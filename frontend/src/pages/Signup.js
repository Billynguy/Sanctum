import React from "react";
import Menu from "../components/Menu";
import "../styles/loginSignup.css";
import {Link} from "react-router-dom";
import Button from '@mui/material/Button';

class Signup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: 'email',
            username: 'username',
            password: 'password'
        };
    }

    handleEmail = (event) => {
        event.preventDefault();
        this.setState({ email: event.target.value });
    };

    handleUsername = (event) => {
        event.preventDefault();
        this.setState({ username: event.target.value });
    };

    handlePassword = (event) => {
        event.preventDefault();
        this.setState({ password: event.target.value });
    };

    handleSignUp = (event) => {
        event.preventDefault();
        // TODO: send credentials to backend for user account creation
    };

    render() {
        return (
            <div>
                <Menu/>
                <div class="centered-login-form">
                    <h1>Join Sanctum</h1>
                    <input class="credential-input" type="text" placeholder="Enter email..." onChange={this.handleEmail}></input>
                    <br></br>
                    <input class="credential-input" type="text" placeholder="Enter username..." onChange={this.handleUsername}></input>
                    <br></br>
                    <input class="credential-input" type="password" placeholder="Enter password..." onChange={this.handlePassword}></input>
                    {/* <br></br>
                    <input class="credential-input" type="password" placeholder="Confirm password..."></input> */}
                    <br></br>
                    <Button type = "submit" component="label" variant="contained" /*onClick = {this.handleSignUp}*/>
                        CREATE ACCOUNT
                    </Button>
                    <p>Already have an account? <Link to="/login" class="sign-up-button">Log In</Link></p>
                </div>
            </div>
        );
    }
}

export default Signup;