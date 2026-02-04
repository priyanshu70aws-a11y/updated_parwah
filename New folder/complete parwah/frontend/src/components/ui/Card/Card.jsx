import React from 'react';
import './Card.css';

const Card = ({ children, padding = 'md', hover = false, style }) => {
  return (
    <div 
      className={`card card-padding-${padding} ${hover ? 'card-hover' : ''}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default Card;