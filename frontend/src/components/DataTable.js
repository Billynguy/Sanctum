import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import '../styles/dataTable.css';

const mockData = [
    { id: 1, name: 'Dataset A', format: 'JPEG', ageRange: '30-40', gender: 'M', location: 'USA', size: '10 MB' },
    { id: 2, name: 'Dataset B', format: 'PNG', ageRange: '20-30', gender: 'F', location: 'Canada', size: '15 MB' },
    { id: 3, name: 'Dataset C', format: 'GIF', ageRange: '40-50', gender: 'M', location: 'UK', size: '20 MB' },
    { id: 4, name: 'Dataset D', format: 'TIFF', ageRange: '30-40', gender: 'F', location: 'Australia', size: '12 MB' },
    { id: 5, name: 'Dataset E', format: 'BMP', ageRange: '40-50', gender: 'M', location: 'Germany', size: '18 MB' },
    { id: 6, name: 'Dataset F', format: 'JPEG', ageRange: '25-35', gender: 'F', location: 'USA', size: '8 MB' },
    { id: 7, name: 'Dataset G', format: 'PNG', ageRange: '35-45', gender: 'M', location: 'Canada', size: '16 MB' },
    { id: 8, name: 'Dataset H', format: 'GIF', ageRange: '20-30', gender: 'F', location: 'UK', size: '22 MB' },
    { id: 9, name: 'Dataset I', format: 'TIFF', ageRange: '30-40', gender: 'M', location: 'Australia', size: '14 MB' },
    { id: 10, name: 'Dataset J', format: 'BMP', ageRange: '40-50', gender: 'F', location: 'Germany', size: '20 MB' },
    { id: 11, name: 'Dataset K', format: 'JPEG', ageRange: '35-45', gender: 'M', location: 'USA', size: '11 MB' },
    { id: 12, name: 'Dataset L', format: 'PNG', ageRange: '20-30', gender: 'F', location: 'Canada', size: '17 MB' }
];

const columns = [
    { field: 'name', headerName: 'Name', width: 300 },
    { field: 'format', headerName: 'Format', width: 150 },
    { field: 'ageRange', headerName: 'Age', width: 150 },
    { field: 'gender', headerName: 'Gender', width: 150 },
    { field: 'location', headerName: 'Location', width: 200 },
    { field: 'size', headerName: 'Size', width: 120 },
];

function DataTable(){
    const initialPaginationState = {
        pagination: {
            paginationModel: { page: 0, pageSize: 10 },
        },
    };

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredRows = mockData.filter(row =>
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
            {filteredRows.length > 0 ? (
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    initialState={initialPaginationState}
                    disableSelectionOnClick
                    disableColumnMenu
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