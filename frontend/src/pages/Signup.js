import React from "react";
import BasicMenu from "../components/BasicMenu";
import "../styles/loginSignup.css";
import {Link} from "react-router-dom";

class Signup extends React.Component {

    render() {
        return (
            <div>
                <BasicMenu/>
                <div class="centered-login-form">
                    <h1>Create Account</h1>
                    <input class="credential-input" type="text" placeholder="Enter email..."></input>
                    <br></br>
                    <input class="credential-input" type="text" placeholder="Enter username..."></input>
                    <br></br>
                    <input class="credential-input" type="password" placeholder="Enter password..."></input>
                    <br></br>
                    <input class="credential-input" type="password" placeholder="Confirm password..."></input>
                    <p>Already have an account? <Link to="/login" class="sign-up-button">Log In</Link></p>
                </div>
            </div>
        );
    }
}

export default Signup;