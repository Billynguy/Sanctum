import React from 'react';
import Menu from "../components/Menu";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
//main parent component
function ViewData(props) {
  const { id, uploadedBy } = useParams();
  const [description, setDescription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const url = 'http://localhost:5000/fetchDescription/' + uploadedBy + '-' + id + '.zip';

  // useEffect(() => {
  //   axios.get(url)
  //     .then(response => {
  //       setDescription(response.data.description);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching data:', error);
  //     });
  //   setIsLoading(false);
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get(url);
            setDescription(response.data.description);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false); // Set isLoading to false regardless of success or failure
        }
    };

    fetchData();
}, []);



  return (
    <div>
      {isLoading ? (
        <div className = "loadingContatiner">
        <p>Loading ...</p>
        <CircularProgress />
        </div>
      ) : (
        <div>
          <Menu />
          <div>
            <Description title={id} description={description}></Description>
          </div>
        </div>
      )}
    </div>
  );
};

//child component for the top half of the page (title, description, metadata)
function Description(props) {
  return (
    <div>
      <h1>{props.title}</h1>
      <p>{props.description}</p>
    </div>
  );
};




export default ViewData;