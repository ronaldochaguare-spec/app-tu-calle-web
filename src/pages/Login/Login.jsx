import React, { useState, useEffect } from 'react';
import '../Login/Login.css'; 
import LoginHero from '../../components/Login/LoginHero';
import LoginOptions from '../../components/Login/LoginOptions';
import EmailLogin from '../../components/Login/EmailLogin';
import RegisterOptions from '../../components/Login/RegisterOptions';
import UserRegister from '../../components/Login/UserRegister';
import StoreRegister from '../../components/Login/StoreRegister';
import ForgotPassword from '../../components/Login/ForgotPassword';

// 👇 1. Importamos la vista de Confirmar Contraseña que creamos antes
import ConfirmPassword from '../../components/Login/ConfirmPassword'; 

const Login = () => {
  const [view, setView] = useState('options'); 

  // 👇 2. Agregamos este useEffect para detectar si venimos del correo
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    const oobCode = urlParams.get('oobCode');

    // Firebase envía en la URL mode=resetPassword y el código oobCode
    if (mode === 'resetPassword' && oobCode) {
      setView('confirmPassword');
    }
  }, []);

  const renderView = () => {
    switch(view) {
      case 'options': return <LoginOptions setView={setView} />;
      case 'emailForm': return <EmailLogin setView={setView} />;
      case 'registerOptions': return <RegisterOptions setView={setView} />;
      case 'registerUser': return <UserRegister setView={setView} />;
      case 'registerStore': return <StoreRegister setView={setView} />;
      case 'forgotPassword': return <ForgotPassword setView={setView} />;
      
      // 👇 3. Agregamos el caso para renderizar la nueva vista
      case 'confirmPassword': return <ConfirmPassword />;
      
      default: return <LoginOptions setView={setView} />;
    }
  };

  return (
    <div className="login">
      {/* ── LEFT: HERO PANEL ── */}
      <LoginHero />

      {/* ── RIGHT: FORM PANEL ── */}
      <div className="login-panel">
        <div className="login-form">
          
          {renderView()}

          <p className="login-terms">
            Al iniciar sesión estás de acuerdo con nuestros{' '}
            <a>Términos y Condiciones</a> y nuestra{' '}
            <a>Política de Privacidad</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;