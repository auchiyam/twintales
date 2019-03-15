import { GameImage } from "../game_engine/image"

export abstract class Game {
    protected readonly ctx: CanvasRenderingContext2D
    protected width: number
    protected height: number
    protected layers: GameImage[][]
    constructor(protected readonly canvas: HTMLCanvasElement) {
        this.ctx = <CanvasRenderingContext2D> canvas.getContext("2d")
        this.width = canvas.width
        this.height = canvas.height
        this.layers = []
    }

    // contains all the initialization process of each game state
    // examples of things initialized:
    //  - load all images
    //  - load the logic for stages
    //  - initial position of player/cursor
    //  - set up the event handlers to respond to user input properly
    abstract initialize() : void;
    // start the loops required for the state of the game
    abstract start() : void;
}