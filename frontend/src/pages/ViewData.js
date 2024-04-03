import React from 'react';
import Menu from "../components/Menu";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
//main parent component
function ViewData(props) {
  const {id} = useParams();
  const [description, setDescription] = useState(null);
  const url = 'http://localhost:5000/fetchDescription/' + id;

  useEffect(() => {
    axios.get(url)
      .then(response => {
        setDescription(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <Menu/>
      <div>
        <Description title={id} description={description}></Description>
      </div>
    </div>
  );
};

//child component for the top half of the page (title, description, metadata)
function Description(props){
  return (
    <div>
      <h1>{props.title}</h1>
      <p>{props.description}</p>
    </div>
  );
};




export default ViewData;