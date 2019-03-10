import { Game } from './game';
import { State } from '../game_engine/state';
import { get_assets } from '../api/api'

// handles everything in the title screen
export class TitleScreen extends Game {
    private cursor: number
    private cursor_moved: boolean
    private selected: boolean
    private next_state: State
    private images: any

    constructor() {
        super()
        this.cursor = 0;
        this.cursor_moved = false;
        this.selected = false;
        this.next_state = State.PlayGame;
        this.images = {}
    }

    async initialize() {
        // load all images
        let val = await get_assets("all", "title_page");

        // returns the promise that says all the assets has been loaded for the title screen
        return new Promise(resolve => {
            for (let key in val.assets) {
                if (val.assets.hasOwnProperty(key)) {
                    let asset = val.assets[key]

                    let img:HTMLImageElement = new Image()

                    img.src = asset;

                    img.onload = () => {
                        return 1;
                    }

                    this.images[key] = img;
                }
            }
        })
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