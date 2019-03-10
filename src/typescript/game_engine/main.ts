import { initialize, resize_canvas } from "./initialize";
import { GameState } from "./state";
import { draw } from "./draw_canvas";

import { Sprite } from "./image";

import { get_assets } from "../api/api"

async function main() {
    let done = false;

    let canv = initialize();

    let state = new GameState(canv);
    let curr_time: number = 0;

    let img: HTMLImageElement = new Image();

    let val = await get_assets("images", "test_assets");

    console.log(val)

    img.src = `${val.assets.akane_chan}`

    window.addEventListener("resize", function() { resize_canvas(<HTMLCanvasElement> document.getElementById("game_canvas")); draw(state) })

    img.onload = function() {
        let sp: Sprite = new Sprite(img);
        sp.fade(0, 1)
        sp.move(0, 1920 / 2, 1080 / 2);
        sp.scale(0, .6)

        state.images.push([])
        state.images[0] = []
        state.images[0].push(sp)

        draw(state);
    }
}

window.onload = main;