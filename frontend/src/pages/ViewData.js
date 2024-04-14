import React from 'react';
import Menu from "../components/Menu";
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import "../styles/viewData.css";
import Button from '@mui/material/Button';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';


//main parent component
function ViewData(props) {
  const { id, uploadedBy } = useParams();
  const [description, setDescription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const url = 'http://localhost:5000/fetchDescription/' + uploadedBy + '-' + id + '.zip';
  const navigate = useNavigate()



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

  const handleBackButton = () => {
    navigate('/explore')
  }

  const handlePurchaseButton = () => {
    const url = 'http://localhost:3000/purchase/' + encodeURIComponent(id) + '/' + encodeURIComponent(uploadedBy);
    const windowName = 'Purhcase ' + {id};
    const windowFeatures = 'width=600,height=400left=' + (window.screen.width / 2 - 300) + ',top=' + (window.screen.height / 2 - 200);
    window.open(url, windowName, windowFeatures)
  }

  return (
    <div>
      {isLoading ? (
        <div className="loadingContainer">
          <p>Loading ...</p>
          <CircularProgress color="secondary" />
        </div>
      ) : (
        <div>
          <Menu />
          <div>
            <Description title={id} description={description}></Description>
          </div>
          <div>
            <Button className="backButton"
              variant="contained"
              onClick={handleBackButton}
              color="secondary"
              startIcon={<ArrowBackIosNewIcon></ArrowBackIosNewIcon>}
              sx={{
                position: 'absolute',
                bottom: '20px', 
                left: '28px', 
              }}>Go Back</Button>

            <Button className="purchaseDataButton"
              variant="contained"
              onClick={handlePurchaseButton}
              color="secondary"
              sx={{
                position: 'absolute',
                bottom: '20px', 
                right: '28px', 
              }}>Purchase Dataset</Button>
              
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
      <h1 className='title'>{props.title}</h1>
      <h3>Description:</h3>
      <p className='description'>{props.description}</p>

    </div>
  );
};




export default ViewData;