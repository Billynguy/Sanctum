import React from 'react';
import Menu from "../components/Menu";
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import "../styles/viewData.css";
import Button from '@mui/material/Button';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import UserPool from '../components/UserPool';
import User from '../components/User';


//main parent component
function ViewData(props) {
  const { id, uploadedBy } = useParams();
  const [description, setDescription] = useState(null);
  const [price, setPrice] = useState(null);
  const [size, setSize] = useState(null);
  const [uploadedDate, setUploadedDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [purchaseList, setPurchaseList] = useState([]);
  const url = 'http://localhost:5000/fetchData/' + uploadedBy + '-' + id + '.zip';
  const navigate = useNavigate()

  var user = UserPool.getCurrentUser();
  var sess;
  if(user != null){
    user.getSession(function (err, session) { 
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      }
      sess = session;
    });
  }

  let isMessageHandled = false;
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
        const list = await axios.get('http://localhost:5000/getPurchasedSets/' + sess['idToken']['payload']['cognito:username'])
        setPurchaseList(list.data.purchases)
        // console.log(purchaseList)

        
        
        const handleMessage = async (event) => {
          if (!isMessageHandled && event.data === 'paymentConfirmed') {
            isMessageHandled = true;
            window.removeEventListener('message', handleMessage);
            await addToPurchaseList();
            navigate('/access');
            alert('Payment confirmed! The dataset is now downloadable!');
            console.log('Payment confirmed');
            
          }
        };

        window.addEventListener('message', handleMessage);
        return () => {
          window.removeEventListener('message', handleMessage);
        };

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false); // Set isLoading to false regardless of success or failure
      }
    };
    fetchData();
  }, []);

  const addToPurchaseList = async () => {
    try {
      const url = 'http://127.0.0.1:5000//updateUserPurchases/' + uploadedBy + '-' + id + '.zip/' + sess['idToken']['payload']['cognito:username'];
      const response = await axios.get(url);
      console.log(response);
    }
    catch (error) {
      console.error(error);
    }
  }

  const handleBackButton = () => {
    navigate('/explore')
  }
  const handleGenClick = () => {
    if (purchaseList.includes(uploadedBy + '-' + id + '.zip')) {
      handleDownload(id, uploadedBy);
    } else {
      handlePurchaseButton();
    }
  };

  const handlePurchaseButton = () => {
    const url = 'http://localhost:3000/purchase/' + encodeURIComponent(id) + '/' + encodeURIComponent(uploadedBy);
    const windowName = 'Purhcase ' + { id };
    const windowFeatures = 'width=600,height=400left=' + (window.screen.width / 2 - 300) + ',top=' + (window.screen.height / 2 - 200);
    window.open(url, windowName, windowFeatures)
  }

  const handleDownload = async (fileName, user) => {
    let name = user + '-' + fileName + '.zip';
    let routeurl = 'http://127.0.0.1:5000/download';
    try {
      const response = await axios.post(routeurl, { files: [name] });

      // Parse the response data to get the pre-signed URL
      const presignedUrl = response.data.presigned_url;

      // Use the pre-signed URL to download the file
      const downloadResponse = await axios.get(presignedUrl, {
        responseType: 'blob' // Specify the response type as blob
      });

      // Create a Blob object from the downloaded file data
      const blob = new Blob([downloadResponse.data]);

      // Create a temporary URL for the Blob object
      const url = window.URL.createObjectURL(blob);

      // Create a download link and trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = user + '-' + fileName + '.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url); // Clean up the temporary URL
    }
    catch (error) {
      console.error(error);
    }
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
          <User></User>
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
              onClick={handleGenClick}
              color="secondary"
            >{purchaseList.includes(uploadedBy + '-' + id + '.zip') ? "Download Dataset" : "Purchase Dataset"}</Button>

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