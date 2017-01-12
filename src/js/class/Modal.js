import {mergeOptions, transitionSelect} from '../helper';

const defaults = {
    className: 'fade-and-drop',
    closeButton: true,
    abortButton: false,
    abortButtonText: 'Annuler',
    abortButtonClass: 'is-light',
    abortCallback: null,
    successButton: true,
    successButtonText: 'Ok',
    successButtonClass: 'is-primary',
    successCallback: null,
    title: '',
    content: '',
    overlay: true,
    closeOverlay: true,
};

class Modal {

    constructor(options) {
        this.modal = null;
        this.overlay = null;
        this.closeButton = null;
        this.abortButton = null;
        this.successButton = null;
        this.transitionEnd = transitionSelect();
        this.keyboardEvent = this.keyboardNav.bind(this);

        // Merge the defaults and user's options
        this.options = options && typeof options === 'object' ?  mergeOptions(defaults, options) : defaults;
    }

    // Open the modal
    open() {

        // Build the modal
        this.build();

        // Initialize our event listeners
        this.initializeEvents();

        // Add the necessary class to open the modal
        setTimeout(() => this.modal.className = this.modal.className + ' is-active', 200);

    }

    // Close the Modal
    close() {

        // _ is the modal bind to the eventListener
        let _ = this;

        // Remove the open class name
        this.modal.className = this.modal.className.replace('is-active', '');

        // Listen for CSS transitionEnd event and then Remove the modal from the DOM
        this.modal.addEventListener(this.transitionEnd, () => _.modal.remove());

        // Remove the keyboard event listener
        document.removeEventListener('keydown', this.keyboardEvent);
    }

    // Build the modal components
    build() {

        let modalCard, modalCardHead, modalCardTitle, modalCardBody, modalCardFoot, content;

        // Create modal element
        this.modal = document.createElement('div');
        this.modal.className = 'modal ' + this.options.className;

        // Create modal inner element
        modalCard = document.createElement('div');
        modalCard.className = 'modal-card';
        modalCardHead = document.createElement('header');
        modalCardHead.className = 'modal-card-head';
        modalCardTitle = document.createElement('p');
        modalCardTitle.className = 'modal-card-title';
        modalCardBody = document.createElement('section');
        modalCardBody.className = 'modal-card-body';
        modalCardFoot = document.createElement('footer');
        modalCardFoot.className = 'modal-card-foot';
        modalCardFoot.style.display = 'flex';

        /* OVERLAY */

        // If the overlay option is true, add an overlay
        if (this.options.overlay === true) {
            this.overlay = document.createElement('div');
            this.overlay.className = 'modal-background';
            this.modal.appendChild(this.overlay);
        }

        /* HEADER */

        modalCardTitle.innerHTML = this.options.title;
        modalCardHead.appendChild(modalCardTitle);

        // If closeButton option is true, add a close button
        if (this.options.closeButton === true) {
            this.closeButton = document.createElement('button');
            this.closeButton.className = 'delete';
            modalCardHead.appendChild(this.closeButton);
        }
        modalCard.appendChild(modalCardHead);

        /* BODY */

        // If content is an HTML string, append the HTML string || If it is a domNode, append its content
        if (typeof this.options.content === 'string') {
            content = this.options.content;
        } else {
            content = this.options.content.innerHTML;
        }

        modalCardBody.innerHTML = content;
        modalCard.appendChild(modalCardBody);

        /* FOOTER */

        // Set the footer justify content property
        if (this.options.abortButton === false && this.options.successButton === true) {
            modalCardFoot.style.justifyContent = 'flex-end';
        }
        else if (this.options.abortButton === true && this.options.successButton === false) {
            modalCardFoot.style.justifyContent = 'flex-start';
        }
        else {
            modalCardFoot.style.justifyContent = 'space-between';
        }

        // If abortButton option is true, add an abort button
        if (this.options.abortButton === true) {
            this.abortButton = document.createElement('button');
            this.abortButton.className = 'button is-medium ' + this.options.abortButtonClass;
            this.abortButton.innerHTML = this.options.abortButtonText;
            modalCardFoot.appendChild(this.abortButton);
        }

        // If successButton option is true, add an success button
        if (this.options.successButton === true) {
            this.successButton = document.createElement('button');
            this.successButton.className = 'button is-medium ' + this.options.successButtonClass;
            this.successButton.innerHTML = this.options.successButtonText;
            modalCardFoot.appendChild(this.successButton);
        }
        modalCard.appendChild(modalCardFoot);
        this.modal.appendChild(modalCard);

        /* END */

        // Append the modal to the body
        document.body.appendChild(this.modal);

        return this;
    }

    // Set the keyboard navigation
    keyboardNav() {

        // Left arrow key is pressed
        if (event.key === 'ArrowLeft') {
            if (this.options.abortCallback) {
                this.close();
                this.options.abortCallback();
            }
        }

        // Right arrow key is pressed
        if (event.key === 'ArrowRight') {
            if (this.options.successCallback) {
                this.close();
                this.options.successCallback();
            }
        }

        // Enter key is pressed
        if (event.key === 'Enter') {
            if (this.options.successCallback) {
                this.close();
                this.options.successCallback();
            }
            else {
                this.close();
            }
        }
    }

    // Initialize the events listeners
    initializeEvents() {

        if (this.closeButton) {
            this.closeButton.addEventListener('click', this.close.bind(this));
        }

        if (this.overlay && this.options.closeOverlay) {
            this.overlay.addEventListener('click', this.close.bind(this));
        }

        if (this.abortButton) {
            this.abortButton.addEventListener('click', this.close.bind(this));
            if (this.options.abortCallback) {
                this.abortButton.addEventListener('click', this.options.abortCallback.bind(this));
            }

        }

        if (this.successButton) {
            this.successButton.addEventListener('click', this.close.bind(this));
            if (this.options.successCallback) {
                this.successButton.addEventListener('click', this.options.successCallback.bind(this));
            }
        }

        document.addEventListener('keydown', this.keyboardEvent);
    }
}

export default Modal;