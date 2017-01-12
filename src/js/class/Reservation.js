import {formatTimer} from '../helper';
import Modal from './Modal';
import Velib from './Velib';

class Reservation {

    constructor(station) {
        this.keepForMinutes = 20;
        this.dateTime = null;
        this.expireOn = null;
        this.velib = new Velib(station);
        this.signature = null;
    }

    // Parse the FormData Object
    static parse(data) {
        let station = {};
        for (let [key, value] of data) station[key] = JSON.parse(value);
        return station;
    }

    // Set the the time settings of the reservation
    setTime() {
        this.dateTime = Date.now();
        this.expireOn = (this.keepForMinutes * 60 * 1000) + this.dateTime; // in ms
    }

    // Alert an error
    error() {

        if (!this.velib.isStationOpen()) {
            new Modal({
                title: 'La station est fermée',
                content: 'Vous ne pouvez pas réserver de vélo à cette station car celle-ci est fermée.'
            }).open();
            return false;
        }

        if (!this.velib.isBikeAvailable()) {
            new Modal({
                title: 'Aucun vélo disponible',
                content: 'Vous ne pouvez pas réserver de vélo à cette station car aucun vélo n\'est disponible.'
            }).open();
            return false;
        }
    }

    // Check if the reservation is valid
    check() {
        if (!this.velib.check()) return this.error();
        return true;
    }

    // Make a new reservation
    make() {

        // Check if the reservation is valid
        this.check();

        // Set the the time settings of the reservation
        this.setTime();

        // Store the reservation in sessionStorage, stringify to be able to store an object
        sessionStorage.setItem('reservation', JSON.stringify(this));

        // Display the reservation
        Reservation.setHtml();

        // Log the reservation
        Reservation.log();

        // Start the expire count down
        Reservation.expire()
    }

    // Get the time left before expiration
    static getTimeLeftBeforeExpiration() {

        // Get Current reservation
        let current = Reservation.getCurrent();

        // Return a time in secondes
        return Math.floor((current.expireOn - Date.now()) / 1000); // in sec

    }

    // Set the expire process for a reservation
    static expire() {

        // Set an interval for the count down
        let interval = window.setInterval(function () {

            // Do not execute count down if there is no current reservation
            if (!Reservation.isCurrent()) return false;

            // Format the time to the desire format
            let timer = formatTimer(Reservation.getTimeLeftBeforeExpiration());

            // If the reservation expire
            if (timer === false) {
                clearInterval(interval);
                Reservation.removeCurrent();
                new Modal({
                    title: 'Réservation annulée',
                    content: 'Votre réservation est arrivée à expiration et a été annulée.'
                }).open();
            }

            Reservation.setReservationExpire(timer);

        }, 1000);

    }

    // Display the reservation details
    static setHtml() {

        const velib = Reservation.getCurrentVelib();

        const timer = formatTimer(Reservation.getTimeLeftBeforeExpiration());

        Reservation.setReservationDetails(velib.name);

        Reservation.setReservationExpire(timer);

        $('body').addClass('reservation');

    }

    // Set the reservation expire time
    static setReservationExpire(html) {
        return $('#footer').children('.reservation_expire').html('Expire dans <span class="tag is-danger">' + html + '</span>');
    }

    // Set the reservation details
    static setReservationDetails(html) {
        return $('#footer').children('.reservation_details').html('1 vélo réservé à la station &laquo; ' + html + ' &raquo;');
    }

    // Check if there is a current reservation
    static isCurrent() {
        return sessionStorage.getItem('reservation') !== null;
    }

    // Get the current reservation
    static getCurrent() {
        return JSON.parse(sessionStorage.getItem('reservation'));
    }

    // Get the current velib instance
    static getCurrentVelib() {
        return new Velib(Reservation.getCurrent().velib.station);
    }

    // Remove the current reservation
    static removeCurrent() {

        sessionStorage.removeItem('reservation');

        $('body').removeClass('reservation');

        // Refresh the map
        google.maps.event.trigger(map, 'resize');
    }

    // Log the reservation
    static log() {
        console.log(Reservation.getCurrent());
    }

}

export default Reservation;