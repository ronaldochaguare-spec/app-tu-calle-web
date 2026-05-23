import React from 'react';
import { auth, logout } from '../../firebase';
import Navbar from '../../components/Navbar/Navbar';
import BannerCarousel from '../../components/BannerCarousel/BannerCarousel';
import './Home.css';
import Footer from '../../components/Footer/Footer';
import StoreList from '../../components/StoreList/StoreList';
import PopularDishes from '../../components/PopularDishes/PopularDishes';

const Home = () => {
  const user = auth.currentUser;

  return (
    <div className="home-container" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      {/* 1. Navegación Principal Dinámica */}
      <Navbar user={user} logout={logout} />

      <main className="home-main">

        {/* 2. Banner de Promociones (Center Mode) */}

      <BannerCarousel />

      <StoreList />
      <PopularDishes />
      </main>
      <Footer />
    </div>
  );
};

export default Home;