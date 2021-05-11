import { Marker, Popup } from 'react-leaflet';
import { useEffect } from 'react';

import useGeolocation from '../../../hooks/useGeolocation'

function CurrentLocationMarker({ getCurrentLocation }) {
    const currentLocation = useGeolocation();

    useEffect(() => {
        getCurrentLocation(currentLocation);
    }, [currentLocation])

    return currentLocation === null ? null : (
        <Marker position={currentLocation}>
            <Popup>You are here</Popup>
        </Marker>
    )
}

export default CurrentLocationMarker