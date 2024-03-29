import React, { useState } from 'react';
import './PosterCard.css';

const PosterCard = ({ movie }) => {
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <div
      className={`card ${hovered ? 'hovered' : ''}`}
      key={movie._id}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img src={movie.picture} alt={movie.title} className='card' />
      <p>{movie.title}</p>

    </div>
  );
};

export default PosterCard;