import React from "react";
import BasicMenu from "../components/BasicMenu";
import "../styles/loginSignup.css";
import {Link} from "react-router-dom";

class Login extends React.Component {

    render() {
        return (
            <div>
                <BasicMenu/>
                <div class="centered-login-form">
                    <h1>Enter Sanctum</h1>
                    <input class="credential-input" type="text" placeholder="Enter username..."></input>
                    <br></br>
                    <input class="credential-input" type="password" placeholder="Enter password..."></input>
                    <p>Don't have an account? <Link to="/signup" class="sign-up-button">Sign up</Link></p>
                </div>
            </div>
        );
    }
}

export default Login;