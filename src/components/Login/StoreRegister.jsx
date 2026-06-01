import React, { useState } from 'react';
import { BackArrowIcon, MapPinIcon } from '../ui/Icons';
import { toast } from 'react-toastify';
import loginSpinner from '../../assets/spinner.gif';
import { registerStore } from '../../firebase';
import MapModal from './MapModal';

import '../ui/Button.css';
import '../ui/Form.css';
import '../ui/Spinner.css';

const DAYS_OF_WEEK = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

// 👇 Opciones estandarizadas para los selectores de tiempo
const HOURS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const MINUTES = ['00', '15', '30', '45'];
const AMPM = ['AM', 'PM'];

const StoreRegister = ({ setView }) => {
  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const [storeAddress, setStoreAddress] = useState({ texto: '', latitud: null, longitud: null });
  
  // 👇 Estados para los selectores de apertura
  const [openHour, setOpenHour] = useState('08');
  const [openMin, setOpenMin] = useState('00');
  const [openPeriod, setOpenPeriod] = useState('AM');
  
  // 👇 Estados para los selectores de cierre
  const [closeHour, setCloseHour] = useState('10');
  const [closeMin, setCloseMin] = useState('00');
  const [closePeriod, setClosePeriod] = useState('PM');
  
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
    if (!storeName || !email || !password || !storePhone || !storeAddress.texto || selectedDays.length === 0) {
      toast.error("Por favor, llena todos los campos y selecciona al menos un día");
      return;
    }
    
    setLoading(true);
    
    // 👇 Armamos el string exacto que querías: "08:00 AM - 10:00 PM"
    const formattedStoreHours = `${openHour}:${openMin} ${openPeriod} - ${closeHour}:${closeMin} ${closePeriod}`;

    try {
      await registerStore(storeName, email, password, storePhone, storeAddress, formattedStoreHours, selectedDays);
      toast.success("¡Tienda registrada exitosamente!");
    } catch (error) {
      toast.error("Hubo un error al registrar la tienda");
    } finally {
      setLoading(false);
    }
  };

  // Estilo reutilizable para los selectores para que combinen con tus inputs
  const selectStyle = {
    padding: '10px 8px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    background: '#f9f9f9',
    color: '#333',
    outline: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: 'inherit'
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
            value={storeAddress.texto} 
            onChange={(e) => setStoreAddress({...storeAddress, texto: e.target.value})} 
            placeholder="Escribe o usa el mapa 👉"
          />
          <div onClick={() => setIsMapOpen(true)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', display: 'flex' }} title="Abrir mapa">
            <MapPinIcon />
          </div>
        </div>
      </div>

      {/* 👇 NUEVO DISEÑO CON SELECTORES DESPLEGABLES 👇 */}
      <div className="input-group">
        <label>Horario de atención<span>*</span></label>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          
          {/* Bloque Apertura */}
          <div style={{ flex: 1, background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Apertura</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <select style={selectStyle} value={openHour} onChange={(e) => setOpenHour(e.target.value)}>
                {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
              <span style={{ alignSelf: 'center', fontWeight: 'bold', color: '#666' }}>:</span>
              <select style={selectStyle} value={openMin} onChange={(e) => setOpenMin(e.target.value)}>
                {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select style={{...selectStyle, marginLeft: '4px', background: '#fff'}} value={openPeriod} onChange={(e) => setOpenPeriod(e.target.value)}>
                {AMPM.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Bloque Cierre */}
          <div style={{ flex: 1, background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Cierre</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <select style={selectStyle} value={closeHour} onChange={(e) => setCloseHour(e.target.value)}>
                {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
              <span style={{ alignSelf: 'center', fontWeight: 'bold', color: '#666' }}>:</span>
              <select style={selectStyle} value={closeMin} onChange={(e) => setCloseMin(e.target.value)}>
                {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select style={{...selectStyle, marginLeft: '4px', background: '#fff'}} value={closePeriod} onChange={(e) => setClosePeriod(e.target.value)}>
                {AMPM.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

        </div>
      </div>

      <div className="input-group" style={{ marginBottom: '8px', marginTop: '8px' }}>
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

      <p style={{ 
        fontSize: '12px', 
        color: '#888', 
        marginTop: '-4px', 
        marginBottom: '24px', 
        fontStyle: 'italic' 
      }}>
        Podrás editar tu horario y días de atención más adelante desde tu perfil.
      </p>

      <button className="btn-ingresar" onClick={handleRegisterStore}>
        REGISTRARSE
      </button>
    </div>
  );
};

export default StoreRegister;