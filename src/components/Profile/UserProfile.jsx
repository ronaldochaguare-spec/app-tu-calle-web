import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar'; 
import './UserProfile.css';
import { auth, logout, db } from '../../firebase'; 
import { doc, getDoc, updateDoc } from "firebase/firestore";

// --- ICONOS ---
const PencilIcon = ({ onClick }) => (
  <svg 
    onClick={onClick} 
    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    style={{cursor: 'pointer'}}
  >
    <path d="M12 20h9"></path>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </svg>
);

const CheckIcon = ({ onClick }) => (
  <svg 
    onClick={onClick}
    width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{cursor: 'pointer', marginLeft: '8px'}}
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const CloseIcon = ({ onClick }) => (
  <svg 
    onClick={onClick}
    width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{cursor: 'pointer', marginLeft: '8px'}}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);


const DefaultIllustratedAvatar = ({ size = 40, color = "#a0c4ff" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill={color}/> 
    <circle cx="50" cy="30" r="12" stroke="white" strokeWidth="5" fill="none"/> 
    <path d="M25 70C25 55 35 45 50 45C65 45 75 55 75 70" stroke="white" strokeWidth="5" fill="none"/> 
    <rect x="20" y="78" width="60" height="6" rx="3" fill="white"/> 
    <rect x="30" y="87" width="40" height="6" rx="3" fill="white"/> 
  </svg>
);

const UserProfile = () => {
  const user = auth.currentUser;

  const [userData, setUserData] = useState({
    nombre: "Cargando...",
    email: "Cargando...",
    rol: "-",
    telefono: "-",
    fechaNacimiento: "-",
    dni: "-"
  });

  const [loading, setLoading] = useState(true);

  
  const [editingField, setEditingField] = useState(null); // Qué campo se está editando (ej: 'nombre', 'telefono')
  const [editValue, setEditValue] = useState("");         // El valor temporal que el usuario escribe
  const [isSaving, setIsSaving] = useState(false);        // Para mostrar que está guardando

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "usuarios", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const dataFirestore = userDocSnap.data();
            
            setUserData({
              nombre: dataFirestore.nombre || "Usuario sin nombre",
              email: dataFirestore.email || user.email,
              rol: dataFirestore.rol || "USUARIO",
              telefono: dataFirestore.telefono || "-",
              fechaNacimiento: dataFirestore.fechaNacimiento || "-", 
              dni: dataFirestore.dni || "-"
            });
          }
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
        } finally {
          setLoading(false); 
        }
      }
    };

    fetchUserData();
  }, [user]);

  //  --- FUNCIONES DE EDICIÓN --- 
  const handleEditClick = (fieldKey, currentValue) => {
    
    setEditValue(currentValue === "-" ? "" : currentValue);
    setEditingField(fieldKey);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  const handleSaveEdit = async () => {
    if (!user || !editingField) return;
    
    setIsSaving(true);
    try {
      const userDocRef = doc(db, "usuarios", user.uid);
      
      
      const updateData = { [editingField]: editValue };
      
      
      await updateDoc(userDocRef, updateData);
      
      
      setUserData(prev => ({ ...prev, [editingField]: editValue || "-" }));
      
      
      setEditingField(null);
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      alert("Hubo un error al actualizar los datos.");
    } finally {
      setIsSaving(false);
    }
  };

  // Función auxiliar para renderizar cada fila
  const renderField = (label, fieldKey, isEditable = true) => {
    const isCurrentlyEditing = editingField === fieldKey;

    return (
      <div className="field-group">
        <label>{label}</label>
        <div className={`field-value ${isEditable && !isCurrentlyEditing ? 'editable' : ''}`}>
          
         
          {isCurrentlyEditing ? (
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '10px' }}>
              <input 
                type="text" 
                value={editValue} 
                onChange={(e) => setEditValue(e.target.value)}
                autoFocus
                style={{
                  flex: 1, padding: '4px 8px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px', outline: 'none'
                }}
              />
              {isSaving ? (
                <span style={{fontSize: '12px', color: '#666'}}>...</span>
              ) : (
                <>
                  <CheckIcon onClick={handleSaveEdit} />
                  <CloseIcon onClick={handleCancelEdit} />
                </>
              )}
            </div>
          ) : (
            
            <>
              <span>{userData[fieldKey]}</span>
              {isEditable && <PencilIcon onClick={() => handleEditClick(fieldKey, userData[fieldKey])} />}
            </>
          )}

        </div>
      </div>
    );
  };

  const displayNombre = userData.nombre !== "Cargando..." ? userData.nombre : (user?.displayName || "Usuario");
  const nombreCorto = displayNombre.split(' ').slice(0, 2).join(' ');

  return (
    <div className="page-wrapper"> 
      
      <Navbar user={user} logout={logout} />

      <div className="profile-layout">
        <div className="profile-container">
          
          <aside className="profile-sidebar">
            <div className="sidebar-header">
              
              <div className="avatar-circle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Perfil" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <DefaultIllustratedAvatar size={50} color="#a0c4ff" /> 
                )}
              </div>
              
              <div className="sidebar-user-info">
                <span className="profile-label">Mi perfil</span>
                <h2 className="profile-name">{loading ? "..." : nombreCorto}</h2>
              </div>
            </div>

            <div className="sidebar-stats-box">
              <div className="stat-row">
                <strong>102</strong>
                <span>seguidores</span>
              </div>
              <div className="stat-row">
                <strong>6</strong>
                <span>publicaciones</span>
              </div>
              <div className="stat-row">
                <strong>1 año</strong>
                <span>antigüedad</span>
              </div>
            </div>

            <nav className="sidebar-menu">
              <ul>
                <li className="active">Información de cuenta</li>
                <li>Ajustes de cuenta</li>
                <li>Centro de notificaciones</li>
                <li>Centro de ayuda</li>
              </ul>
            </nav>
          </aside>

          <main className="profile-main-content">
            <div className="profile-card">
              <h3 className="card-title">Información de tu cuenta</h3>

              <div className="fields-container">
                
              
                {/* Nombre: Editable */}
                {renderField("Nombre(s) y Apellidos", "nombre", true)}
                
                {/* Rol: NO Editable */}
                {renderField("Rol de usuario", "rol", false)}
                
                {/* Email: NO Editable */}
                {renderField("Correo Electrónico", "email", false)}
                
                {/* Teléfono: Editable */}
                {renderField("Celular", "telefono", true)}
                
                {/* Fecha Nacimiento: Editable */}
                {renderField("Fecha de nacimiento", "fechaNacimiento", true)}
                
                {/* DNI: Editable */}
                {renderField("Número de identidad (DNI)", "dni", true)}

              </div>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;