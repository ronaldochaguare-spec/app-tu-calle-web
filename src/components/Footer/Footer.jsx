import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Sección de Marca y Redes Sociales */}
        <div className="footer-header">
          <div className="footer-logo">
            Tu<span>Calle</span>
          </div>
          <div className="footer-icons">
            {/* Facebook */}
            <a href="#" className="social-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            {/* Instagram */}
            <a href="#" className="social-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            {/* Twitter / X */}
            <a href="#" className="social-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
            </a>
            {/* TikTok */}
            <a href="#" className="social-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12a4 4 0 1 0 4 4V0h4a5 5 0 0 0 5 5v4a9 9 0 0 1-5-5h-4v12a4 4 0 1 1-4-4Z"></path>
              </svg>
            </a>
          </div>
        </div>

        {/* Enlaces de interés adaptados a tu negocio */}
        <ul className="footer-links">
          <li>Sobre Nosotros</li>
          <li>Registra tu huarique</li>
          <li>Centro de Ayuda</li>
          <li>Trabaja con nosotros</li>
          <li>Términos y Condiciones</li>
          <li>Política de Privacidad</li>
          <li>Libro de Reclamaciones</li>
          <li>Preguntas Frecuentes</li>
        </ul>

        {/* Copyright automático (siempre mostrará el año actual) */}
        <p className="copyright-text">
          © {new Date().getFullYear()} App Tu Calle. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;