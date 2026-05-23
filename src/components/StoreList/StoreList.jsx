import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase'; 
import './StoreList.css';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 👇 1. Referencia para controlar el scroll del carrusel
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tiendas'));
        const storesData = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          storesData.push({
            id: doc.id,
            nombre: data.nombre,
            calificacion: data.calificacion,
            horario: data.horario, 
            direccion: data.direccion?.texto || 'Ubicación no especificada',
            portadaUrl: data.portadaUrl,
            etiquetas: data.etiquetas || []
          });
        });

        setStores(storesData);
      } catch (error) {
        console.error("Error obteniendo las tiendas: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  // 👇 2. Funciones para mover el carrusel a la izquierda y derecha
  const scrollLeft = () => {
    if (carouselRef.current) {
      // Desplaza aproximadamente el ancho de una tarjeta + el espacio (gap)
      carouselRef.current.scrollBy({ left: -324, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 324, behavior: 'smooth' });
    }
  };

  if (loading) {
    return <div className="loading-stores">Cargando restaurantes...</div>;
  }

  return (
    <div className="store-list-section">
      <div className="store-list-header">
        <h2>Restaurantes cerca a ti</h2>
        
        {/* 👇 3. Controles del carrusel (Flechas) */}
        <div className="store-carousel-controls">
          <button className="control-btn" onClick={scrollLeft}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button className="control-btn" onClick={scrollRight}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>

      {/* 👇 4. Contenedor track con el scroll horizontal */}
      <div className="store-carousel-track" ref={carouselRef}>
        {stores.map((store) => (
          <div className="store-card" key={store.id}>
            
            {/* Imagen y Corazón (Intactos) */}
            <div className="store-image-container">
              <img src={store.portadaUrl} alt={store.nombre} className="store-image" />
              <button className="heart-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>

            {/* Información de la tienda (Intacta) */}
            <div className="store-info">
              <div className="store-title-row">
                <h3 className="store-name">{store.nombre}</h3>
                <span className="store-rating">{store.calificacion}</span>
              </div>

              <div className="store-details">
                <div className="detail-row">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#db2c2c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path><circle cx="12" cy="9" r="2.5"></circle></svg>
                  <span>{store.direccion}</span>
                </div>
                <div className="detail-row">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#db2c2c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <span>{store.horario}</span>
                </div>
              </div>

              {/* Etiquetas Rojas (Intactas) */}
              <div className="store-tags">
                {store.etiquetas.map((tag, index) => (
                  <span key={index} className="store-tag">{tag}</span>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreList;