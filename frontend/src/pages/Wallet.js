import React, {useState} from 'react';
import Menu from '../components/Menu';
import User from "../components/User";

import UserPool from '../components/UserPool';
import { CognitoUser, AuthenticationDetails, CognitoUserAttribute } from 'amazon-cognito-identity-js';

import { Button } from "@mui/material";
function Wallet() {
    async function fetchWallet(username) {
        try {
            const response = await fetch(`http://127.0.0.1:5000/getWallet/${username}`);
            const data = await response.json();
            if (response.ok) {
                console.log('Wallet data:', data.wallet);
                // Do something with the wallet data
            } else {
                console.error('Error:', data.error);
                // Handle the error appropriately
            }
        } catch (error) {
            console.error('Error fetching wallet data:', error);
            // Handle network errors or other exceptions
        }
    }
    
    // Example usage:
    const username = 'billy1';
    fetchWallet(username);
    return (
        <div>
          <User/>
          <Menu />
          <div className="header">
          <h2>Hello, Name</h2>
          </div>    
    
          <p>Wallet Balance: </p>
          
          
        </div>
      );
    }
    
    export default Wallet;