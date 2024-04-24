import React, {useState, useEffect, useContext} from 'react';
import Menu from '../components/Menu';
import User from "../components/User";
import UserPool from '../components/UserPool';

function Wallet() {
    const [walletData, setWalletData] = useState(null);

    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,      
     });


    var user = UserPool.getCurrentUser();
    var sess;
    if(user != null){
      user.getSession(function (err, session) { 
        if (err) {
          alert(err.message || JSON.stringify(err));
          window.location.href = '/login';
          return;
        }
        sess = session;
      });
    }
    else{
        window.location.href = '/login';
    }
    useEffect(() => {
        async function fetchWalletData(username) {
            try {
                const response = await fetch(`http://127.0.0.1:5000/getWallet/${username}`);
                const data = await response.json();
                if (response.ok) {
                    console.log('Wallet data:', data.wallet);
                    setWalletData(data.wallet);
                } else {
                    console.error('Error:', data.error);
                    setWalletData(null);
                }
            } catch (error) {
                console.error('Error fetching wallet data:', error);
                setWalletData(null);
            }
        }
        fetchWalletData(sess['idToken']['payload']['cognito:username']);
    }, []); // Runs once on component mount
    

    return (
        <div>
          <User/>
          <Menu />
          <div className="header">
          <h2>{sess['idToken']['payload']['cognito:username']}'s Account</h2>
          </div>    
    
          <p>Wallet Balance: {formatter.format(walletData / 100)}</p>
          
          
        </div>
      );
    }
    
    export default Wallet;