import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../ui/MapModal.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapUpdater = ({ center }) => {
  const map = useMap();
  if (center) {
    map.flyTo([center.lat, center.lng], 16);
  }
  return null;
};

const LocationMarker = ({ position, setPosition, setAddressText }) => {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });
      
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        setAddressText(data.display_name || "Dirección seleccionada");
      } catch (error) {
        console.error("Error al obtener dirección", error);
      }
    },
  });
  return position === null ? null : <Marker position={[position.lat, position.lng]}></Marker>;
};

const MapModal = ({ isOpen, onClose, onAddressSelected }) => {
  const [position, setPosition] = useState({ lat: -11.9799, lng: -77.0006 });
  const [addressText, setAddressText] = useState('');
  
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Referencia para evitar que el autocompletado dispare una nueva búsqueda
  const preventAutoSearch = useRef(false);

  // ⏱️ EFECTO DEBOUNCE: Escucha cada vez que el usuario teclea
  useEffect(() => {
    // Si el texto está vacío o tiene menos de 3 letras, limpiamos y no buscamos
    if (!searchInput.trim() || searchInput.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Si el usuario acaba de hacer clic en una sugerencia, ignoramos este cambio
    if (preventAutoSearch.current) {
      preventAutoSearch.current = false;
      return;
    }

    setIsSearching(true);

    // Configuramos el temporizador de 600ms
    const timerId = setTimeout(async () => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchInput}&limit=5&countrycodes=pe`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          setSuggestions(data);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error("Error en la búsqueda", error);
      } finally {
        setIsSearching(false);
      }
    }, 600); // 👈 Espera 600 milisegundos después de la última tecla presionada

    // Limpieza: si el usuario sigue tecleando antes de los 600ms, cancela el temporizador anterior
    return () => clearTimeout(timerId);
  }, [searchInput]);

  // Cuando el usuario hace clic en una de las sugerencias
  const handleSelectSuggestion = (result) => {
    preventAutoSearch.current = true; // Avisamos al useEffect que ignore este cambio
    
    const newPos = { lat: parseFloat(result.lat), lng: parseFloat(result.lon) };
    setPosition(newPos);
    setAddressText(result.display_name);
    setSearchInput(result.display_name.split(',')[0]); // Ponemos el nombre corto en la barra
    
    setShowSuggestions(false); // Ocultamos la lista
  };

  const handleConfirm = () => {
    if (!position) return;
    onAddressSelected({
      texto: addressText || `${position.lat}, ${position.lng}`,
      latitud: position.lat,
      longitud: position.lng
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="map-modal-overlay">
      <div className="map-modal-content">
        <h3>Selecciona la ubicación</h3>
        <p>Escribe tu calle y te sugeriremos opciones automáticamente</p>
        
        <div className="map-container-wrapper" style={{ overflow: 'visible' }}>
          
          <div style={{ position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, width: '90%', maxWidth: '400px' }}>
            {/* Quitamos el botón "Ir" y el formulario ya que ahora es automático */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Ej: Avenida Los Jardines..."
                className="map-search-input"
                style={{ position: 'static', transform: 'none', width: '100%', margin: 0 }}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {/* Pequeño indicador visual de carga dentro del input */}
              {isSearching && (
                <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#888' }}>
                  Buscando...
                </span>
              )}
            </div>

            {/* MENÚ DESPLEGABLE DE SUGERENCIAS */}
            {showSuggestions && suggestions.length > 0 && (
              <ul style={{ 
                listStyle: 'none', padding: 0, margin: '8px 0 0 0', 
                background: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                maxHeight: '200px', overflowY: 'auto', border: '1px solid #eee'
              }}>
                {suggestions.map((item, index) => (
                  <li 
                    key={index} 
                    onClick={() => handleSelectSuggestion(item)}
                    style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', fontSize: '13px', color: '#333' }}
                    onMouseOver={(e) => e.target.style.background = '#f9f9f9'}
                    onMouseOut={(e) => e.target.style.background = 'white'}
                  >
                    {item.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <MapContainer center={[position.lat, position.lng]} zoom={14} style={{ height: "100%", width: "100%", zIndex: 1 }}>
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={position} />
            <LocationMarker position={position} setPosition={setPosition} setAddressText={setAddressText} />
          </MapContainer>

        </div>

        {addressText && <div style={{ fontSize: '13px', color: '#666', marginBottom: '16px', background: '#f5f5f5', padding: '8px', borderRadius: '6px' }}><strong>Ubicación detectada:</strong> {addressText}</div>}

        <div className="map-modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="btn-confirm" onClick={handleConfirm}>
            Confirmar Ubicación
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapModal;