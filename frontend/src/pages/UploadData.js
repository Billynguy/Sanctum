import React, { useState } from "react";
import Button from '@mui/material/Button';
import axios from 'axios';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Menu from "../components/Menu";
import "../styles/uploadData.css";

const UploadData = () => {
    const [files, setFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [status, setStatus] = useState("initial");

    const handleFileChange = (event) => {
        event.preventDefault();
        setFiles([...event.target.files]);
        setStatus("initial");
        console.log('changed');
    };

    const handleFileSubmit = async (event) => {
        event.preventDefault();
        const url = 'http://localhost:5000/upload';
        setStatus("uploading");
        const formData = new FormData();
        files.forEach((file, index) => {
            formData.append('files', file);
        });

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
                setStatus("success");
                setUploadedFiles(files);
            })
            .catch((error) => {
                console.error("Error uploading this file");
                setStatus("fail");
            });

    };

    return (
        <div className="wholeDataPage">
            <Menu />
            <div className="title">
                <h1>Data Upload</h1>
                <p>Accepted formats: csv, jpg, zip, gzip</p>
            </div>
            <div className="fileForm">
                <form onSubmit={handleFileSubmit}>
                    <div className="uploadSection">
                        <input className="chooseButton" type="file" multiple onChange={handleFileChange}></input>
                        <div className="uploadContainer">
                            <Button className="uploadButton" type="submit" color="secondary" component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                                Upload
                            </Button>
                        </div>
                    </div>
                    {files &&
                        [...files].map((file, index) => (
                            <section key={file.name}>
                                File number {index + 1} details:
                                <ul>
                                    <li>Name: {file.name}</li>
                                    <li>Type: {file.type}</li>
                                    <li>Size: {(file.size / (1024 * 1024)).toFixed(2)} MB</li>
                                </ul>
                            </section>
                        ))}
                    <div className="progressContainer">
                        <Result status={status} />
                    </div>
                    <p className="bottom">Data upload details: <br />
                        Upon upload, all data will be parsed and de-identified in compliance with HIPPA, and tokenized. When a model
                        is created that uses your data for training, you will receive x tokens by uploading your data, you consent to
                        allowing the data to be used for training models and grant access rights to Sanctum. <br /><br /> By uploading, you
                        acknowledge that you own the rights to use patient data for research.
                    </p>

                </form>
            </div>
        </div>
    );
};

const Result = ({ status }) => {
    if (status === "success") {
        return <p>✅ Uploaded successfully!</p>;
    } else if (status === "fail") {
        return <p>❌ Upload failed!</p>;
    } else if (status === "uploading") {
        return <p>⏳ Uploading started...</p>;
    } else {
        return null;
    }
};

export default UploadData;
