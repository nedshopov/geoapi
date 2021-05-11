import L from 'leaflet';
import {useMap} from 'react-leaflet';
import {useEffect} from 'react';
import 'leaflet-gpx';

const Track = () => {
    var map = useMap();

    var gpx = test;

    useEffect(() => {
        let track = new L.GPX(gpx, { async: true }).on('loaded', function (e) {
            console.log(e);
    
            map.fitBounds(e.target.getBounds());
        }).addTo(map);
    
        console.log(track);
    }, [])



    return (
        <div>
            test
        </div>
    )
}

export default Track

