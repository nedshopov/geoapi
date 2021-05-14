import axios from 'axios';
import categoriesList from '../config/categories';

const proxy = 'https://cors-anywhere.herokuapp.com/';
const baseURL = 'https://nedshopov.com/geoapi/';

function getAll() {
    return axios
        .get(proxy + baseURL + `objects/all`);
}

function getInRadius(categories, lat, lng, radius) {
    categories = categories.join(`,`);

    return axios
        .get(proxy + baseURL + `filter`, {
            params: {
                categories,
                lat,
                lng,
                radius
            }
        })
}

const funcs = {
    getAll,
    getInRadius
}

export default funcs;