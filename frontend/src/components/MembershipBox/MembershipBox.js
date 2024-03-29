import React from 'react'
import "./MembershipBox.css"
import Button from '../Button/Button';
import { useNavigate } from 'react-router-dom';

const MembershipBox = ({text}) => {
  const navigate = useNavigate();

  const handleGetPremiumClick = () => {
    navigate('/get-premium');
  };

  return (
    <div className='membership-box'>
      <p>{text}</p>
      <div className='membership-box-btn'>
        <div onClick={handleGetPremiumClick}>
          <Button text={'Get Premium'} />
        </div>
      </div>
    </div>
  )
}

export default MembershipBox;
