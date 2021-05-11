import { Marker, Popup } from 'react-leaflet';

import useGeolocation from '../../../hooks/useGeolocation'

function CurrentLocationMarker() {
    const currentPosition = useGeolocation();

    return currentPosition === null ? null : (
        <Marker position={currentPosition}>
            <Popup>You are here</Popup>
        </Marker>
    )
}

export default CurrentLocationMarker