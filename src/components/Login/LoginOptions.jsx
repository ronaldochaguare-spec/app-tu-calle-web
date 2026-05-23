import React, { useState } from 'react';
import { GmailIcon, EmailIcon } from '../ui/Icons';
import { loginWithGoogle } from '../../firebase';
import loginSpinner from '../../assets/spinner.gif';

import '../ui/Button.css';
import '../ui/Form.css';
import '../ui/Spinner.css';

const LoginOptions = ({ setView }) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true); // Encendemos el spinner
    try {
      await loginWithGoogle(); 
    } catch (error) {
      
      if (error.code === 'auth/popup-closed-by-user') {
        toast.info("Cancelaste el inicio de sesión con Google.");
      } else {
        toast.error("Hubo un problema al conectar con Google.");
      }
    } finally {
      // 4. FINALLY: Pase lo que pase, apagamos el spinner
      setLoading(false); 
    }
  };

  return (
    <>
      {loading && (
        <div className="login-spinner-overlay">
          <img src={loginSpinner} alt="Cargando..." />
        </div>
      )}

      <h1>Bienvenido</h1>
      <p className="subtitle">Inicia sesión para continuar</p>

      <button className="btn-email" onClick={() => setView('emailForm')}>
        <EmailIcon />
        Continua con email
      </button>

      <div className="login-divider">
        <span>o</span>
      </div>

      <button className="btn-google" onClick={handleGoogleLogin}>
        <GmailIcon />
        Continua con gmail
      </button>
    </>
  );
};

export default LoginOptions;