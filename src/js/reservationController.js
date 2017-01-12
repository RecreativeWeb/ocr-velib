import Reservation from './class/Reservation';
import Modal from './class/Modal';
import SignaturePad from 'signature_pad';

export default function () {

    // Init variables
    let body = $('body');
    let aside = $('#aside');
    let footer = $('#footer');
    let button = aside.children('button:first');
    let form = document.querySelector('#aside form');
    let formData = null;
    let reservation = null;
    let canvas = document.querySelector("canvas");
    let signaturePad = new SignaturePad(canvas);
    let signature = $('.signature');

    // If there is a current reservation
    if (Reservation.isCurrent()) {
        Reservation.log();
        Reservation.setHtml();
        Reservation.expire();
    }

    // Utility function to toggle the signature area
    function toggleSignatureField() {
        signaturePad.clear();
        signature.toggle();
        button.toggle();
    }

    // Utility function for the end process for a reservation
    function processEnd() {
        toggleSignatureField();
        signaturePad.clear();
        body.removeClass('sidebar');
        google.maps.event.trigger(map, 'resize');
    }

    // Display current reservation when footer is clicked
    footer.click(function () {
        let current = Reservation.getCurrent();
        let velib = Reservation.getCurrentVelib();
        let signature = current.signature;

        new Modal({
            content: `
                    <div class="has-text-centered">
                        <ul>
                            <li>${velib.name}</li>
                            <li>${velib.address}</li>
                        </ul>
                        <div class="canvas">
                            <img src="${current.signature}" title="Votre signature"/>
                        </div>
                    </div>
                    `,
            title: 'Voici les détails de votre réservation:',
            abortButton: true,
            abortButtonText: 'Annuler ma réservation',
            abortButtonClass: 'is-danger',
            abortCallback: () => Reservation.removeCurrent()
        }).open();
    });

    // Display the signature area when button is clicked
    button.click(function (e) {
        e.preventDefault();

        // Get the formData and parse them
        formData = Reservation.parse(new FormData(form));
        reservation = new Reservation(formData);

        // If check pass show the signature, else display modal error
        if (reservation.check()) toggleSignatureField();
    });

    // Close the signature area on form reset
    $(form).find('button[type=reset]').click(function (e) {
        e.preventDefault();
        toggleSignatureField();
    });

    // Processus to make a new reservation
    $(form).submit(function (e) {
        e.preventDefault();

        // If the signature Pad is empty
        if (signaturePad.isEmpty()) {
            new Modal({title: 'Attention', content: 'Vous devez signer votre réservation.'}).open();
            return false;
        }

        // Push the signature to the reservation
        reservation.signature = signaturePad.toDataURL();

        if (Reservation.isCurrent()) {

            new Modal({
                title: 'Que souhaitez-vous faire ?',
                content: 'Vous ne pouvez avoir qu\'une seule réservation à la fois et ' +
                'une réservation est déjà encours.',
                abortButton: true,
                abortCallback: () => processEnd(),
                successButtonText: 'Réserver',
                successCallback: () => {
                    reservation.make();
                    processEnd();
                },
            }).open();
        }
        else {
            reservation.make();
            processEnd();
        }
    });
}
