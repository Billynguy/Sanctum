import React from "react";
import Button from '@mui/material/Button';
import axios from 'axios';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import BasicMenu from "../components/BasicMenu";
import "../styles/uploadData.css";

class UploadData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            uploadedFiles: []

        };
    }

    handleFileChange = (event) => {
        event.preventDefault();
        this.setState({ files: [...event.target.files]})
        console.log('changed')
    };

    handleFileSubmit = (event) => {
        event.preventDefault();
        const url = 'http://localhost:5000/upload';
        const formData = new FormData();
        this.state.files.forEach((file, index) => {
            formData.append('files', file);
        })
        
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            },
        };
        for (const pair of formData.entries()) {
            console.log(pair[0], pair[1]);
          }
          axios.interceptors.request.use(function (config) {
            // Log the request before sending
            console.log('Request:', config);
            return config;
          }, function (error) {
            // Do something with request error
            return Promise.reject(error);
          });
        axios.post(url, formData, config)
            .then((response) => {
                console.log(response.data);
                // this.setState({uploadedFiles: response.data.files})
            })
            .catch((error) => {
                console.error("Error uploading this file")
            });

    };
    render() {
        return (
            <div>
                <BasicMenu/>
                <h1>Data Upload</h1>
                <p>Accepted formats: csv, jpg, zip, gzip</p>
                <form onSubmit={this.handleFileSubmit}>
                    <input type="file"multiple onChange={this.handleFileChange}></input>
                    <Button type = "submit" component="label" variant="contained" onClick = {this.handleFileSubmit} startIcon={<CloudUploadIcon />}>
                        Submit
                    </Button>
                    <p>Data upload details:
                        Upon upload, all data will be parsed and de-identified in compliance with HIPPA, and tokenized. When a model
                        is created that uses your data for training, you will receive x tokens by uploading your data, you consent to
                        allowing the data to be used for training models and grant access rights to Sanctum. <br></br> <br></br> By uploading, you
                        acknowledge that you own the rights to use patient data for research.
                    </p>
                </form>
                {this.state.uploadedFiles.map((file, index) => (
                    <img key = {index} src = {file} alt = {`Uploaded content ${index}`} />
                ))}
            </div>
        );
    }
};
export default UploadData;