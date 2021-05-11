// LIBRARIES
import { useEffect, useState } from 'react';
import appwrite from '../../config/appwrite';
import axios from 'axios';

// DATA
import data from '../../data/places.json'

// SERVICES
import mapServices from '../../services/mapServices';

// CSS

// COMPONENTS
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import CurrentLocationMarker from './CurrentLocationMarker/CurrentLocationMarker';

const defaultLat = 42.765833;
const defaultLng = 25.238611;

function Map() {
    const [fetchedPlaces, setFetchedPlaces] = useState([]);


    useEffect(() => {
        // let login = appwrite.account.createSession('me@example.com', 'password');

        // login.then(function (response) {
        //   console.log(response); // Success
        // }, function (error) {
        //   console.log(error); // Failure
        // });

        // data.forEach(x => {
        //   let create = appwrite.database.createDocument(process.env.REACT_APP_APPWRITE_COLLECTION_KEY, x, ['*'], ['*']);

        //   create.then(function (response) {
        //     console.log(response); // Success
        //   }, function (error) {
        //     console.log(error); // Failure
        //   });
        // })

        // appwrite.database.listDocuments(process.env.REACT_APP_APPWRITE_COLLECTION_KEY, [], 100)
        //     .then((places) => {
        //         setFetchedPlaces(places.documents);
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     });

        axios
            .get('https://cors-anywhere.herokuapp.com/https://nedshopov.com/geoapi/objects/all')
            .then(res => {
                console.log(res.data);
            })
            .catch(err => console.log(err))

    }, [])

    return (
        <MapContainer center={[defaultLat, defaultLng]} zoom={8} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {fetchedPlaces.map((place) => {
                let { $id, name, category, lat, lng } = place;

                let icon = mapServices.getMarkerIcon(category);

                return (
                    <Marker key={$id} position={[lat, lng]} icon={icon}>
                        <Popup>
                            {name}
                        </Popup>
                    </Marker>
                )

            })}

            <CurrentLocationMarker />

        </MapContainer>
    );
}

export default Map;
