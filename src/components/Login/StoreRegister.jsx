import React, { useState } from 'react';
import { BackArrowIcon, MapPinIcon } from '../ui/Icons';
import { toast } from 'react-toastify';
import loginSpinner from '../../assets/spinner.gif';
import { registerStore } from '../../firebase';
import MapModal from './MapModal';

import '../ui/Button.css';
import '../ui/Form.css';
import '../ui/Spinner.css';

// Días de la semana según tu base de datos
const DAYS_OF_WEEK = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

const StoreRegister = ({ setView }) => {
  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storePhone, setStorePhone] = useState('');
  
  // 👇 Ahora la dirección es un objeto
  const [storeAddress, setStoreAddress] = useState({ texto: '', latitud: null, longitud: null });
  const [storeHours, setStoreHours] = useState('');
  
  // 👇 Nuevo estado para los días de apertura
  const [selectedDays, setSelectedDays] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleRegisterStore = async (e) => {
    e.preventDefault();
    if (!storeName || !email || !password || !storePhone || !storeAddress.texto || !storeHours || selectedDays.length === 0) {
      toast.error("Por favor, llena todos los campos y selecciona al menos un día");
      return;
    }
    setLoading(true);
    try {
      // 👇 Pasamos el objeto de dirección y el array de días
      await registerStore(storeName, email, password, storePhone, storeAddress, storeHours, selectedDays);
      toast.success("¡Tienda registrada exitosamente!");
    } catch (error) {
      toast.error("Hubo un error al registrar la tienda");
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

      <MapModal 
        isOpen={isMapOpen} 
        onClose={() => setIsMapOpen(false)} 
        onAddressSelected={(addressObj) => setStoreAddress(addressObj)} 
      />

      <button className="btn-back" onClick={() => setView('registerOptions')}>
        <BackArrowIcon />
      </button>

      <h1 className="left-title">Regístrate</h1>
      
      <div className="input-group">
        <label>Nombre del local<span>*</span></label>
        <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
      </div>
      <div className="input-group">
        <label>Email<span>*</span></label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="input-group">
        <label>Contraseña<span>*</span></label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="input-group">
        <label>Número de contacto<span>*</span></label>
        <input type="tel" value={storePhone} onChange={(e) => setStorePhone(e.target.value)} />
      </div>
      
      <div className="input-group">
        <label>Dirección<span>*</span></label>
        <div className="input-with-icon">
          <input 
            type="text" 
            value={storeAddress.texto} // Mostramos solo el texto
            onChange={(e) => setStoreAddress({...storeAddress, texto: e.target.value})} 
            placeholder="Escribe o usa el mapa 👉"
          />
          <div onClick={() => setIsMapOpen(true)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', display: 'flex' }} title="Abrir mapa">
            <MapPinIcon />
          </div>
        </div>
      </div>

      <div className="input-group">
        <label>Horario de atención<span>*</span> (Ej: 08:00 AM - 10:00 PM)</label>
        <input type="text" value={storeHours} onChange={(e) => setStoreHours(e.target.value)} />
      </div>

      {/* 👇 Selector de Días de Apertura */}
      <div className="input-group">
        <label>Días de atención<span>*</span></label>
        <div className="days-selector">
          {DAYS_OF_WEEK.map((day) => (
            <div 
              key={day} 
              className={`day-badge ${selectedDays.includes(day) ? 'active' : ''}`}
              onClick={() => toggleDay(day)}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      <button className="btn-ingresar" onClick={handleRegisterStore}>
        REGISTRARSE
      </button>
    </div>
  );
};

export default StoreRegister;