import React, {useState} from 'react';
import Menu from '../components/Menu';
import User from "../components/User";
import EditIcon from '@mui/icons-material/Edit';
import UserPool from '../components/UserPool';
import { CognitoUser, AuthenticationDetails, CognitoUserAttribute } from 'amazon-cognito-identity-js';

import { Button } from "@mui/material";
//finish update values and user authentication
function Profile() {
  const [editName, setEditName] = React.useState(false);
  const [editUserType, setEditUserType] = React.useState(false);
  const [editEmail, setEditEmail] = React.useState(false);
  const [editPhone, setEditPhone] = React.useState(false);
  const [editRegion, setEditRegion] = React.useState(false);
  const [textInput, setTextInput] = React.useState('');
  const [property, setProperty] = React.useState('');
  const [allowOpen, setAllowOpen] = React.useState('true');

    const userSession = JSON.parse(sessionStorage.getItem('userSession'));
    var user = UserPool.getCurrentUser();
  //bc im pulling the profile properties from the usersession, it doesn't update. need to pull from cognito. or at elast edit user session when properties edited
    //even when logfed out on frontend, userpool.getcurrentuser still has user logged in. need to fix that-deal w cognito user sessions or smth. refresh id?
    if (userSession === null) {
        window.location.href = '/login';
    }

    const editProperty = (property, newValue) => {
      user.getSession(function (err, session) {
        if (err) {
          alert(err.message || JSON.stringify(err));
          return;
        }
        console.log('session validity: ' + session.isValid());
    
        user.getUserAttributes(function (err, result) {
          if (err) {
            alert(err.message || JSON.stringify(err));
            return;
          }
          console.log(result);
          var attributeList = result.splice((result.indexOf(result.find(obj => {
            return obj.getName() === property;
          }))), 1);
          console.log(attributeList);
          var attribute = new CognitoUserAttribute({Name: property, Value: newValue,});
          attributeList.push(attribute);
          console.log(attributeList);
          user.updateAttributes(attributeList, function (err, result) {
            if (err) {
              alert(err.message || JSON.stringify(err));
              return;
            }
            console.log('call result: ' + result);
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
     <User/>
      
      <div className="header">
      <h2>Hello, {userSession['idToken']['payload']['name']} 
      <EditIcon sx={{ fontSize: 15 }} onClick={() => onEditButtonClick(setEditName, editName)}/></h2>
      {editName && <><input className="credential-input" propname="name" value={textInput} type="text" placeholder="Enter new name..." onChange={onEdit}></input>
      <Button variant="outlined" size="small" onClick={onSubmitEdit} >Submit Changes</Button></>  }
      </div>    

      <p>User type: {userSession['idToken']['payload']['custom:user-type']} 
      <EditIcon sx={{ fontSize: 15 }} onClick={() => onEditButtonClick(setEditUserType, editUserType)}/> </p>
      {editUserType && <><input className="credential-input" propname="custom:user-type" value={textInput} type="text" placeholder="Enter new user type..." onChange={onEdit}></input>
      <Button variant="outlined" size="small" onClick={onSubmitEdit} >Submit Changes</Button></>}
      
      <p>Email: {userSession['idToken']['payload']['email']} 
      <EditIcon sx={{ fontSize: 15 }} onClick={() => onEditButtonClick(setEditEmail, editEmail)}/>  </p>
      {editEmail && <><input className="credential-input" propname="email" value={textInput} type="text" placeholder="Enter new email..." onChange={onEdit}></input>
      <Button variant="outlined" size="small" onClick={onSubmitEdit} >Submit Changes</Button></>}
      
      <p>Phone: {userSession['idToken']['payload']['phone_number']} 
      <EditIcon sx={{ fontSize: 15 }} onClick={() => onEditButtonClick(setEditPhone, editPhone)}/>  </p>
      {editPhone && <><input className="credential-input" propname="phone_number" value={textInput} type="text" placeholder="Enter new phone number..." onChange={onEdit}></input>
      <Button variant="outlined" size="small" onClick={onSubmitEdit} >Submit Changes</Button></>}
      
      <p>Region: {userSession['idToken']['payload']['locale']} 
      <EditIcon sx={{ fontSize: 15 }} onClick={() => onEditButtonClick(setEditRegion, editRegion)}/> </p>
      {editRegion && <><input className="credential-input" propname="locale" value={textInput} type="text" placeholder="Enter new region..." onChange={onEdit}></input>
      <Button variant="outlined" size="small" onClick={onSubmitEdit} >Submit Changes</Button></>}
    </div>
  );
}

export default Profile;