import React, { useState, useContext } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import '../styles/dataTable.css';
import Button from '@mui/material/Button';
import axios from 'axios';
import UserPool from '../components/UserPool';


function getRowId(row) {
    return row.name;
}

function ValidatorTable({ data, loading, onValidation }) {
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
    
    const columns = [
        { field: 'name', headerName: 'Name', flex: 1, },
        { field: 'description', headerName: 'Description', flex: 2 },
        { field: 'tags', headerName: 'Tags', flex: 0.25 },
        { field: 'size', headerName: 'Size', flex: 0.45 },
        { field: 'uploadedBy', headerName: 'Uploaded By', flex: 0.50 },
        { field: 'modified', headerName: 'Last Modified', flex: 0.50 },
        {
            field: 'downloadDataset',
            headerName: 'Download Button',
            flex: 0.5,
            renderCell: (params) => (
                <Button onClick={() => handleDownload(params.row.name, params.row.uploadedBy)} color="secondary" >Download</Button>
            ),
        },
        {
            field: 'validateDataset',
            headerName: 'Validate Button',
            flex: 0.5,
            renderCell: (params) => (
                <Button onClick={() => handleValidate(params.row.name, params.row.uploadedBy)} color="secondary">Validate</Button>
            ),
        },
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const initialPaginationState = {
        pagination: {
            paginationModel: { page: 0, pageSize: 10 },
        },
    };

    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
    };
    const handleValidate = (fileName, user) => {
        let url = 'http://127.0.0.1:5000/validateItem/' + user + '-' + fileName + '.zip/' + sess['idToken']['payload']['cognito:username'];
        const confirmed = window.confirm('Are u sure you would like to validate this item')
        if (confirmed) {
            axios.get(url)
                .then(response => {
                    console.log(response.data)
                    alert('Successfully Validated!')
                    // navigate('/home')
                    onValidation();
                })
                .catch(error => {
                    console.error(error)
                })
        }

    }

    const handleDownload = async (fileName, user) => {
        let name = user + '-' + fileName + '.zip';
        let routeurl = 'http://127.0.0.1:5000/download';
        console.log(name)
        try {
            const response = await axios.post(routeurl, { files: [name] });

        // Parse the response data to get the pre-signed URL
        const presignedUrl = response.data.presigned_url;

        // Use the pre-signed URL to download the file
        const downloadResponse = await axios.get(presignedUrl, {
            responseType: 'blob' // Specify the response type as blob
        });

        // Create a Blob object from the downloaded file data
        const blob = new Blob([downloadResponse.data]);

        // Create a temporary URL for the Blob object
        const url = window.URL.createObjectURL(blob);

        // Create a download link and trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = user + '-' + fileName + '.zip';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url); // Clean up the temporary URL
        }
        catch (error) {
            console.error(error);
        }
    }


    const filteredRows = data.filter(row =>
        Object.values(row).some(value =>
            typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="data-grid-container">
            <div className="search-box">
                <input
                    type="text"
                    placeholder="Keyword search"
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                />
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : filteredRows.length > 0 ? (
                <DataGrid
                    getRowId={getRowId}
                    rows={filteredRows}
                    columns={columns}
                    initialState={initialPaginationState}
                    pageSizeOptions={[10]}
                    disableSelectionOnClick
                    disableColumnMenu
                    disableRowSelectionOnClick
                />
            ) : (
                <div className="no-results">
                    No results found.
                </div>
            )}
        </div>
    );
}

export default ValidatorTable;
