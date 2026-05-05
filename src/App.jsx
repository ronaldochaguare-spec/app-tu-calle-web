import React, { useEffect } from 'react'
import Home from './pages/Home/Home'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { ToastContainer } from 'react-toastify';

const App = () => {
  const navigate = useNavigate();

  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, async (user)=>{
      if(user){
        console.log("Logged In");
        navigate('/Home', { replace: true }) 
      }else{
        console.log("Logged Out");
        navigate('/', { replace: true })
      }
    })
    return () => unsubscribe();
  },[])

  return (
    <> 
      <ToastContainer theme='dark'/>
      <Routes>
        <Route path='/'  element={<Login/>}/>
        <Route path='/Home'  element={<Home/>}/>
      </Routes>
    </>
  )
}

export default App