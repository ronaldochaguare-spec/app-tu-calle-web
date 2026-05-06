import React, { useState } from 'react'
import { auth, logout } from '../../firebase'
import './Home.css'

const UserIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
)

const Home = () => {
  const user = auth.currentUser;
  
  // 👇 Nuevo estado para saber si la foto de Google falló
  const [imageError, setImageError] = useState(false);

  return (
    <div className="home-container">
      <nav className="home-nav">
        <div className="user-profile">
          <div className="avatar-circle">
            {/* 👇 Verificamos si hay foto Y si no ha dado error */}
            {user?.photoURL && !imageError ? (
              <img 
                src={user.photoURL} 
                alt="Perfil" 
                className="avatar-img" 
                referrerPolicy="no-referrer" /* 🔥 La magia para que Google no bloquee la imagen */
                onError={() => setImageError(true)} /* Si se rompe, activamos el Plan B */
              />
            ) : (
              <UserIcon /> /* Nuestro Plan B: el icono del humano */
            )}
          </div>
          <span className="user-greeting">Hola, {user?.displayName || 'Ronaldo'}</span>
        </div>
        
        <button className="btn-logout" onClick={logout}>Salir</button>
      </nav>

      <main className="home-main">
        <h1>Home - Próximamente</h1>
      </main>
    </div>
  )
}

export default Home