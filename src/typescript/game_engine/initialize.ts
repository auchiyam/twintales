import { State } from "./state"

function get_resolution() {
    // get the resolution of the current browser window
    let width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

    let height = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;

    // make sure they're in double format for decimals
    width *= 1.0;
    height *= 1.0;

    // Calculate the largest 16:9 canvas that can be made from the resolution with some padding in mind
    let ratio = 16.0/9.0;
    let canv_width = 0;
    let canv_height = 0;

    // the current window's width is bigger than the desired width
    if (ratio < width / height) {
        canv_height = height;
        canv_width = height * (16/9);
    }
    // the current window's height is bigger than the desired height
    else if (ratio > width / height) {
        canv_width = width;
        canv_height = width * (9/16);
    }
    // the current window is exactly 16:9
    else {
        canv_width = width;
        canv_height = height;
    }

    // Draw the canvas with the right resolution, making sure it is centered
    return { width: canv_width, height: canv_height }
}

function resize_canvas(cv: HTMLCanvasElement) {
    let resolution = get_resolution();

    cv.width = resolution.width;
    cv.height = resolution.height;
}

// create a canvas and add it to the index.html
export function initialize() {
    // initialize the canvas
    var canvas = document.createElement("canvas");

    canvas.style.setProperty('background-color', '#eee');

    resize_canvas(canvas);

    canvas.id = "game_canvas"

    //create a handler for resizing
    window.addEventListener("resize", function() { resize_canvas(<HTMLCanvasElement> document.getElementById("game_canvas")) })

    document.body.appendChild(canvas);

    return canvas;
}