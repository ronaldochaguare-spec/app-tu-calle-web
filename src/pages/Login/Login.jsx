import React, { useState } from 'react'
import './Login.css'
import fondoImg from '../../assets/fondoLogin.webp'
import { toast } from 'react-toastify'
import { login, loginWithGoogle, signup } from '../../firebase'
import loginSpinner from '../../assets/spinner.gif'


const GmailIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path d="M2.25 19.5c0 .825.675 1.5 1.5 1.5h3.75V12L2.25 8.25v11.25z" fill="#4285F4"/>
    <path d="M16.5 21h3.75c.825 0 1.5-.675 1.5-1.5V8.25L16.5 12v9z" fill="#34A853"/>
    <path d="M16.5 4.875v7.125l5.25-3.75V6c0-1.125-1.35-1.65-2.1-.975L16.5 4.875z" fill="#FBBC05"/>
    <path d="M7.5 12V4.875L4.35 2.55C3.6 1.875 2.25 2.4 2.25 3.525v4.725L7.5 12z" fill="#EA4335"/>
    <path d="M7.5 12V4.875L12 8.25l4.5-3.375V12l-4.5 3.375L7.5 12z" fill="#C5221F"/>
  </svg>
)

const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" />
  </svg>
)

const BackArrowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
)

const MapPinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#db2c2c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
)


const Login = () => {
  const [view, setView] = useState('options') 
  
  // ESTADOS GENERALES
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // ESTADOS PARA USUARIO
  const [userName, setUserName] = useState('')
  const [userPhone, setUserPhone] = useState('')

  // ESTADOS PARA TIENDA
  const [storeName, setStoreName] = useState('')
  const [storePhone, setStorePhone] = useState('')
  const [storeAddress, setStoreAddress] = useState('')
  const [storeHours, setStoreHours] = useState('')

  const handleIngresar = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error("Por favor, llena todos los campos")
      return
    }

    setLoading(true)
    

    await login(email, password)
    
    setLoading(false)
  }
  const handleGoogleLogin = async () => {
    setLoading(true)
    await loginWithGoogle()
    setLoading(false)
  }

  // 👇 Función para registrar un USUARIO normal
  const handleRegisterUser = async (e) => {
    e.preventDefault()
    
    // Validación básica
    if (!userName || !email || !password || !userPhone) {
      toast.error("Por favor, llena todos los campos obligatorios")
      return
    }

    setLoading(true)
    await signup(userName, email, password)
    setLoading(false)
  }

  // 👇 Función para registrar una TIENDA
  const handleRegisterStore = async (e) => {
    e.preventDefault()
    
    // Validación básica
    if (!storeName || !email || !password || !storePhone || !storeAddress || !storeHours) {
      toast.error("Por favor, llena todos los campos de la tienda")
      return
    }

    setLoading(true)
    await signup(storeName, email, password)
    setLoading(false)
  }

  return (
    <div className="login">

      {/* ── LEFT: HERO PANEL ── */}
      <div className="login-hero">
        <img
          src={fondoImg}
          alt="Tu calle"
          className="login-hero-img"
        />
        <div className="login-hero-overlay" />
        <div className="login-logo-hero">
          Tu<span>Calle</span>
        </div>
        <div className="login-hero-content">
          <h2>Descubre un<br /><em>nuevo mundo</em></h2>
          <p>más cerca de ti</p>
        </div>
      </div>

      {/* ── RIGHT: FORM PANEL ── */}
      <div className="login-panel">

        {/*  NUEVO SPINNER EN EL PANEL DERECHO  */}
        {loading && (
          <div className="login-spinner-overlay">
            <img src={loginSpinner} alt="Cargando..." />
          </div>
        )}

        <div className="login-form">
          
          {/* VISTA 1 */}
          {view === 'options' && (
            <>
              <h1>Bienvenido</h1>
              <p className="subtitle">Inicia sesión para continuar</p>

              <button className="btn-email" onClick={() => setView('emailForm')}>
                <EmailIcon />
                Continua con email
              </button>

              <div className="login-divider">
                <span>o</span>
              </div>

              <button className="btn-google" onClick={handleGoogleLogin}>
                <GmailIcon />
                Continua con gmail
              </button>
            </>
          )}

          {/* VISTA 2: FORMULARIO DETALLADO */}
          {view === 'emailForm' && (
            <div className="email-login-container">
              <button className="btn-back" onClick={() => setView('options')}>
                <BackArrowIcon />
              </button>

              <h1 className="left-title">Inicia sesión</h1>

              <div className="input-group">
                <label>Email<span>*</span></label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Contraseña<span>*</span></label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <a className="forgot-password">Olvidé mi contraseña</a>

              <button className="btn-ingresar" onClick={handleIngresar}>
                Ingresar
              </button>

              <div className="login-divider">
                <span style={{textTransform: 'none'}}>¿No tienes una cuenta?</span>
              </div>

              <button className="btn-registrarse" onClick={() => setView('registerOptions')}>
                Registrarse
              </button>
            </div>
          )}

          {/* VISTA 3: OPCIONES DE REGISTRO */}
          {view === 'registerOptions' && (
            <div className="register-options-container">
              
              <button className="btn-back" onClick={() => setView('emailForm')}>
                <BackArrowIcon />
              </button>

              <div className="register-content">
                <h1 className="register-title">Queremos<br />conocerte 👇</h1>

                <button className="btn-role" onClick={() => setView('registerUser')}>
                  Soy Usuario
                </button>
                <button className="btn-role" onClick={() => setView('registerStore')}>
                  Soy Tienda
                </button>
              </div>

              <a className="admin-link">Soy socio administrativo</a>
              
            </div>
          )}

         {/* VISTA 4: REGISTRO USUARIO */}
          {view === 'registerUser' && (
            <div className="email-login-container">
              {/* ... (código del botón de regresar y título) ... */}

              <button className="btn-back" onClick={() => setView('registerOptions')}>
                <BackArrowIcon />
              </button>

              <h1 className="left-title">Regístrate</h1>

              <div className="input-group">
                <label>Nombres y Apellidos<span>*</span></label>
                <input 
                  type="text" 
                  value={userName} 
                  onChange={(e) => setUserName(e.target.value)} 
                />
              </div>
              <div className="input-group">
                <label>Email<span>*</span></label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
              <div className="input-group">
                <label>Contraseña<span>*</span></label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>
              <div className="input-group">
                <label>Celular<span>*</span></label>
                <input 
                  type="tel" 
                  value={userPhone} 
                  onChange={(e) => setUserPhone(e.target.value)} 
                />
              </div>

              {/* ... (código de los checkboxes) ... */}

              {/* Conectamos la función al botón 👇 */}
              <button className="btn-ingresar" onClick={handleRegisterUser}>
                REGISTRARSE
              </button>
            </div>
          )}

         {/* VISTA 5: REGISTRO TIENDA */}
          {view === 'registerStore' && (
            <div className="email-login-container">
              {/* ... (código del botón de regresar y título) ... */}
              <button className="btn-back" onClick={() => setView('registerOptions')}>
                <BackArrowIcon />
              </button>

              <h1 className="left-title">Regístrate</h1>
              <div className="input-group">
                <label>Nombre del local<span>*</span></label>
                <input 
                  type="text" 
                  value={storeName} 
                  onChange={(e) => setStoreName(e.target.value)} 
                />
              </div>
              <div className="input-group">
                <label>Email<span>*</span></label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
              <div className="input-group">
                <label>Contraseña<span>*</span></label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>
              <div className="input-group">
                <label>Número de contacto<span>*</span></label>
                <input 
                  type="tel" 
                  value={storePhone} 
                  onChange={(e) => setStorePhone(e.target.value)} 
                />
              </div>
              <div className="input-group">
                <label>Dirección<span>*</span></label>
                <div className="input-with-icon">
                  <input 
                    type="text" 
                    value={storeAddress} 
                    onChange={(e) => setStoreAddress(e.target.value)} 
                  />
                  <MapPinIcon />
                </div>
              </div>
              <div className="input-group">
                <label>Horario de atención<span>*</span></label>
                <input 
                  type="text" 
                  value={storeHours} 
                  onChange={(e) => setStoreHours(e.target.value)} 
                />
              </div>

              {/* ... (código de los checkboxes) ... */}

              {/* Conectamos la función al botón 👇 */}
              <button className="btn-ingresar" onClick={handleRegisterStore}>
                REGISTRARSE
              </button>
            </div>
          )}

          <p className="login-terms">
            Al iniciar sesión estás de acuerdo con nuestros{' '}
            <a>Términos y Condiciones</a> y nuestra{' '}
            <a>Política de Privacidad</a>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Login