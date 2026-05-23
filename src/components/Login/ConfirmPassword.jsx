import React, { useState, useEffect } from 'react';
import { confirmNewPassword } from '../../firebase'; 
import { toast } from 'react-toastify';
import loginSpinner from '../../assets/spinner.gif';

import '../ui/Button.css';
import '../ui/Form.css';
import '../ui/Spinner.css';

const ConfirmPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [oobCode, setOobCode] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('oobCode');
    if (code) {
      setOobCode(code);
    } else {
      toast.error("El enlace no es válido o ha expirado.");
    }
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.warning("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (!oobCode) {
      toast.error("Falta el código de autorización.");
      return;
    }

    setLoading(true);
    try {
      await confirmNewPassword(oobCode, newPassword);
      setSuccess(true);
      toast.success("¡Contraseña actualizada con éxito! 🥳");
    } catch (error) {
      toast.error("El enlace expiró o ya fue utilizado. Solicita uno nuevo.");
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

      <h1 className="left-title">Crea tu nueva contraseña</h1>
      
      {success ? (
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '24px', color: '#34A853', fontWeight: '500' }}>
            Tu contraseña ha sido cambiada. Ya puedes volver a la aplicación e iniciar sesión.
          </p>
          <button className="btn-ingresar" onClick={() => window.location.href = '/'}>
            Ir al Inicio de sesión
          </button>
        </div>
      ) : (
        <>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px', textAlign: 'left' }}>
            Escribe una contraseña segura que puedas recordar para tu cuenta en App Tu Calle.
          </p>

          <div className="input-group">
            <label>Nueva Contraseña<span>*</span></label>
            <input 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <button className="btn-ingresar" onClick={handleUpdatePassword}>
            Actualizar Contraseña
          </button>
        </>
      )}
    </div>
  );
};

export default ConfirmPassword;