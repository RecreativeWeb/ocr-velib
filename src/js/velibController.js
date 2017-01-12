import Velib from './class/Velib';
import Maps from './class/Maps';
import {request} from './ajax';

export default function () {

    // Init the variables
    const body = $('body');
    const aside = $('#aside');
    const mapContainer = document.getElementById('map');
    const mapCenter = {lat: 48.8556753, lng: 2.352876944};
    const maps = new Maps(mapContainer, mapCenter);
    const map = maps.init();
    let velibData = Velib.getData();

    // Display the markers on the map
    function displayMarkers() {

        let markers = [];

        // Iterate through the response Json object
        velibData.forEach(station => {

            // Parse the data
            let data = Velib.parse(station);

            // Instance a new velib station
            let velib = new Velib(data);

            // Create a new marker
            let marker = maps.createMarker(velib.position, velib.check());

            // Add metadata to the marker
            marker.set('metadata', velib);

            // When a marker is clicked, we update the velib station info in the sidebar
            marker.addListener('click', function () {

                // Get the url
                let url = Velib.getUrl('record', marker.metadata.id);

                // Make an ajax call for the station
                request('GET', url).then(response => displayStation(response, this), response => console.log(response));
            });

            // Push the marker to the array
            markers.push(marker);
        });

        // Init the markers clusters and display them on the map
        new MarkerClusterer(map, markers, maps.clusterOptions);
    }

    // Request the velib stations if not in current session
    if (velibData === null) {

        // Make an ajax call to get all the velib stations
        request('GET', Velib.getUrl('all')).then(function (response) {

            // Store the velib data in the session storage
            Velib.setData(response);

            // Set the velibData
            velibData = JSON.parse(response);

            // Display the markers
            displayMarkers();

        }, response => console.log(response));
    }
    else {
        displayMarkers();
    }

    function displayStation(response, marker) {

        // Parse the data
        let data = Velib.parse(JSON.parse(response).records[0]);

        // Instance a new velib station
        let velib = new Velib(data);

        // Build the station's properties list anf form inputs
        let list = velib.buildPropertiesList();
        let inputs = velib.buildFormInputs();

        // Add the list and form inputs to the sidebar
        aside.children('ul:first').replaceWith(list);
        aside.find('div.inputs').replaceWith(inputs);

        // Add the sidebar class on body
        body.addClass('sidebar');

        // Refresh the map
        google.maps.event.trigger(map, 'resize');

        // Center the marker on the map with animation
        map.panTo(marker.getPosition());
    }

    // Remove the sidebar if user click on the map
    map.addListener('click', function () {

        // If sidebar is displayed
        if (body.hasClass('sidebar')) {

            // Remove the sidebar class on body
            body.removeClass('sidebar');

            // Refresh the map
            google.maps.event.trigger(map, 'resize');
        }
    });
};
