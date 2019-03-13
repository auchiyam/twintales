import { initialize, resize_canvas, initialized } from "./initialize";
import { GameState } from "./state";
import { draw } from "./draw_canvas";
import { State } from "./state"
import { Sprite } from "./image";

import { get_assets } from "../api/api"
import { sleep } from './general'
import { TitleScreen } from "../game_screens/title_screen";

async function main_test(canv?: HTMLCanvasElement) {
    let done = false;

    if (canv === undefined) {
        canv = initialize();
    }

    let state = new GameState();
    let curr_time = 0;

    let img: HTMLImageElement = new Image();

    let val = await get_assets("images", "test_assets");

    img.src = `${val.assets.images.akane_chan}`;

    window.addEventListener("resize", function() { resize_canvas(<HTMLCanvasElement> document.getElementById("game_canvas")); draw(state.time, state.context, state.images, state.canvas.width, state.canvas.height) })

    let loading = new Promise(resolve => {
        img.onload = async function() {

            resolve()
        }
    })

    await loading

    let sp: Sprite = new Sprite(img, true);
    sp.fade(0, 1);
    sp.move(0, 1920 / 2, 1080 / 2);
    sp.scale(0, .6);

    state.images.push([]);
    state.images[0].push(sp);

    // template for the main loop
    // keep track of the beginning time so that curr_time will be at the right time
    let beginning = window.performance.now()
    let beginning_loop

    while (!done) {
        // keep track of the beginning of the loop
        beginning_loop = window.performance.now()

        // do the logic asynchronously
        await Promise.all([
            draw(curr_time, state.context, state.images, state.canvas.width, state.canvas.height)
        ]);

        // if everything finished before the designated time, take a break
        let sleep_time = 17 - (window.performance.now() - beginning_loop)

        if (sleep_time > 0) {
            await sleep(sleep_time);
        }

        // more code if necessary
        if (curr_time > 10000) {
            done = true;
        }

        // now that the loop finished, update the curr_time for the next loop
        curr_time = window.performance.now() - beginning
    }
}

async function main() {
    let curr_state: State = State.TitleScreen;
    let canvas: HTMLCanvasElement = initialize()
    let done = false

    while (!done) {
        switch(curr_state) {
            case (State.TitleScreen):
                let title = new TitleScreen(canvas);
                await title.initialize();
                curr_state = await title.start();
                console.log("left title.start()")
                break;
            default:
                await main_test(canvas)
                done = true
                break;
        }
    }
}

window.onload = main;