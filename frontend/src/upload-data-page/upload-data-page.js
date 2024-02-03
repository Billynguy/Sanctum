import React from "react";

import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

class UploadDataPage extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            
            <div>
               
            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                Upload file         
            </Button>
            </div>
        );
    }
};
export default UploadDataPage;