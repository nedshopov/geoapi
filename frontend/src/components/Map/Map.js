// LIBRARIES
import { useEffect, useState } from 'react';
import axios from 'axios';

// SERVICES
import mapServices from '../../services/mapServices';

// CSS
import style from './Map.module.css'

// COMPONENTS
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import CurrentLocationMarker from './CurrentLocationMarker/CurrentLocationMarker';

const defaultLat = 42.765833;
const defaultLng = 25.238611;

function Map() {
    const [fetchedPlaces, setFetchedPlaces] = useState([]);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [radius, setRadius] = useState(0)

    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const baseURL = 'https://nedshopov.com/geoapi/';

    const getCurrentLocationHandler = (location) => {
        setCurrentLocation(location);
    }

    useEffect(() => {
        if (currentLocation !== null) {
            axios
                .get(proxy + baseURL + `getInRadius`, {
                    params: {
                        lat: currentLocation.lat,
                        lng: currentLocation.lng,
                        radius
                    }
                })
                .then(res => {
                    setFetchedPlaces(res.data);
                })
                .catch(err => console.log(err))
        }

    }, [currentLocation, radius])

    return (

        <>
            <input
                className={style.radiusInput}
                type="range"
                min={0}
                max={50}
                placeholder="Set search radius"
                value={radius}
                name="radius"
                id="radius"
                onChange={(e) => {
                    setRadius(e.target.value);
                }}
            />
            <span>{radius}</span>
            <MapContainer center={[defaultLat, defaultLng]} zoom={8} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {fetchedPlaces.map((place) => {
                    let { Id, name, categories, lat, lng } = place;

                    let icon = mapServices.getMarkerIcon();

                    return (
                        <Marker
                            key={Id}
                            position={[lat, lng]}
                            categories={categories}
                            icon={icon}>
                            <Popup>
                                {name}
                            </Popup>
                        </Marker>
                    )

                })}

                <CurrentLocationMarker getCurrentLocation={getCurrentLocationHandler} />



            </MapContainer>

        </>
    );
}

export default Map;
