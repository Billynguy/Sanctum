import React from 'react';
import Menu from '../components/Menu';
import DataTable from '../components/DataTable';

function ExploreData() {
    return (
        <div>
            <Menu />
            <div className='header'>
                <h1>Explore Data</h1>
            </div>
            <DataTable />
        </div>
    );
}

export default ExploreData;