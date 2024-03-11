import React from "react";
import Button from '@mui/material/Button';
import axios from 'axios';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Menu from "../components/Menu";
import User from "../components/User";
import "../styles/uploadData.css";

const Result = ({ status }) => {
    if (status === "success") {
        return <p1>✅ Uploaded successfully!</p1>;
    } else if (status === "fail") {
        return <p1>❌ Upload failed!</p1>;
    } else if (status === "uploading") {
        return <p1>⏳ Uploading started...</p1>;
    } else {
        return null;
    }
};

class UploadData extends React.Component {
    constructor(props) {
        super(props);
        if (JSON.parse(sessionStorage.getItem('userSession')) === null) {
            window.location.href = '/login'; //swtch to nav?
        }
        if(!JSON.parse(sessionStorage.getItem('userSession'))['idToken']['payload']['custom:user-type'].includes("Data Provider")){
            window.location.href = '/permissiondenied';
        }

        this.state = {
            files: [],
            uploadedFiles: [],
            status: "initial",
            username: JSON.parse(sessionStorage.getItem('userSession'))['idToken']['payload']['cognito:username'],
        };
        
    }    

    handleFileChange = (event) => {
        event.preventDefault();
        this.setState({ files: [...event.target.files] })
        this.setState({ status: "initial" })
        console.log('changed')
    };

    handleFileSubmit = async (event) => {
        event.preventDefault();
        const url = 'http://localhost:5000/upload';
        this.setState({ status: "uploading" })
        const formData = new FormData();
        formData.append('user', this.state.username);
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
                this.setState({ status: "success" })
                this.setState({ uploadedFiles: this.files })
            })
            .catch((error) => {
                console.error("Error uploading this file: ", error.response.data)
                this.setState({ status: "fail" })
            });

    };
    
    render() {
        return (
            <div class="wholeDataPage">
                <User/>
                <Menu />
                <div class="title">
                    <h1>Data Upload</h1>
                    
                    <p>Accepted formats: csv, jpg, zip, gzip</p>
                </div>
                <div class = "fileForm">
                    <form onSubmit={this.handleFileSubmit}>
                        <div class="uploadSection">
                            <input className = "chooseButton" type="file" multiple onChange={this.handleFileChange}></input>
                            <div class="uploadContainer">
                                <Button className="uploadButton" type="submit" color = "secondary" component="label" variant="contained" onClick={this.handleFileSubmit} startIcon={<CloudUploadIcon />}>
                                    Upload
                                </Button>
                            </div>
                        </div>
                        {this.state.files &&
                            [...this.state.files].map((file, index) => (
                                <section key={file.name}>
                                    File number {index + 1} details:
                                    <ul>
                                        <li>Name: {file.name}</li>
                                        <li>Type: {file.type}</li>
                                        <li>Size: {(file.size / (1024 * 1024)).toFixed(2)} MB</li>
                                    </ul>
                                </section>
                            ))}
                        <div class = "progressContainer">
                            <Result status={this.state.status} />
                        </div>
                        <p class = "bottom">Data upload details: <br/>
                            Upon upload, all data will be parsed and de-identified in compliance with HIPPA, and tokenized. When a model
                            is created that uses your data for training, you will receive x tokens by uploading your data, you consent to
                            allowing the data to be used for training models and grant access rights to Sanctum. <br></br> <br></br> By uploading, you
                            acknowledge that you own the rights to use patient data for research.
                        </p>
                    </form>
                </div>
            </div>
        );
    }
};

export default UploadData;
