import React from "react";

import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

class UploadDataPage extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (

            <div>
                <h1>Data Upload</h1>
                <p>accepted formats: csv, jpg, zip, gzip</p>
                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                    Choose files(s)
                </Button>
                <p>data upload details:
                    upon upload, all data will be parsed and de-identified in compliance with HIPPA, and tokenized. When a model
                    is created that uses your data for training, you will receive x tokens by uploading your data, you consent to 
                    allowing the data to be used for training models and grant access rights to Sanctum. By uploading, you
                    acknowledge that you own the rights to use patient data for research.
                </p>
            </div>
        );
    }
};
export default UploadDataPage;