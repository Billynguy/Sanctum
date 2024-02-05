import React from "react";
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import "./uploadDataPage.css";

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
                    <Button type = "submit" component="label" variant="contained" onClick = {this.handleFileSubmit} startIcon={<CloudUploadIcon />} >
                        Submit
                    </Button>
                    <p><b>Data upload details:</b> Upon upload, all datasets will be parsed and de-identified in compliance with 
                    HIPPA, and tokenized. When a created model uses your dataset(s) for training, you will receive some <i>x</i> number of 
                        tokens for compensation. By uploading your dataset(s), you consent to allowing comprehensive data usage
                        rights to Sanctum, for the purposes of model training and marketplace commerce. You also acknowledge 
                        that you own the rights to use patient data for research.
                    </p>
                </form>
            </div>
        );
    }
};
export default UploadDataPage;