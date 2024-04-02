import React from 'react';
import Menu from "../components/Menu";
import { useParams } from 'react-router-dom';

//main parent component
function ViewData(props) {
  const {id} = useParams();
  return (
    <div>
      <Menu/>
      <div>
        <Description title={id}></Description>
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