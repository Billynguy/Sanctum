import React from 'react';
import Menu from '../components/Menu';
import User from "../components/User";
import { Button } from "@mui/material";
import DataTable from '../components/DataTable';

function AccessMyDatasets() {
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));

    return (
      <div>
        <Menu />
       <User/>
        
        <div className="header">
        <h1>Datasets I've Downloaded</h1>
        </div>    
          <DataTable />
      </div>
    );
}

export default AccessMyDatasets;