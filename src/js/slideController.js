import Modal from './class/Modal';

export default function () {

    const body = $('body');

    let content = {
        slide1: {
            img: 'step1.png',
            text: 'Choisissez votre station de vélib en cliquant dessus, ' +
            'les informations de celle-ci apparaissent dans un bandeau sur la droite.'
        },
        slide2: {
            img: 'step2.png',
            text: 'Cliquez sur &laquo; réserver &raquo; puis validez votre réservation en ' +
            'signant dans le champ demandé.'
        },
        slide3: {
            img: 'step3.png',
            text: 'A tout moment vous pouvez fermer les informations de la station en cliquant sur la carte.'
        },
        slide4: {
            img: 'step4.png',
            text: 'Accédez à votre réservation en cliquant sur le bandeau jaune en pied de page.'
        },
        slide5: {
            img: 'step5.png',
            text: 'Vous pouvez supprimer votre réservation en cliquant sur le bouton prévu à cet effet.'
        },
        slide6: {
            img: 'step6.png',
            text: 'Vous pouvez afficher cette aide à tout moment en cliquant sur le bouton ' +
            'situé en bas à gauche de la page.'
        }
    };

    function getContent(slide) {
        return `
            <div class="step">
                <div>
                    <img src="../../img/${content[slide].img}"/>
                </div>
                <p>${content[slide].text}</p>
            </div>`;
    }

    let slides = {
        slide1: {
            title: 'Étape 1',
            content: getContent('slide1'),
            closeButton: false,
            closeOverlay: false,
            successButtonText: 'Suivant',
            successCallback: () => new Modal(slides.slide2).open()
        },
        slide2: {
            title: 'Étape 2',
            content: getContent('slide2'),
            closeButton: false,
            closeOverlay: false,
            abortButton: true,
            abortButtonText: 'Précédent',
            abortCallback: () => new Modal(slides.slide1).open(),
            successButtonText: 'Suivant',
            successCallback: () => new Modal(slides.slide3).open(),
        },
        slide3: {
            title: 'Étape 3',
            content: getContent('slide3'),
            closeButton: false,
            closeOverlay: false,
            abortButton: true,
            abortButtonText: 'Précédent',
            abortCallback: () => new Modal(slides.slide2).open(),
            successButtonText: 'Suivant',
            successCallback: () => new Modal(slides.slide4).open(),
        },
        slide4: {
            title: 'Étape 4',
            content: getContent('slide4'),
            closeButton: false,
            closeOverlay: false,
            abortButton: true,
            abortButtonText: 'Précédent',
            abortCallback: () => new Modal(slides.slide3).open(),
            successButtonText: 'Suivant',
            successCallback: () => new Modal(slides.slide5).open(),
        },
        slide5: {
            title: 'Étape 5',
            content: getContent('slide5'),
            closeButton: false,
            closeOverlay: false,
            abortButton: true,
            abortButtonText: 'Précédent',
            abortCallback: () => new Modal(slides.slide4).open(),
            successButtonText: 'Suivant',
            successCallback: () => new Modal(slides.slide6).open(),
        },
        slide6: {
            title: 'Étape 6',
            content: getContent('slide6'),
            closeButton: false,
            closeOverlay: false,
            abortButton: true,
            abortButtonText: 'Précédent',
            abortCallback: () => new Modal(slides.slide5).open(),
            successButtonText: 'J\'ai compris',
        }
    };

    // Display the help slides if not seen before during the current session
    if (sessionStorage.getItem('displayHelp') === null) {
        sessionStorage.setItem('displayHelp', true);
        new Modal(slides.slide1).open();
    }

    // Set the help icon
    let helpIcon = $('<img id="help" src="../../img/Stop.svg"/>');

    // Append the icon to the body
    body.append(helpIcon);

    // Display the slides when the help icon is clicked
    helpIcon.click(() => {
        new Modal(slides.slide1).open();
    });

}