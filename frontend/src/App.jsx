import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import './App.css'
import NavbarComponent from './components/NavbarComponent'
import { useDispatch, useSelector } from 'react-redux'
import Modal from './components/Modal'
import RequestContactForm from './components/RequestContactForm'

function App() {
  const showContactForm = useSelector((state) => state.showContactForm.value)


  return (
    <>
    <NavbarComponent />
    <Outlet />
    {showContactForm &&
      <Modal>
        <RequestContactForm/>
      </Modal>
    }
    </>
  )
}

export default App
