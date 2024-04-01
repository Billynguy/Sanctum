import React, { useState, useEffect, useContext } from "react";
import { SessionContext } from "../contexts/SessionContext";
import axios from 'axios';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router-dom';
import Menu from "../components/Menu";
import User from "../components/User";

function ValidateData(){
    const { session } = useContext(SessionContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (session.loggedIn) {
            //whatever
        }
        else{
            navigate('/login')
        }
    }, []);

    return (
        <div>
            <h1>Validate Data Page</h1>
        </div>
    );
}

export default ValidateData;