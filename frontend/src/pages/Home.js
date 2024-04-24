import React from 'react';
import { useEffect } from 'react';
import Menu from '../components/Menu';
import User from "../components/User";
import TypedHomeTitle from "../components/TypedHomeTitle";
import "../styles/home.css";
import lottie from 'lottie-web';
import {Link, useNavigate} from "react-router-dom";

function Home() {

  /* Code for scroll fade animation */
  useEffect(() => {
    const sections = document.querySelectorAll(".section");

    function fadeInSections() {
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sectionTop < windowHeight) {
          section.classList.add("fade-in");
        }
      });
    }

    window.addEventListener("scroll", fadeInSections);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", fadeInSections);
    };
  }, []); // Empty dependency array ensures the effect runs only once after initial render


  /* Code for Lottie animated graphics */
  useEffect(() => {
    const animationContainer = document.getElementById('animation-container');
  
    const animation = lottie.loadAnimation({
      container: animationContainer,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/assets/laptop-guy.json'
    });
  
    return () => {
      animation.destroy();
    };
  }, []);

  useEffect(() => {
    const animationContainer = document.getElementById('animation-container-2');
  
    const animation = lottie.loadAnimation({
      container: animationContainer,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/assets/transfer-records.json'
    });
  
    return () => {
      animation.destroy();
    };
  }, []);


  return (
    <div>
      <User/>
      <Menu/>
      <TypedHomeTitle/>

      <div className="section simple-section">
        <h2 className="title align-left">With Sanctum, healthcare data is made simple.</h2>
        <p className="text simple-section-text">Our marketplace does away with deprecated and inaccessible medical data storage systems. <br/><br/>Instead, it provides a modern hub where data <b>contribution</b>, <b>validation</b>, and <b>acquisition</b> are simplified processes.</p>
      </div>

      <div className="section transfer-records-graphic" id="animation-container-2"/>

      <div className="section">
        <h2 className="title">All of the perks, none of the compromises.</h2>

        <div className="section align-center" id="no-bottom-margin">
          <div className="bubble diversity-bubble">
            <p><h3>Diversity</h3> <br/> Our datasets are aggregrated from a vast community of contributors, whether they be individuals or institutions.</p>
          </div>
          <div className="bubble quality-bubble">
            <p><h3>Quality</h3> <br/> Sanctum performs a thorough validation process that reviews uploaded datasets for reliability, accuracy, and completeness.</p>
          </div>
        </div>

        <div className="section align-center">
          <div className="bubble anonymization-bubble">
            <p><h3>Anonymization</h3> <br/> All available data is fully anonymous to ensure the privacy and protection of patients.</p>
          </div>
          <div className="bubble compliance-bubble">
              <p><h3>Compliance</h3> <br/> Sanctum upholds existing regulation and data protection laws as provided by leading organizations such as HIPPA.</p>
          </div>
          <div className="bubble economy-bubble">
            <p><h3>Economy</h3> <br/> Purchasing from our marketplace is fast and convenient so customers can access data with ease.</p>
          </div>
        </div>
      </div>
      
      <div className="section how-section">
        <h2 className="title align-left">How does it work?</h2>
        <p className="text">Sanctum supports three types of users: <b>data contributors</b>, <b>data validators</b>, and <b>data purchasers</b>. Contributors are invited to upload their medical
          datasets that they wish to share. Then, approved data validators evaluate the dataset to ensure it meets our five above-listed criteria. </p>
      </div>

      <div className="section laptop-guy-graphic" id="animation-container"/>

      <div className="section then-section">
        <h2 className="title align-right">...and then what?</h2>
        <br/>
        <p className="text align-right">Once the dataset is validated, the dataset then becomes available to view and purchase on our marketplace. <br/> <br/> Data purchasers may safely purchase the dataset 
          using our integrated Square payment platform, and the original data contributor is compensated.</p>
      </div>

      <div className="section align-center">
        <p className="text"><Link to="/signup" className="sign-up-button">Get started</Link></p>
      </div>
    </div>
  );
}

export default Home;
