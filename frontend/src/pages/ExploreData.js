import React from 'react';
import Menu from '../components/Menu';
import User from "../components/User";
import DataTable from '../components/DataTable';

function ExploreData() {
    return (
        <div>
            <User/>
            <Menu />
            <div className='header'>
                <h1>Explore Data</h1>
            </div>
            <DataTable />
        </div>
    );
}

export default ExploreData;