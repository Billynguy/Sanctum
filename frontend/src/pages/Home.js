import React from 'react';
import { useEffect } from 'react';
import Menu from '../components/Menu';
import User from "../components/User";
import TypedHomeTitle from "../components/TypedHomeTitle";
import "../styles/home.css";

function Home() {

  return (
    <div>
      <User/>
      <Menu/>
      <TypedHomeTitle/>

      <div className="section">
        <h2 className="section-title">With Sanctum, healthcare data is made <b>simple</b>.</h2>
        <p className="section-text">Our marketplace does away with deprecated and inaccessible medical data storage systems. Instead, it provides a modern hub where data <b>contribution</b>, <b>validation</b>, and <b>acquisition</b> are simplified processes.</p>
      </div>

      <div className="section">
        <h2 className="section-title incentives-section-title">All of the perks, none of the compromises.</h2>

        <div className="incentives-section-container">
          <div className="incentives-section-bubble">
            <p><h3>Diversity</h3> <br/> Our datasets are aggregrated from a vast community of contributors, whether they be individuals or institutions.</p>
          </div>
          <div className="incentives-section-bubble">
            <p><h3>Quality</h3> <br/> Sanctum performs a thorough validation process that reviews uploaded datasets for reliability, accuracy, and completeness.</p>
          </div>
          <div className="incentives-section-bubble">
            <p><h3>Anonymization</h3> <br/> All available data is fully anonymous to ensure the privacy and protection of patients.</p>
          </div>
        </div>

        <div className="incentives-section-container">
          <div className="incentives-section-bubble">
              <p><h3>Compliance</h3> <br/> Sanctum upholds existing regulation and data protection laws as provided by leading organizations such as HIPPA.</p>
          </div>
          <div className="incentives-section-bubble">
            <p><h3>Economy</h3> <br/> Purchasing from our marketplace is fast and convenient so customers can access data with ease.</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">enter section header text</h2>
        <p className="section-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      </div>
    </div>
  );
}

export default Home;
