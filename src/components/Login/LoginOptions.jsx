import React, { useState } from 'react';
import { GmailIcon, EmailIcon } from '../ui/Icons';
import { loginWithGoogle } from '../../firebase';
import loginSpinner from '../../assets/spinner.gif';
import { toast } from 'react-toastify';

import '../ui/Button.css';
import '../ui/Form.css';
import '../ui/Spinner.css';

const LoginOptions = ({ setView }) => {
  const [loading, setLoading] = useState(false);
  
  // 👇 Estado para controlar la visibilidad del modal de confirmación
  const [showRoleConfirm, setShowRoleConfirm] = useState(false);

  // Esta función se ejecuta al hacer clic en el botón principal de Gmail
  const initiateGoogleLogin = () => {
    // En lugar de loguear de inmediato, mostramos el aviso
    setShowRoleConfirm(true);
  };

  // Esta función se ejecuta solo si el usuario acepta el aviso
  const handleGoogleLogin = async () => {
    setShowRoleConfirm(false); // Ocultamos el modal
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
      // FINALLY: Pase lo que pase, apagamos el spinner
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

      {/* 👇 MODAL DE CONFIRMACIÓN DE ROL 👇 */}
      {showRoleConfirm && (
        <div className="login-spinner-overlay" style={{ zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '350px',
            textAlign: 'center',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#333' }}>Aviso importante</h3>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5', marginBottom: '24px' }}>
              Por defecto, cuando inicias sesión con Google tendrás el rol de <strong>Usuario</strong>. <br/><br/> ¿Estás de acuerdo en continuar?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => setShowRoleConfirm(false)}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #ccc',
                  background: 'transparent',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  color: '#666'
                }}
              >
                No
              </button>
              <button 
                onClick={handleGoogleLogin}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  background: '#db2c2c',
                  color: 'white',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Sí, continuar
              </button>
            </div>
          </div>
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

      {/* 👇 Cambiamos el onClick para que llame a la función intermedia */}
      <button className="btn-google" onClick={initiateGoogleLogin}>
        <GmailIcon />
        Continua con gmail
      </button>
    </>
  );
};

export default LoginOptions;