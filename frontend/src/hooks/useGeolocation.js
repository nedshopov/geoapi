import { useState, useEffect } from 'react';
import {useMap} from 'react-leaflet';

const useGeolocation = () => {
    const [currentPosition, setCurrentPosition] = useState(null)

    const map = useMap();

    useEffect(() => {
      map.locate().on("locationfound", function (e) {
        setCurrentPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      });
      return function cleanup() {
        map.stopLocate();
      };
    }, [map]);

    return currentPosition === null
        ? null
        : currentPosition
}

export default useGeolocation
