import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';
import '../ui/MapModal.css';

const libraries = ['places'];

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = { lat: -11.9799, lng: -77.0006 };

const MapModal = ({ isOpen, onClose, onAddressSelected }) => {
  const [position, setPosition] = useState(defaultCenter);
  const [addressText, setAddressText] = useState('');
  const [randomName, setRandomName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setRandomName('search_' + Math.random().toString(36).substring(7));
    }
  }, [isOpen]);

  const autocompleteRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyBmmXJY0q-kywBj5vg43_jdUSV7QqX0qS8", 
    libraries: libraries
  });

  const onMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setPosition({ lat, lng });

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        setAddressText(results[0].formatted_address);
      } else {
        setAddressText("Dirección seleccionada manualmente");
      }
    });
  }, []);

  const onLoadAutocomplete = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        
        setPosition({ lat, lng });
        setAddressText(place.formatted_address || place.name);
      }
    }
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
  if (loadError) return <div className="map-modal-overlay">Error al cargar el mapa. Verifica tu API Key.</div>;
  if (!isLoaded) return <div className="map-modal-overlay"><div className="map-modal-content">Cargando Google Maps...</div></div>;

  return (
    <div className="map-modal-overlay">
      <div className="map-modal-content">
        <h3>Selecciona la ubicación</h3>
        <p>Busca tu local comercial o haz clic en el mapa para fijar la ubicación exacta</p>
        
        <div className="map-container-wrapper" style={{ overflow: 'hidden', position: 'relative' }}>
          
          {/* BUSCADOR DE GOOGLE PLACES */}
          <div style={{ position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, width: '90%', maxWidth: '400px' }}>
            <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
              <input
                type="text"
                name={randomName}
                placeholder="Ej: Avenida Los Jardines..."
                className="map-search-input"
                
                /* 📍 ESTRATEGIA AVANZADA CONTRA EL AUTOFILL 📍 */
                autoComplete="one-time-code" 
                readOnly
                onFocus={(e) => e.target.removeAttribute('readonly')}
                
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  borderRadius: '8px', 
                  border: 'none', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  fontSize: '14px',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
            </Autocomplete>
          </div>

          {/* MAPA DE GOOGLE */}
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={position}
            zoom={15}
            onClick={onMapClick}
            options={{
              disableDefaultUI: true,
              zoomControl: true,
              streetViewControl: false
            }}
          >
            <Marker position={position} />
          </GoogleMap>

        </div>

        {addressText && (
          <div style={{ fontSize: '13px', color: '#666', marginBottom: '16px', background: '#f5f5f5', padding: '8px', borderRadius: '6px', marginTop: '16px' }}>
            <strong>Ubicación detectada:</strong> {addressText}
          </div>
        )}

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