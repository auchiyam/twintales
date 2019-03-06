import { Game } from './game';
import { State } from '../game_engine/state';

// handles everything in the title screen
export class TitleScreen extends Game {
    private cursor: number
    private cursor_moved: boolean
    private selected: boolean
    private next_state: State

    constructor() {
        super()
        this.cursor = 0;
        this.cursor_moved = false;
        this.selected = false;
        this.next_state = State.PlayGame;
    }

    async initialize() {
        // load all images

        // wait until all images are fully loaded
    }

    start() {
        // begin accepting user inputs

        while (!this.selected) {
            this.draw();
        }

        // return the new state so that main can redirect the user there
    }

    private draw() {

    }
}