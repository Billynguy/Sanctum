import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import '../styles/dataTable.css';

const mockData = [
    { id: 1, name: 'Dataset A', description: 'Description 1', format: 'JPEG', size: '10 MB' },
    { id: 2, name: 'Dataset B', description: 'This is Dataset B', format: 'PNG', size: '15 MB' },
    { id: 3, name: 'Dataset C', description: 'Another dataset here', format: 'GIF', size: '20 MB' },
    { id: 4, name: 'Dataset D', description: 'Dataset D with some description', format: 'TIFF', size: '12 MB' },
    { id: 5, name: 'Dataset E', description: 'Description of Dataset E', format: 'BMP', size: '18 MB' },
    { id: 6, name: 'Dataset F', description: 'Description for Dataset F', format: 'JPEG', size: '8 MB' },
    { id: 7, name: 'Dataset G', description: 'Description of G dataset', format: 'PNG', size: '16 MB' },
    { id: 8, name: 'Dataset H', description: 'Description for Dataset H', format: 'GIF', size: '22 MB' },
    { id: 9, name: 'Dataset I', description: 'Some details about Dataset I', format: 'TIFF', size: '14 MB' },
    { id: 10, name: 'Dataset J', description: 'Description of Dataset J', format: 'BMP', size: '20 MB' },
    { id: 11, name: 'Dataset K', description: 'K dataset description', format: 'JPEG', size: '11 MB' },
    { id: 12, name: 'Dataset L', description: 'Description for Dataset L', format: 'PNG', size: '17 MB' }
];

const columns = [
    { field: 'name', headerName: 'Name', flex: 0.50 },
    { field: 'description', headerName: 'Format', flex: 2},
    { field: 'format', headerName: 'Format', flex: 0.25 },
    { field: 'size', headerName: 'Size', flex: 0.25 },
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

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch data from your API or backend
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/');
                const data = await response.json();
                console.log(data)
                setData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // const filteredRows = data.filter(row =>
    //     Object.values(row).some(value =>
    //         typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
    //     )
    // );

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
            {loading ? (
                <div>Loading...</div>
            ) : filteredRows.length > 0 ? (
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
