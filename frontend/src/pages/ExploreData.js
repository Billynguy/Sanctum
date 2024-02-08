import React from 'react';
import BasicMenu from '../components/BasicMenu';
import DataTable from '../components/DataTable';

function ExploreData() {
    return (
        <div>
            <BasicMenu />
            <div className='header'>
                <h1>Explore Data</h1>
            </div>
            <DataTable />
        </div>
    );
}

export default ExploreData;