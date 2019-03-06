import { GameImage } from './image'

export enum State {
    Initialize,         // Draw the canvas and start the game
    TitleScreen,        // The initial state of the game
    PlayGame,           // The game start has been selected, and the prologue should be displayed
    PracticeStages,     // The practice stage has been selected, and the practice stage sequence should be displayed
    Option,             // The option has been selected, and the option should be displayed
}

export class GameState {
    readonly start_time: number;
    readonly context: CanvasRenderingContext2D;

    time: number;
    images: GameImage[][]

    constructor(readonly canvas: HTMLCanvasElement) {
        this.start_time = Date.now();
        this.time = 0;
        this.context = <CanvasRenderingContext2D> canvas.getContext("2d");

        this.images = [];
    }
}