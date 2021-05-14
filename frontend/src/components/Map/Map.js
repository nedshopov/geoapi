// LIBRARIES
import { useEffect, useState, useCallback } from 'react';
import debounce from 'lodash/debounce';

// CSS
import style from './Map.module.css'

// SERVICES
import mapServices from '../../services/mapServices';
import fetchServices from '../../services/fetchServices';

// COMPONENTS
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import CurrentLocationMarker from './CurrentLocationMarker/CurrentLocationMarker';
import Checkbox from './Checkbox/Checkbox';

// CONFIGS
import categoriesList from '../../config/categories';


const defaultLat = 42.765833;
const defaultLng = 25.238611;

function Map() {
    const [fetchedPlaces, setFetchedPlaces] = useState([]); // Set places after fetching
    const [currentLocation, setCurrentLocation] = useState(null); // Set current location if allowed by user
    const [radius, setRadius] = useState(1); // Set the raidus
    const [categories, setCategories] = useState([]); // Set the categories to fetch
    const [finalRadius, setFinalRadius] = useState(1); // Set the debounced final radius to fetch


    const getCurrentLocationHandler = (location) => {
        setCurrentLocation(location);
    }

    const getCategoriesHandler = (checkboxCategory) => {
        setCategories(prevState => [...prevState, checkboxCategory])
    }

    const removeCategoriesHandler = (checkboxCategory) => {
        setCategories(prevState => prevState.filter(x => x !== checkboxCategory))
    }

    const updateRadiusHandler = useCallback(debounce((radius) => setFinalRadius(radius)
        , 1000), []);

    useEffect(() => {
        if (currentLocation !== null) {
            fetchServices.getInRadius(categories, currentLocation.lat, currentLocation.lng, finalRadius)
                .then(res => {
                    setFetchedPlaces(res.data);
                })
                .catch(err => console.log(err))
        }

    }, [currentLocation, finalRadius, categories])

    return (
        <>
            <div className={style.radiusInputContainer}>
                <input
                    className={style.radiusInput}
                    type="range"
                    min={1}
                    max={20}
                    value={radius}
                    name="radius"
                    id="radius"
                    onChange={(e) => {
                        setRadius(e.target.value)
                        updateRadiusHandler(e.target.value)
                    }}
                />
                <span>{`${radius} km`}</span>
            </div>

            <div className={style.checkboxesContainer}>
                {Object.entries(categoriesList).map(([category, categoryInfo]) => (
                    <Checkbox
                        key={category}
                        categoryInfo={categoryInfo}
                        category={category}
                        getCategoriesHandler={getCategoriesHandler}
                        removeCategoriesHandler={removeCategoriesHandler}
                    />
                ))}
            </div>

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

                <CurrentLocationMarker getCurrentLocation={getCurrentLocationHandler} radius={radius} />

            </MapContainer>

        </>
    );
}

export default Map;
