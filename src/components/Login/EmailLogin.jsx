import React, { useState } from 'react';
import { BackArrowIcon } from '../ui/Icons';
import { login, resetPassword } from '../../firebase'; 
import { toast } from 'react-toastify';
import loginSpinner from '../../assets/spinner.gif';

import '../ui/Button.css';
import '../ui/Form.css';
import '../ui/Spinner.css';

const EmailLogin = ({ setView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleIngresar = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor, llena todos los campos");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      
    } catch (error) {
      toast.error("Correo o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  
  const handleResetPassword = async () => {
    if (!email) {
      toast.warning("Escribe tu correo en la casilla de arriba para enviarte el enlace 👆");
      return;
    }
    
    setLoading(true);
    try {
      await resetPassword(email);
      toast.success("¡Enlace enviado! Revisa tu bandeja de entrada o spam 📧");
    } catch (error) {
      // Firebase lanza error si el correo no existe en la base de datos
      toast.error("No encontramos una cuenta con ese correo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="email-login-container">
      {loading && (
        <div className="login-spinner-overlay">
          <img src={loginSpinner} alt="Cargando..." />
        </div>
      )}

      <button className="btn-back" onClick={() => setView('options')}>
        <BackArrowIcon />
      </button>

      <h1 className="left-title">Inicia sesión</h1>

      <div className="input-group">
        <label>Email<span>*</span></label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Contraseña<span>*</span></label>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* */}
      <a className="forgot-password" onClick={() => setView('forgotPassword')}>
        Olvidé mi contraseña
      </a>

      <button className="btn-ingresar" onClick={handleIngresar}>
        Ingresar
      </button>

      <div className="login-divider">
        <span style={{textTransform: 'none'}}>¿No tienes una cuenta?</span>
      </div>

      <button className="btn-registrarse" onClick={() => setView('registerOptions')}>
        Registrarse
      </button>
    </div>
  );
};

export default EmailLogin;