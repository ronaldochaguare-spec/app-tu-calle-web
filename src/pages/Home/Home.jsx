import React from 'react'
import './Home.css' // Importamos los estilos limpios
import { logout } from '../../firebase' 

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Home — próximamente</h1>
      
      <button className="btn-logout" onClick={logout}>
        Cerrar sesión
      </button>
    </div>
  )
}

export default Home