import React, { useEffect, useState } from 'react'
import {useDispatch} from "react-redux"
import './App.css'
import authService from "./appwrite/auth"
import { login, logout } from './store/authSlice'
import Header from "./components/Header/Header"
import Footer from "./components/Footer/Footer"
import { Outlet } from 'react-router-dom'

// initialize git in my project

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch();

  useEffect( () => {
    authService.getCurrentUser()
    .then( (userData) => {
      if (userData) {
        dispatch(login({userData}))
      } else {
        dispatch(logout())
      }
    })
    .finally( () => setLoading(false))
  }, [])

  return !loading ? (
    <div className='min-h-screen bg-gray-600 fl flex-wrap content-between'>
      <div className='w-full'>
        <Header/>
        <main>
          TODO : <Outlet/>
        </main>
        <Footer/>
      </div>
    </div>
  ) : null
}

export default App
