import React from 'react';
import "./TimeButton.css"

const TimeButton = ({time, selected}) => {
  
  const timeButtonClasses = selected ? 'time-button-selected' : 'time-button';
  
  return (
    <div className={timeButtonClasses}>
        {time}
    </div>
  )
}

export default TimeButton
