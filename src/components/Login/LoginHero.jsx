import React from 'react';
import fondoImg from '../../assets/fondoLogin.webp';
import '../ui/Button.css';
import '../ui/Form.css';
import '../ui/Spinner.css';
import './LoginHero.css';


const LoginHero = () => {
  return (
    <div className="login-hero">
      <img src={fondoImg} alt="Tu calle" className="login-hero-img" />
      <div className="login-hero-overlay" />
      <div className="login-logo-hero">
        Tu<span>Calle</span>
      </div>
      <div className="login-hero-content">
        <h2>Descubre un<br /><em>nuevo mundo</em></h2>
        <p>más cerca de ti</p>
      </div>
    </div>
  );
};

export default LoginHero;