import React, { useState, useEffect } from 'react';
import Menu from '../components/Menu';
import User from "../components/User";
import DataTable from '../components/DataTable';
import { formatFileSize, datetimeFormat } from '../components/utils';

function ExploreData() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div>
            <User/>
            <Menu />
            <div className='header'>
                <h1>Explore Data</h1>
            </div>
            <DataTable data={data} loading={loading} />
        </div>
    );
}

export default ExploreData;