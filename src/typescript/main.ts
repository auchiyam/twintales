import { initialize } from "./initialize";
import { State } from "./state";

function main() {
    let done = false;
    let start_time = Date.now();
    let curr_time = start_time;

    let state = State.Initialize;

    state = initialize();
}

window.onload = main;