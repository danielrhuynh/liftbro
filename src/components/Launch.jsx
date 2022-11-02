import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../resources/logo.png';
import Button from './Button/Button';

const LandingPage = () => {
  const navigate = useNavigate();
  const navigateToHome = () => {
    navigate("/home");
  }

  return (
    <>
      <img src={logo} className="App-logo" alt="logo" />
      <br></br>
      <h1 className="title">Welcome to LiftBro!</h1>
      <br></br>
      <Button onClick={ async () => { navigateToHome() }}>Lets Go!</Button>
    </>
  );
}

export default LandingPage;