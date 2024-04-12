import React, { useState, useEffect, useContext } from "react";
import { SessionContext } from "../contexts/SessionContext";
import axios from 'axios';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router-dom';
import Menu from "../components/Menu";
import User from "../components/User";
import ValidatorTable from "../components/ValidatorTable";
import { formatFileSize, datetimeFormat } from '../components/utils';

function ValidateData(){
    const { session } = useContext(SessionContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()
    const [tableKey, setTableKey] = useState(0);
    useEffect(() => {
        if (session.loggedIn && session.userType==='Validator') {
            const fetchData = async () => {
                try {
                    const response = await fetch('http://127.0.0.1:5000/display_nonvalidated_files');
                    const names = await response.json();
                    const data = names.map(obj => ({
                        name: obj.Name,
                        description: obj.Description,
                        size: formatFileSize(obj.Size),
                        modified: datetimeFormat.format(new Date(obj.LastModified)),
                        uploadedBy: obj.UploadedBy
                    }));
                    setData(data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    setLoading(false);
                }
            };
    
            fetchData();
        }
        else{
            navigate('/login')
        }
    }, [tableKey]);

    const handleTableReload = () => {
        setTableKey(prevKey => prevKey + 1); // Update tableKey to trigger re-render
        setLoading(true)
    };

    return (
        <div>
            <h1>Validate Data Page</h1>
            <ValidatorTable data={data} loading={loading} onValidation = {handleTableReload}></ValidatorTable>
        </div>
    );
}

export default ValidateData;