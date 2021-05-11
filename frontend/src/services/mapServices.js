import L from 'leaflet'

function getMarkerIcon(category) {
    let myIcon = L.icon({
        iconUrl: 'map_pin_icon.svg.png',
        // iconSize: [38, 95],
        iconAnchor: [15, 42],
        popupAnchor: [0, -42],
    });

    return myIcon;
}

const funcs = {
    getMarkerIcon
}

export default funcs;