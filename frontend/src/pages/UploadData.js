import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router-dom';
import Menu from "../components/Menu";
import User from "../components/User";
import "../styles/uploadData.css";
import UserPool from '../components/UserPool';

function NewUploadData() {
    const navigate = useNavigate()
    const [files, setFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [status, setStatus] = useState('');
    const [fileForm, setFileForm] = useState(false);

    var user = UserPool.getCurrentUser();
    var sess;
    if(user != null){
      user.getSession(function (err, session) { 
        if (err) {
          alert(err.message || JSON.stringify(err));
          window.location.href = '/login';
          return;
        }
        sess = session;
      });
    }
    else{
        window.location.href = '/login';
    }

    const [fileFormData, setFileFormData] = useState({
        user: '',
        filename: '',
        format: '',
        size: '',
        description: ''
        // age: [0, 0],    // minAge, maxAge
        // race: {
        //     white: false,
        //     black: false,
        //     hispanic: false,
        //     native: false,
        //     asian: false
        // },
        // gender: {
        //     male: false,
        //     female: false
        // },
        // subtype: '',
        // morphologic: '',
        // stage: '',
        // grade: '',
        // treatment: '',
        // survival: ''
    });

    useEffect(() => {
        setFileFormData(prevState => ({
            ...prevState,
            user: sess['idToken']['payload']['cognito:username'],
        }));
        if (files.length > 0) {
            const file = files[0];
            setFileFormData(prevState => ({
                ...prevState,
                filename: file.name,
                format: file.type,
                size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
            }));
        }
    }, [files]);

    const handleFileChange = (event) => { 
        event.preventDefault()
        setFiles([ ...event.target.files])
        setStatus('initial')
        setFileForm(true)
        console.log('changed')
    }

    const handleFormChange = (event) => {
        const {name, checked, value} = event.target;
        // if (name === 'male' || name === 'female') {
        //     setFileFormData({
        //         ...fileFormData, 
        //         gender: {
        //             ...fileFormData.gender, 
        //             [name]: checked
        //         }
        //     })
        // } else if (name === 'white' || name === 'black' || name === 'hispanic' || name === 'native' || name === 'asian') {
        //     setFileFormData({
        //         ...fileFormData, 
        //         race: {
        //             ...fileFormData.race, 
        //             [name]: checked
        //         }
        //     })
        // } else if (name === 'minAge' || name === 'maxAge') {
        //     const newValue = parseInt(value);
        //     const minAge = name === 'minAge' ? newValue : fileFormData.age[0];
        //     const maxAge = name === 'maxAge' ? newValue : fileFormData.age[1];
        //     setFileFormData({
        //         ...fileFormData, 
        //         age: [minAge, maxAge]
        //     })
        // } else {
        //     setFileFormData({
        //         ...fileFormData, 
        //         [name]: value
        //     });
        // }
        setFileFormData({
            ...fileFormData,
            description: value
        })
    }

    const handleFileSubmit = async(event) => { 
        event.preventDefault()
        if (!fileFormData.user) {
            console.error("User not logged in");
            return;
        }
        console.log('File Form Data: ', fileFormData)
        const url = 'http://localhost:5000/upload'
        setStatus('uploading')
        const formData = new FormData()
        files.map((file) => (
            formData.append('files', file)
        ))

        formData.append('metadata', JSON.stringify(fileFormData))

        formData.append('user', fileFormData.user)

        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            },
        }

        for (const pair of formData.entries()) {
            console.log(pair[0], pair[1])
        }

        axios.interceptors.request.use(function (config) {
            // Log the request before sending
            console.log('Request:', config)
            return config
        }, function (error) {
            // Do something with request error
            return Promise.reject(error)
        })

        axios.post(url, formData, config)
            .then((response) => {
                console.log(response.data)
                setStatus('success')
                setUploadedFiles([...uploadedFiles, ...files])
        })
        .catch((error) => {
            console.error(error.data)
            console.log('Error uploading this file')
            setStatus('failure')
        })
    }

    return (
        <div class="page">
            <User />
            <Menu />
            <h1>Data Upload</h1>

            <input type="file" multiple onChange={handleFileChange}/> <br/>
            <p2>Accepted formats: csv, jpg, zip, gzip</p2> <br/> <br/>

            {status==='initial' &&
                [...files].map((file, index) => (
                    <section key={file.name}>
                        File {index + 1} details:
                        <ul>
                            <li>Name: {file.name}</li>
                            <li>Type: {file.type}</li>
                            <li>Size: {(file.size / (1024 * 1024)).toFixed(2)} MB</li>
                        </ul>
                    </section>
            ))}

            {fileForm && 
                (
                    <div>
                        <p>Next, provide a detailed description to characterize the dataset(s) you are uploading:</p>
                        <textarea class="description" name="description" rows="4" cols="50" value={fileFormData.description} onChange={handleFormChange}/>
                    </div>
            )}

            <div>
                <p>Data upload details:</p>
                <p2>
                    Upon upload, all data will be parsed and de-identified in compliance with HIPPA, and tokenized. When a model
                    is created that uses your data for training, you will receive x tokens by uploading your data, you consent to
                    allowing the data to be used for training models and grant access rights to Sanctum. <br/> <br/> By uploading, you
                    acknowledge that you own the rights to use patient data for research.
                </p2>
            </div>

            <br/>

            <div>
                <Button type="submit" color="secondary" component="label" variant="contained" onClick={handleFileSubmit} startIcon={<CloudUploadIcon/>}>
                    Upload
                </Button>
                {status==='uploading' && 
                    <p>⏳ Uploading data...</p>
                }
                {status==='success' && 
                    <p>✅ Uploaded successfully!</p>
                }
                {status==='failure' && 
                    <p>❌ Upload failed!</p>
                }
            </div>
        </div>
    )
}

export default NewUploadData;