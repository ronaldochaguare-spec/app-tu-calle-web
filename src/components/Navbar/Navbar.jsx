import React, { useState, useEffect } from 'react'; 
import { db } from '../../firebase'; 
import { doc, getDoc } from 'firebase/firestore'; 
import './Navbar.css';
import { useNavigate } from 'react-router-dom';

const DefaultIllustratedAvatar = ({ size = 24, color = "#a0c4ff" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill={color}/> 
    <circle cx="50" cy="30" r="12" stroke="white" stroke-width="5" fill="none"/>
    <path d="M25 70C25 55 35 45 50 45C65 45 75 55 75 70" stroke="white" stroke-width="5" fill="none"/>
    <rect x="20" y="78" width="60" height="6" rx="3" fill="white"/>
    <rect x="30" y="87" width="40" height="6" rx="3" fill="white"/>
  </svg>
);

const Navbar = ({ user, logout }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  

  const [dbName, setDbName] = useState('');


  useEffect(() => {
    const fetchName = async () => {
      if (user) {
       
        if (user.displayName) {
          setDbName(user.displayName);
        } else {
          try {
            const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
            if (userDoc.exists()) {
              setDbName(userDoc.data().nombre);
            }
          } catch (error) {
            console.error("Error buscando nombre para el Navbar:", error);
          }
        }
      }
    };
    fetchName();
  }, [user]);

  
  const displayFullName = dbName || '...';
  const firstName = displayFullName.split(' ')[0];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* =========================================
          MENÚ LATERAL (DRAWER)
      ========================================= */}
      <div 
        className={`menu-overlay ${isMenuOpen ? 'open' : ''}`} 
        onClick={toggleMenu}
      ></div>

      <div className={`side-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="side-menu-header">
          <div className="navbar-logo">Tu<span>Calle</span></div>
          <button className="close-menu-btn" onClick={toggleMenu}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="side-menu-content">
          <div className="menu-item active">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span>Mural</span>
          </div>

          <div className="menu-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            <span>Ofertas del día</span>
          </div>

          <div className="menu-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span>Mis pedidos</span>
          </div>

          <div className="menu-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span>Favoritos</span>
          </div>

          <div className="menu-item" onClick={() => {
              toggleMenu();
              navigate('/perfil');
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Mi perfil</span>
          </div>
        </div>
      </div>


      {/* =========================================
          NAVBAR PRINCIPAL
      ========================================= */}
      <nav className="navbar-container">
        <div className="navbar-brand-section">
          <button className="icon-btn" onClick={toggleMenu}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          <div className="navbar-logo" style={{cursor: 'pointer'}} onClick={() => navigate('/Home')}>
            Tu<span>Calle</span>
          </div>
        </div>

        <div className="navbar-divider"></div>

        <div className="navbar-location">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#db2c2c">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span className="location-text">San Juan de Lurigancho</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#db2c2c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>

        <div className="navbar-divider"></div>

        <div className="navbar-search-wrapper">
          <div className="navbar-search">
            <svg className="search-left-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#db2c2c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
              <line x1="6" y1="1" x2="6" y2="4"></line>
              <line x1="10" y1="1" x2="10" y2="4"></line>
              <line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>
            
            <input 
              type="text" 
              placeholder="Comida, huariques, tiendas, productos..." 
              className="search-input"
            />
            
            <button className="search-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* =========================================
            ZONA DE PERFIL Y DESPLEGABLE
        ========================================= */}
        <div className="navbar-actions">
          <div className="profile-wrapper">
            
            <div className="user-profile" onClick={() => setIsProfileOpen(!isProfileOpen)}>
              
              {/* LÓGICA DE FOTO EN EL NAVBAR  */}
              <div className="navbar-avatar-wrapper" style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {user?.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="Perfil" 
                    className="navbar-avatar-img" 
                    referrerPolicy="no-referrer" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  
                  <DefaultIllustratedAvatar size={24} color="#a0c4ff" />
                )}
              </div>
              
              <span className="user-name">Hola, {firstName}</span>
              
              <svg className={`profile-arrow ${isProfileOpen ? 'open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>

            {isProfileOpen && (
              <>
                <div className="profile-dropdown-overlay" onClick={() => setIsProfileOpen(false)}></div>
                
                <div className="profile-dropdown">
                  <button 
                    className="dropdown-item" 
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate('/perfil'); 
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Mi perfil
                  </button>

                  <button className="dropdown-item logout-btn" onClick={logout}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Cerrar sesión
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;