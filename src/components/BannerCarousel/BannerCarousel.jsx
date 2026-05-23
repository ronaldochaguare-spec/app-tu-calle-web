import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase'; 
import './BannerCarousel.css';

// Tu imagen local
import bannerImg from '../../assets/banner-burger.jpg'; 

const BannerCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. Obtener imágenes de Firebase
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const q = query(collection(db, 'banners_home'), where('activo', '==', true));
        const querySnapshot = await getDocs(q);
        
        const fetchedBanners = [];
        querySnapshot.forEach((doc) => {
          fetchedBanners.push({
            id: doc.id,
            img: doc.data().imageUrl,
            alt: `Banner Promoción ${doc.id}`
          });
        });

        const localBanner = { id: 'local_burger', img: bannerImg, alt: 'Promo Hamburguesa Local' };
        setBanners([localBanner, ...fetchedBanners]);
      } catch (error) {
        console.error("Error obteniendo los banners: ", error);
        setBanners([{ id: 'local_burger', img: bannerImg, alt: 'Promo Hamburguesa Local' }]);
      }
    };
    fetchBanners();
  }, []);

  // 2. Efecto de Auto-Play (Se mueve cada 4 segundos)
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); 

    return () => clearInterval(interval); 
  }, [banners.length]);

  // 3. Botones manuales
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex === banners.length - 1 ? 0 : prevIndex + 1);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex === 0 ? banners.length - 1 : prevIndex - 1);
  };

  return (
    <div className="carousel-container">
      <div className="carousel-viewport">
        <div 
          className="carousel-track" 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner) => (
            <div key={banner.id} className="carousel-slide">
              <img src={banner.img} alt={banner.alt} className="banner-image" />
            </div>
          ))}
        </div>
      </div>

      {/* Solo mostramos controles si hay más de 1 imagen */}
      {banners.length > 1 && (
        <>
          <button className="carousel-btn prev-btn" onClick={prevSlide}>❮</button>
          <button className="carousel-btn next-btn" onClick={nextSlide}>❯</button>
          
          <div className="carousel-indicators">
            {banners.map((_, index) => (
              <span 
                key={index} 
                className={`dot ${currentIndex === index ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              ></span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BannerCarousel;