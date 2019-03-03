import { State } from "./state"

function get_resolution() {
    // get the resolution of the current browser window
    let width = 0;
    let height = 0;

    // Calculate the largest 16:9 canvas that can be made from the resolution with some padding in mind
    let ratio = 16/9;
    let canv_width = 0;
    let canv_height = 0;

    // the current window's width is bigger than the desired width
    if (ratio > width / height) {

    }
    // the current window's height is bigger than the desired height
    else if (ratio < width / height) {

    }
    // the current window is exactly 16:9
    else {
        canv_width = width;
        canv_height = height;
    }

    // Draw the canvas with the right resolution, making sure it is centered
    return { width: canv_width, height: canv_height }
}

// create a 
export function initialize() {
    // figure out the resolution
    let resolution = get_resolution();

    // initialize the canvas
    var canvas = document.createElement("canvas");

    canvas.width = resolution.width;
    canvas.height = resolution.height;
    canvas.id = "game_canvas"

    document.body.appendChild(canvas);

    // the initialization is complete, proceed to loading
    return State.Loading;
}