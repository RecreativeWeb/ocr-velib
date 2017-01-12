let styles = [
    {
        stylers: [
            {hue: "#00D1B2"},
            {saturation: -20}
        ]
    }, {
        featureType: "road",
        elementType: "geometry",
        stylers: [
            {lightness: 100},
            {visibility: "simplified"}
        ]
    }, {
        featureType: "road",
        elementType: "labels",
        stylers: [
            {visibility: "off"}
        ]
    }
];

class Maps {

    constructor(mapContainer, mapCenter) {

        this.mapContainer = mapContainer;
        this.mapCenter = mapCenter;

        this.clusterOptions = {
            minimumClusterSize: 5,
            gridSize: 100,
            styles: [{
                url: '../../../img/station.svg',
                height: 60,
                width: 60,
                anchor: [0, 0],
                textColor: '#314E55',
                textSize: 16,
            }]
        };
    }

    // Init and return a new map instance
    init() {
        return new google.maps.Map(this.mapContainer, {
            center: this.mapCenter,
            scrollwheel: false,
            zoom: 15,
            styles: styles
        });
    }

    // Add markers to the map with an animation
    static addMarkersWithTimeOut(markers, map) {

        // Add the markers to the map with animation
        window.setTimeout(function () {
            for (let i = 0; i < markers.length; i++) {
                window.setTimeout(function () {
                    map.addMarker(markers[i]);
                }, i * 10);
            }
        }, 1000);

    }

    // Get the boundaries of the map viewport
    getBoundaries() {

        let map = this.init();
        let bounds = map.getBounds();
        let NECorner = bounds.getNorthEast();
        let SWCorner = bounds.getSouthWest();
        let NWCorner = new google.maps.LatLng(NECorner.lat(), SWCorner.lng());
        let SECorner = new google.maps.LatLng(SWCorner.lat(), NECorner.lng());

        return '(' + NWCorner.lat() + ',' + NWCorner.lng() + '),' +
            '(' + SWCorner.lat() + ',' + SWCorner.lng() + '),' +
            '(' + SECorner.lat() + ',' + SECorner.lng() + '),' +
            '(' + NECorner.lat() + ',' + NECorner.lng() + '),' +
            '(' + NWCorner.lat() + ',' + NWCorner.lng() + ')';
    }

    // Create a marker
    createMarker(coordinate, available) {

        let image = {
            url: '../../../img/cycle.svg',
            size: new google.maps.Size(50, 50),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(25, 25),
            scaledSize: new google.maps.Size(50, 50)
        };

        // If the station is not available, set a different marker
        if (!available) image.url = './../../img/no-cycle.svg';

        return new google.maps.Marker({
            position: coordinate,
            animation: google.maps.Animation.DROP,
            icon: image
        });
    }

    // Add a marker on the map
    addMarker(marker) {
        marker.setMap(this.init());
    }
}

export default Maps;