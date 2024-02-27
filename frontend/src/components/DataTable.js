import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import '../styles/dataTable.css';

const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'description', headerName: 'Format', flex: 2},
    { field: 'tags', headerName: 'Tags', flex: 0.50},
    { field: 'format', headerName: 'Format', flex: 0.25 },
    { field: 'size', headerName: 'Size', flex: 0.25 },
    { field: 'modified', headerName: 'Last Modified', flex: 0.50 },
];

function DataTable(){
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const initialPaginationState = {
        pagination: {
            paginationModel: { page: 0, pageSize: 10 },
        },
    };

    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/display');
                const names = await response.json();
                const data = names.map((name, index) => ({
                    id: index + 1,
                    name: name,
                    description: `Description for ${name}`,
                    format: 'TBD',
                    size: 'TBD',
                    tags: 'TBD'
                }));
                setData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
                    rows={filteredRows}
                    columns={columns}
                    initialState={initialPaginationState}
                    pageSizeOptions={[10]}
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
