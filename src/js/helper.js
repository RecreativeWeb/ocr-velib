// Utility method to format the time to the desire format
export function formatTimer(duration) {

    let minutes = parseInt(duration / 60, 10);
    let seconds = parseInt(duration % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    if (--duration + 1 <= 0) return false;

    return `${minutes} min et ${seconds} s`;
}

// Utility method to merge the defaults and user's options
export function mergeOptions(defaults, options) {
    for (let [key, value] of Object.entries(defaults)) if (!options.hasOwnProperty(key)) options[key] = value;
    return options;
}

// Utility method to determine which transitionEnd event is supported
export function transitionSelect() {
    let el = document.createElement('div');
    if (el.style.WebkitTransition) return 'webkitTransitionEnd';
    if (el.style.OTransition) return 'oTransitionEnd';
    if (el.style.mozTransitionEnd) return 'mozTransitionEnd';
    return 'transitionend';
}

// Utility method to build a parameter string from an object of properties
export function buildParam(settings) {
    let params = '';
    for (const [key, value] of Object.entries(settings)) params += '&' + key + '=' + value;
    return params;
}