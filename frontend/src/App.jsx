import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import './App.css'
import NavbarComponent from './components/NavbarComponent'


function App() {


  return (
    <>
    <NavbarComponent />
    <Outlet />
    </>
  )
}

export default App
