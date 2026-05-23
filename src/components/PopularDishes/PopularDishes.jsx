import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase'; 
import './PopularDishes.css';

const PopularDishes = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'platos'));
        const dishesData = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Cálculo del descuento: ((Original - Descuento) / Original) * 100
          const discount = data.precioOriginal && data.precioDescuento 
            ? Math.round(((data.precioOriginal - data.precioDescuento) / data.precioOriginal) * 100)
            : 0;

          dishesData.push({
            id: doc.id,
            nombre: data.nombre,
            calificacion: data.calificacion,
            idTienda: data.idTienda.replace('si_', '').replace('_', ' '), // Limpieza rápida del ID
            imageUrl: data.imagenUrl,
            precioDescuento: data.precioDescuento,
            precioOriginal: data.precioOriginal,
            descuentoPorcentaje: discount
          });
        });

        setDishes(dishesData);
      } catch (error) {
        console.error("Error al obtener platos: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  
  const scroll = (direction) => {
    if (carouselRef.current) {
      
      const scrollAmount = direction === 'left' ? -324 : 324;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) return null;

  return (
    <div className="popular-section">
      <div className="popular-header">
        <h2>Populares ahora</h2>
        <div className="popular-controls">
          <button onClick={() => scroll('left')} className="p-control-btn">❮</button>
          <button onClick={() => scroll('right')} className="p-control-btn">❯</button>
        </div>
      </div>

      <div className="popular-track" ref={carouselRef}>
        {dishes.map((dish) => (
          <div className="dish-card" key={dish.id}>
            <div className="dish-image-box">
              <img src={dish.imageUrl} alt={dish.nombre} className="dish-img" />
              <button className="dish-heart">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </button>
            </div>
            
            <div className="dish-info">
              <div className="dish-name-row">
                <h3>{dish.nombre}</h3>
                <span className="dish-rating">{dish.calificacion}</span>
              </div>
              <p className="dish-store">{dish.idTienda}</p>
              
              <div className="dish-price-row">
                {dish.descuentoPorcentaje > 0 && (
                  <span className="dish-badge">-{dish.descuentoPorcentaje}%</span>
                )}
                <div className="prices">
                  {dish.precioOriginal && <span className="old-price">S/ {dish.precioOriginal.toFixed(2)}</span>}
                  <span className="current-price">S/ {dish.precioDescuento.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularDishes;