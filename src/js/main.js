// Hot reload
require("raw-loader!../../index.html");

// SASS
require("../sass/main.scss");

// Import
import velib from "./velibController";
import reservation from "./reservationController";
import slide from "./slideController";

// Init the application
slide();
velib();
reservation();
