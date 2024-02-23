import React from "react";
import Menu from "../components/Menu";
import "../styles/loginSignup.css";
import {Link} from "react-router-dom";
import Button from '@mui/material/Button';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: 'username',
            password: 'password'
        };
    }

    handleUsername = (event) => {
        event.preventDefault();
        this.setState({ username: event.target.value });
    };

    handlePassword = (event) => {
        event.preventDefault();
        this.setState({ password: event.target.value });
    };

    handleLogIn = (event) => {
        event.preventDefault();
        // TODO: send credentials to backend for login verification
    };

    render() {
        return (
            <div>
                {/* <BasicMenu/> */}
                <Menu/>
                <div class="centered-login-form">
                    <h1>Enter Sanctum</h1>
                    <input class="credential-input" type="text" placeholder="Enter username..." onChange={this.handleUsername}/>
                    <br></br>
                    <input class="credential-input" type="password" placeholder="Enter password..." onChange={this.handlePassword}/>
                    <br></br>
                    <Button type = "submit" component="label" variant="contained" /*onClick = {this.handleLogIn}*/>
                        LOG IN
                    </Button>
                    <p>Don't have an account? <Link to="/signup" class="sign-up-button">Sign up</Link></p>
                </div>
            </div>
        );
    }
}

export default Login;