import { initialize } from "./initialize";
import { State } from "./state";

function main() {
    let done = false;
    let start_time = Date.now();
    let curr_time = start_time;

    let state = State.Initialize;

    //draw canvas based on state until the loop is done
    while (!done) {
        curr_time = Date.now() - start_time;
        
        switch (state) {
            case State.Initialize:
                state = initialize();
                break;
            case State.Loading:
                break;
            case State.TitleScreen:
                break;
            default:
                break;
        }
    }
}

main();