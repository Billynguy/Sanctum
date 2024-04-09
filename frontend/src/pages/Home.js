import React from 'react';
import Menu from '../components/Menu';
import User from "../components/User";
import "../styles/home.css";

function Home() {
  return (
    <div>
      <User/>
      <Menu />
      <div className="header">
        <h1>Welcome to Sanctum</h1>
        <h1>time to style :3</h1>
      </div>
    </div>
  );
}

export default Home;