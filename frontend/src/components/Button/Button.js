import React from 'react'
import './Button.css'

const Button = ({text}) => {
  return (
    <div className='btn-container'>
      <button className='btn'>
        {text}
      </button>
    </div>
  )
}

export default Button
