import React from 'react'

function DefaultDisplay() {
  return (
    <div className='col-9 d-flex justify-content-center flex-column h-100'  >
        <img className='align-self-center' src='http://192.168.2.19:5000/images/logo-Photoroom.png' alt='logo' style={{ width: '50%', height: '50%', objectFit: 'cover' }} />
    </div>
  )
}

export default DefaultDisplay;