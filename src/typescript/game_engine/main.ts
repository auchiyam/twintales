import { initialize } from "./initialize";
import { State, GameState } from "./state";
import { draw } from "./draw_canvas";

function main() {
    let done = false;

    let canv = initialize();

    let curr_state = new GameState(canv);
    let curr_time: number;

    while (!done) {
        curr_time = draw(curr_state);
    }
}

window.onload = main;