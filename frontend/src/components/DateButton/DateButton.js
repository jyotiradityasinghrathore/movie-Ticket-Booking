import React from 'react'
import './DateButton.css'

const DateButton = ({date, selected}) => {


    const dateButtonClasses = selected ? 'date-button-selected' : 'date-button';
    
    return (
        <div className={dateButtonClasses}> 
            <div className='date'>
                {date.date}
            </div>
            <div className='day'>
                {date.day}
            </div>
        </div>
    )
}

export default DateButton
