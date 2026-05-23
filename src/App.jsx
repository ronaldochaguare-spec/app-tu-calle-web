import React, { useEffect } from 'react'
import Home from './pages/Home/Home'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { ToastContainer } from 'react-toastify';
import './styles/global.css';

const App = () => {
  const navigate = useNavigate();

  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, async (user)=>{
      if(user){
        console.log("Logged In");
        
        if (window.location.pathname === '/') {
          navigate('/Home', { replace: true });
        }
      }else{
        console.log("Logged Out");
        navigate('/', { replace: true });
      }
    })
    return () => unsubscribe();
  }, [navigate]); 
  return (
    <> 
      <ToastContainer theme='dark'/>
      <Routes>
        <Route path='/'  element={<Login/>}/>
        <Route path='/Home'  element={<Home/>}/>
        <Route path='/perfil' element={<UserProfile/>}/> 
      </Routes>
    </>
  )
}

export default App