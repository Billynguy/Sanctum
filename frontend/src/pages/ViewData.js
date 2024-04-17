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
  const [price, setPrice] = useState(null);
  const [size, setSize] = useState(null);
  const [uploadedDate, setUploadedDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const url = 'http://localhost:5000/fetchData/' + uploadedBy + '-' + id + '.zip';
  const navigate = useNavigate()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        setDescription(response.data.description);
        setPrice(response.data.price / 100);
        setSize(response.data.size);
        const dateStr = response.data.uploadedDate;

        // Split the date string into its components
        const [day, month, year, hour, minute, second] = dateStr.split('-');

        // Create a new Date object
        const parsedDate = new Date(year, month - 1, day);

        // Format the date as desired
        const formattedDate = parsedDate.toLocaleDateString();
        setUploadedDate(formattedDate);
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
    const windowName = 'Purhcase ' + { id };
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
          <div className='body'>
            <Description title={id}
              description={description}
              uploadedBy={uploadedBy}
              price={price}
              size={size}
              uploadedDate={uploadedDate}></Description>
          </div>
          <div className='buttons'>
            <Button className="backButton"
              variant="contained"
              onClick={handleBackButton}
              color="secondary"
              startIcon={<ArrowBackIosNewIcon></ArrowBackIosNewIcon>}
            >Go Back</Button>

            <Button className="purchaseDataButton"
              variant="contained"
              onClick={handlePurchaseButton}
              color="secondary"
            >Purchase Dataset</Button>

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
      <p>{props.description}</p>
      <h3>Uploaded By:</h3>
      <p>{props.uploadedBy}</p>
      <h3>Uploaded Date:</h3>
      <p>{props.uploadedDate}</p>
      <h3>Price:</h3>
      <p>${props.price}</p>
      <h3>Size:</h3>
      <p>{props.size}</p>

    </div>
  );
};




export default ViewData;