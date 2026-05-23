import React, { useState } from 'react';
import { BackArrowIcon } from '../ui/Icons';
import { resetPassword } from '../../firebase'; 
import { toast } from 'react-toastify';
import loginSpinner from '../../assets/spinner.gif';

const ForgotPassword = ({ setView }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Por favor, ingresa tu correo electrónico.");
      return;
    }
    
    setLoading(true);
    try {
      await resetPassword(email);
      toast.success("¡Enlace enviado! Revisa tu bandeja de entrada o spam 📧");
      // Opcional: Lo regresamos a la vista de login automáticamente después de enviarlo
      setView('emailForm'); 
    } catch (error) {
      toast.error("No encontramos una cuenta registrada con ese correo.");
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

      <button className="btn-back" onClick={() => setView('emailForm')}>
        <BackArrowIcon />
      </button>

      <h1 className="left-title">Recuperar contraseña</h1>
      
      {/* Texto explicativo que solicitaste */}
      <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px', textAlign: 'left', fontFamily: 'var(--font-body)' }}>
        Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace seguro para restablecer tu contraseña.
      </p>

      <div className="input-group">
        <label>Email<span>*</span></label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ejemplo@correo.com"
        />
      </div>

      <button className="btn-ingresar" onClick={handleReset}>
        Enviar enlace
      </button>
    </div>
  );
};

export default ForgotPassword;