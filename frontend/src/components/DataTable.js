import React, { useState, useEffect } from 'react';
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

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
        const k = 1024;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const datetimeFormat = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/display_files');
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
