import { initialize, resize_canvas } from "./initialize";
import { GameState } from "./state";
import { draw } from "./draw_canvas";

import { Sprite } from "./image"

function main() {
    let done = false;

    let canv = initialize();

    let state = new GameState();
    let curr_time: number = 0;

    let img: HTMLImageElement = new Image();

    img.src = "https://koinuri.com/assets/test_assets/akane_chan.png"

    window.addEventListener("resize", function() { resize_canvas(<HTMLCanvasElement> document.getElementById("game_canvas")); draw(state) })

    img.onload = function() {
        let sp: Sprite = new Sprite(img);
        sp.fade(0, 1);
        sp.move(0, 1920 / 2, 1080 / 2);
        sp.scale(0, .6);

        state.images.push([]);
        state.images[0] = [];
        state.images[0].push(sp);

        draw(state);
    }
}

window.onload = main;