import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import '../styles/dataTable.css';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import axios from 'axios';

const handleDownload = (fileName, user) => {

}

function getRowId(row) {
    return row.name;
}

function ValidatorTable({ data, loading, onValidation }) {
    const columns = [
        { field: 'name', headerName: 'Name', flex: 1, },
        { field: 'description', headerName: 'Description', flex: 2 },
        { field: 'tags', headerName: 'Tags', flex: 0.25 },
        { field: 'size', headerName: 'Size', flex: 0.25 },
        { field: 'uploadedBy', headerName: 'Uploaded By', flex: 0.50 },
        { field: 'modified', headerName: 'Last Modified', flex: 0.50 },
        {
            field: 'downloadDataset',
            headerName: 'Download Button',
            flex: 0.5,
            renderCell: (params) => (
                <Button onClick={() => handleDownload(params.row.name)} color = "secondary" >Download</Button>
            ),
        },
        {
            field: 'validateDataset',
            headerName: 'Validate Button',
            flex: 0.5,
            renderCell: (params) => (
                <Button onClick={() => handleValidate(params.row.name, params.row.uploadedBy)} color = "secondary">Validate</Button>
            ),
        },
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const initialPaginationState = {
        pagination: {
            paginationModel: { page: 0, pageSize: 10 },
        },
    };
    const navigate = useNavigate()
    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
    };
    const handleValidate = (fileName, user) => {
        let url = 'http://127.0.0.1:5000/validateItem/' + user + '-' + fileName + '.zip'
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
