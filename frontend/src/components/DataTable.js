import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import '../styles/dataTable.css';
import { Link } from 'react-router-dom';
const columns = [
    { field: 'name', headerName: 'Name', flex: 1,  renderCell: (params) => <Link to={`/view/${params.value}/${params.row.uploadedBy}`}>{params.value}</Link>   },
    { field: 'description', headerName: 'Description', flex: 2},
    { field: 'tags', headerName: 'Tags', flex: 0.50},
    { field: 'size', headerName: 'Size', flex: 0.25 },
    { field: 'uploadedBy', headerName: 'Uploaded By', flex: 0.50},
    { field: 'modified', headerName: 'Last Modified', flex: 0.50 },
];

function getRowId(row){
    return row.name;
}

function DataTable( {data, loading }){
    const [searchTerm, setSearchTerm] = useState('');
    const initialPaginationState = {
        pagination: {
            paginationModel: { page: 0, pageSize: 10 },
        },
    };

    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

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

export default DataTable;
