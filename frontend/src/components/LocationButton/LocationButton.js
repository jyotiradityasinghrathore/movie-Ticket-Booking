import React from 'react'
import './LocationButton.css'
import LocationIcon from '@mdi/react';
import { mdilMapMarker } from '@mdi/light-js';

const LocationButton = ({location, selected}) => {

  const locationButtonClasses = selected ? 'city-box-selected' : 'city-box';

  return (
    <div className={locationButtonClasses}>
        <div className='location'>
            <LocationIcon path={mdilMapMarker}
                title="User Profile"
                size={1}
                color="white"
            />
            {location}
        </div>
    </div>
  )
}

export default LocationButton;
