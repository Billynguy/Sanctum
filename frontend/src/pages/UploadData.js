import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import axios from 'axios';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Menu from "../components/Menu";
import User from "../components/User";
import "../styles/newUploadData.css";

function NewUploadData() {
    const [files, setFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [status, setStatus] = useState('');
    const [fileForm, setFileForm] = useState(false);
    const [fileFormData, setFileFormData] = useState({
        user: ``,
        age: [0, 0],    // minAge, maxAge
        race: {
            white: false,
            black: false,
            hispanic: false,
            native: false,
            asian: false
        },
        gender: {
            male: false,
            female: false
        },
        subtype: '',
        morphologic: '',
        stage: '',
        grade: '',
        treatment: '',
        survival: ''
    });

    useEffect(() => {
        if (sessionStorage.getItem('userLoggedIn') === "true") {
            setFileFormData(prevState => ({
                ...prevState,
                user: JSON.parse(sessionStorage.getItem('userSession'))['idToken']['payload'][`cognito:username`]
            }));
        }
    }, []);

    const handleFileChange = (event) => { 
        event.preventDefault()
        setFiles([...files, ...event.target.files])
        setStatus('initial')
        setFileForm(true)
        console.log('changed')
    }

    const handleFormChange = (event) => {
        const {name, checked, value} = event.target;
        if (name === 'male' || name === 'female') {
            setFileFormData({
                ...fileFormData, 
                gender: {
                    ...fileFormData.gender, 
                    [name]: checked
                }
            })
        } else if (name === 'white' || name === 'black' || name === 'hispanic' || name === 'native' || name === 'asian') {
            setFileFormData({
                ...fileFormData, 
                race: {
                    ...fileFormData.race, 
                    [name]: checked
                }
            })
        } else if (name === 'minAge' || name === 'maxAge') {
            const newValue = parseInt(value);
            const minAge = name === 'minAge' ? newValue : fileFormData.age[0];
            const maxAge = name === 'maxAge' ? newValue : fileFormData.age[1];
            setFileFormData({
                ...fileFormData, 
                age: [minAge, maxAge]
            })
        } else {
            setFileFormData({
                ...fileFormData, 
                [name]: value
            });
        }
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
                        <p>Next, provide some metadata to characterize the dataset(s) you are uploading:</p>
                        <p2>DEMOGRAPHIC INFORMATION</p2> <br/>

                        <div>
                            <p2>Patient age range (in years): </p2> 
                            <input type="number" name="minAge" value={fileFormData.age[0]} onChange={handleFormChange} placeholder="0"/> 
                            <p2> to </p2>
                            <input type="number" name="maxAge" value={fileFormData.age[1]} onChange={handleFormChange} placeholder="100"/>
                        </div>

                        <div>
                            <p2>Patient race (select all that apply): </p2>
                            <input type="checkbox" name="white" checked={fileFormData.race.white} onChange={handleFormChange}/> <label for="white">White or Caucasian </label>
                            <input type="checkbox" name="black" checked={fileFormData.race.black} onChange={handleFormChange}/> <label for="black">Black or African American </label>
                            <input type="checkbox" name="hispanic" checked={fileFormData.race.hispanic} onChange={handleFormChange}/> <label for="hispanic">Hispanic or Latino </label>
                            <input type="checkbox" name="native" checked={fileFormData.race.native} onChange={handleFormChange}/> <label for="native">Native American or Alaskan Native </label>
                            <input type="checkbox" name="asian" checked={fileFormData.race.asian} onChange={handleFormChange}/> <label for="asian">Asian </label>
                        </div>

                        <div>
                            <p2>Patient sex (select all that apply): </p2>
                            <input type="checkbox" name="male" checked={fileFormData.gender.male} onChange={handleFormChange}/> <label for="male">Male </label>
                            <input type="checkbox" name="female" checked={fileFormData.gender.female} onChange={handleFormChange}/> <label for="female">Female </label>
                        </div>

                        <div>
                            <br/>
                            <p2> DIAGNOSIS INFORMATION (if malignancy)<br/>
                                Subtype <input type="text" name="subtype" value={fileFormData.subtype} onChange={handleFormChange}/> <br/>
                                Morphologic features <input type="text" name="morphologic" value={fileFormData.morphologic} onChange={handleFormChange}/> <br/>
                                Stage <input type="text" name="stage" value={fileFormData.stage} onChange={handleFormChange}/> <br/>
                                Grade <input type="text" name="grade" value={fileFormData.grade} onChange={handleFormChange}/> <br/>
                                Treatment <input type="text" name="treatment" value={fileFormData.treatment} onChange={handleFormChange}/> <br/>
                                Survival <input type="text" name="survival" value={fileFormData.survival} onChange={handleFormChange}/> <br/>
                            </p2>
                        </div>
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