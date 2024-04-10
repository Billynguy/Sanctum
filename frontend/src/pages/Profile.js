import React, {useState} from 'react';
import Menu from '../components/Menu';
import User from "../components/User";
import EditIcon from '@mui/icons-material/Edit';
import UserPool from '../components/UserPool';
import { CognitoUser, AuthenticationDetails, CognitoUserAttribute } from 'amazon-cognito-identity-js';

import { Button } from "@mui/material";
function Profile() {
  var user = UserPool.getCurrentUser();
  var sess;
  user.getSession(function (err, session) { 
    if (err) {
      alert(err.message || JSON.stringify(err));
      window.location.href = '/login';
      return;
    }
    sess = session;
  });
  const [details, setDetails] = React.useState(sess['idToken']['payload']);
  const [editName, setEditName] = React.useState(false);
  const [editUserType, setEditUserType] = React.useState(false);
  const [editPhone, setEditPhone] = React.useState(false);
  const [editRegion, setEditRegion] = React.useState(false);
  const [textInput, setTextInput] = React.useState('');
  const [property, setProperty] = React.useState('');
  const [allowOpen, setAllowOpen] = React.useState('true');

    if (user == null) {
        window.location.href = '/login';
    };

    function editProperty(property, newValue){
      user.getSession(function (err, session) {
        if (err) {
          alert(err.message || JSON.stringify(err));
          return;
        }
        //console.log('session validity: ' + session.isValid());
    
        user.getUserAttributes(function (err, result) {
          if (err) {
            alert(err.message || JSON.stringify(err));
            return;
          }
          var attributeList = result.splice((result.indexOf(result.find(obj => {
            return obj.getName() === property;
          }))), 1);
          var attribute = new CognitoUserAttribute({Name: property, Value: newValue,});
          attributeList.push(attribute);
          user.updateAttributes(attributeList, function (err, result) {
            if (err) {
              alert(err.message || JSON.stringify(err));
              return;
            }
            //console.log('call result: ' + result);
          });
        });
      
    
        // NOTE: getSession must be called to authenticate user before calling getUserAttributes
        
        // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        // 	IdentityPoolId: '...', // your identity pool id here
        // 	Logins: {
        // 		// Change the key below according to the specific region your user pool is in.
        // 		'cognito-idp.<region>.amazonaws.com/<YOUR_USER_POOL_ID>': session
        // 			.getIdToken()
        // 			.getJwtToken(),
        // 	},
        // });
    
        // Instantiate aws sdk service objects now that the credentials have been updated.
        // example: var s3 = new AWS.S3();
      });
    }
  const onEdit = (event) => {
    setTextInput(event.target.value);
    setProperty(event.target.getAttribute('propname'));
  }
  const onSubmitEdit = (event) => {
    editProperty(property, textInput);
    setTextInput('');
    console.log("changing " + property + " to " + textInput);
    alert(property + ' has been updated to ' + textInput + '. Please reload to see your changes.');
    user.getSession(function (err, session) { 
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      }
      console.log(session);
    });
  }
  
  const onEditButtonClick = (setter, value) => {
    if(allowOpen){
      setter(true);
      setAllowOpen(false);
    }
    if(!allowOpen && value){
      setter(false);
      setAllowOpen(true);
    }
    if(!allowOpen && !value){
      alert("You can only edit one field at a time");
    }
  }

  return (
    <div>
      <Menu />
      <div className="header">
      <h2>Hello, {details['name']} 
      <EditIcon sx={{ fontSize: 15 }} onClick={() => onEditButtonClick(setEditName, editName)}/></h2>
      {editName && <><input className="credential-input" propname="name" value={textInput} type="text" placeholder="Enter new name..." onChange={onEdit}></input>
      <Button variant="outlined" size="small" onClick={onSubmitEdit} >Submit Changes</Button></>  }
      </div>    

      <p>User type: {details['custom:user-type']} 
      <EditIcon sx={{ fontSize: 15 }} onClick={() => onEditButtonClick(setEditUserType, editUserType)}/> </p>
      {editUserType && <><input className="credential-input" propname="custom:user-type" value={textInput} type="text" placeholder="Enter new user type..." onChange={onEdit}></input>
      <Button variant="outlined" size="small" onClick={onSubmitEdit} >Submit Changes</Button></>}
      
      <p>Email: {details['email']} </p>
      
      <p>Phone: {details['phone_number']} 
      <EditIcon sx={{ fontSize: 15 }} onClick={() => onEditButtonClick(setEditPhone, editPhone)}/>  </p>
      {editPhone && <><input className="credential-input" propname="phone_number" value={textInput} type="text" placeholder="Enter new phone number..." onChange={onEdit}></input>
      <Button variant="outlined" size="small" onClick={onSubmitEdit} >Submit Changes</Button></>}
      
      <p>Region: {details['locale']} 
      <EditIcon sx={{ fontSize: 15 }} onClick={() => onEditButtonClick(setEditRegion, editRegion)}/> </p>
      {editRegion && <><input className="credential-input" propname="locale" value={textInput} type="text" placeholder="Enter new region..." onChange={onEdit}></input>
      <Button variant="outlined" size="small" onClick={onSubmitEdit} >Submit Changes</Button></>}
    </div>
  );
}

export default Profile;