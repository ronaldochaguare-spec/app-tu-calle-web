import React from 'react';
import { BackArrowIcon } from '../ui/Icons';

// 👇 AGREGA ESTAS LÍNEAS 👇
import '../ui/Button.css';
import '../ui/Form.css';
import '../ui/Spinner.css';

const RegisterOptions = ({ setView }) => {
  return (
    <div className="register-options-container">
      <button className="btn-back" onClick={() => setView('emailForm')}>
        <BackArrowIcon />
      </button>

      <div className="register-content">
        <h1 className="register-title">Queremos<br />conocerte 👇</h1>

        <button className="btn-role" onClick={() => setView('registerUser')}>
          Soy Usuario
        </button>
        <button className="btn-role" onClick={() => setView('registerStore')}>
          Soy Tienda
        </button>
      </div>

      <a className="admin-link">Soy socio administrativo</a>
    </div>
  );
};

export default RegisterOptions;