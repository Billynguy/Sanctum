import React, { useContext } from 'react';
import {Link, useNavigate} from "react-router-dom";
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import Logout from '@mui/icons-material/Logout';
import WalletIcon from '@mui/icons-material/Wallet';
import UserPool from '../components/UserPool';
import "../styles/user.css";

function User() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
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
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

    const onProfileClick = () => {
      setAnchorEl(null);
      navigate('/profile');
    };

    const onMyUploaded = () => {
      setAnchorEl(null);
      navigate('/myuploaded');
    };

    const onAccessMyData = () => {
      setAnchorEl(null);
      navigate('/access');
    };

    const onWallet = () => {
      setAnchorEl(null);
      navigate('/wallet');
    };

    const onSignOut = () => {
      user.signOut();
      alert("You have been signed out.");
      setAnchorEl(null);
      window.location.href = '/';
      //window.location.reload();
    };
    return (
        <div className="user">

            {(user!=null) && (
            <>
            <Tooltip title="My account">
            <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ bgcolor: "rgb(199,106,255)"}}>{sess['idToken']['payload']['cognito:username'].charAt(0)}</Avatar>
          </IconButton> </Tooltip> </>)}

          <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
       
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={onProfileClick}> My Profile </MenuItem>
        
        <Divider />

        <MenuItem onClick={onMyUploaded}>  
        <ListItemIcon>
            <UploadFileIcon fontSize="small" />
          </ListItemIcon>
          Datasets I've Uploaded 
        </MenuItem>

        <MenuItem onClick={onAccessMyData}>  
        <ListItemIcon>
            <ManageSearchIcon fontSize="small" />
          </ListItemIcon>
          Access My Datasets
        </MenuItem>

        <Divider />

        <MenuItem onClick={onWallet}>  
        <ListItemIcon>
            <WalletIcon fontSize="small" />
          </ListItemIcon>
          My Wallet
        </MenuItem>

        <Divider />

        <MenuItem onClick={onProfileClick}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>

        <MenuItem onClick={onSignOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
        </div>
    );
}   

export default User;