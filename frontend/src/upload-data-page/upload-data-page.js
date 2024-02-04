import React from "react";
import axios from 'axios';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

class UploadDataPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,

        };
    }

    handleFileChange = (event) => {
        event.preventDefault();
        this.setState({ file: event.target.files[0] })
        console.log('changed')
    };

    handleFileSubmit = (event) => {
        event.preventDefault();
        const { file } = this.state;
        const url = 'http://localhost:3000/uploadFile';
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);
        console.log(this.state.file)
        const config = {
            headers: {
                'content-type': 'multipart/form-date',
            },
        };
        console.log(file.name)
        // axios.post(url, formData, config)
        //     .then((response) => {
        //         console.log(response.data);
        //     })
        //     .catch((error) => {
        //         console.error("Error uploading this file")
        //     });

    };
    render() {
        return (
            <div>
                <h1>Data Upload</h1>
                <p>accepted formats: csv, jpg, zip, gzip</p>
                <form onSubmit={this.handleFileSubmit}>
                    <input type="file" onChange={this.handleFileChange}></input>
                    <Button type = "submit" component="label" variant="contained" onClick = {this.handleFileSubmit} startIcon={<CloudUploadIcon />}>
                        Submit
                    </Button>
                    <p>data upload details:
                        upon upload, all data will be parsed and de-identified in compliance with HIPPA, and tokenized. When a model
                        is created that uses your data for training, you will receive x tokens by uploading your data, you consent to
                        allowing the data to be used for training models and grant access rights to Sanctum. By uploading, you
                        acknowledge that you own the rights to use patient data for research.
                    </p>
                </form>
            </div>
        );
    }
};
export default UploadDataPage;