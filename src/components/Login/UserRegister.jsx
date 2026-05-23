import React, { useState } from 'react';
import { BackArrowIcon } from '../ui/Icons';

import { toast } from 'react-toastify';
import loginSpinner from '../../assets/spinner.gif';

// 👇 AGREGA ESTAS LÍNEAS 👇
import '../ui/Button.css';
import '../ui/Form.css';
import '../ui/Spinner.css';
import { registerNormalUser } from '../../firebase'; // 👈 Cambiado

const UserRegister = ({ setView }) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    if (!userName || !email || !password || !userPhone) {
      toast.error("Por favor, llena todos los campos obligatorios");
      return;
    }
    setLoading(true);
    try {
      // 👇 Pasamos los 4 datos que la función espera
      await registerNormalUser(userName, email, password, userPhone);
      toast.success("¡Usuario creado exitosamente!");
      // Aquí podrías agregar un redireccionamiento al Home
    } catch (error) {
      toast.error("Hubo un error al registrarse");
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

      <button className="btn-back" onClick={() => setView('registerOptions')}>
        <BackArrowIcon />
      </button>

      <h1 className="left-title">Regístrate</h1>

      <div className="input-group">
        <label>Nombres y Apellidos<span>*</span></label>
        <input 
          type="text" 
          value={userName} 
          onChange={(e) => setUserName(e.target.value)} 
        />
      </div>
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
      <div className="input-group">
        <label>Celular<span>*</span></label>
        <input 
          type="tel" 
          value={userPhone} 
          onChange={(e) => setUserPhone(e.target.value)} 
        />
      </div>

      <button className="btn-ingresar" onClick={handleRegisterUser}>
        REGISTRARSE
      </button>
    </div>
  );
};

export default UserRegister;