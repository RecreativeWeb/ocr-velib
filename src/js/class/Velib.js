import {buildParam} from '../helper';

class Velib {

    constructor(data) {

        // Velib station properties to display
        this.propertyToDisplay = ['name', 'address', 'bike_stands', 'available_bikes', 'status'];

        // Use to translate string
        this.translation = {
            name: 'Nom',
            address: 'Adresse',
            bike_stands: 'Places disponibles',
            available_bikes: 'Vélos disponibles',
            status: 'Status',
            position: 'Coordonnées',
            id: 'id'
        };

        // Set the station properties
        this.station = data;
    }

    get position() {
        return this.station.position;
    }

    get name() {
        return this.station.name;
    }

    get address() {
        return this.station.address;
    }

    get id() {
        return this.station.id;
    }

    // Parse the data
    static parse(data) {
        let station = data.fields;
        station.id = data.recordid;
        station.position = {lat: data.fields.position[0], lng: data.fields.position[1]};
        return station;
    }

    // Get the API url
    static getUrl(type, id = '') {

        this.settings = {
            source: 'https://opendata.paris.fr/',
            request: {
                all: {
                    api: 'api/records/1.0/download/',
                    params: {
                        dataset: 'stations-velib-disponibilites-en-temps-reel',
                        format: 'json'
                    }
                },
                record: {
                    api: 'api/records/1.0/search/',
                    params: {
                        dataset: 'stations-velib-disponibilites-en-temps-reel',
                        q: 'recordid:' + id,
                        rows: '1'
                    }
                }
            },
        };

        const source = this.settings.source;
        const api = this.settings.request[type].api;
        const params = this.settings.request[type].params;

        return source + api + '?' + buildParam(params);
    }

    // Get the velib data stored in session storage
    static getData() {
        return JSON.parse(sessionStorage.getItem('velibData'));
    }

    // Set velib data in session storage
    static setData(velibData) {
        sessionStorage.setItem('velibData', velibData);
    }

    // Remove the velib data from session storage
    static removeData() {
        sessionStorage.removeItem('velibData');
    }

    // Check if a bike is available at the station
    isBikeAvailable() {
        return this.station.available_bikes > 0;
    }

    // Check if the station is open
    isStationOpen() {
        return this.station.status === 'OPEN';
    }

    // Check if the station passes the validation
    check() {
        return this.isStationOpen() && this.isBikeAvailable();
    }

    // Build form inputs for the station
    buildFormInputs() {
        let inputs = $('<div></div>').addClass('inputs');

        for (let [key, value] of Object.entries(this.station)) {
            $('<input/>').attr({type: 'hidden', name: key, value: JSON.stringify(value)}).appendTo(inputs);
        }

        return inputs;
    }

    // Get the translation for a text
    getTranslation(text) {
        return this.translation[text];
    }

    // Build a list of station's properties constraint by the propertyToDisplay
    buildPropertiesList() {

        let list = $('<ul></ul>');
        let prop = Object.assign({}, this.propertyToDisplay);

        for (let value of Object.values(prop)) {

            // Check if the property should be display
            if (!this.station.hasOwnProperty(value)) break;

            $('<li></li>').html(
                '<span class="label">' + this.getTranslation(value) + '</span>' +
                '<span class="tag">' + this.station[value] + '</span>'
            ).appendTo(list);
        }

        return list;
    }
}

export default Velib;