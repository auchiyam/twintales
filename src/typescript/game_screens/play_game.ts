import { Game } from './game'
import { GameObject } from '../game_objects/object';
import { Player } from '../game_objects/player';
import { draw } from '../game_engine/draw_canvas';
import { State } from '../game_engine/state';
import { sleep, frame_interval } from '../game_engine/general';

export class PlayGame extends Game {
    public objects: GameObject[]
    constructor(canvas: HTMLCanvasElement) {
        super(canvas)
        this.objects = []
        this.layers.push([])
    }

    initialize() {
        // load player
        let player = new Player()
        this.objects.push(player)

        let promises = []

        // initialize everything
        for (let i of this.objects) {
            promises.push(new Promise(async resolve => {
                await i.initialize()
                this.layers[0].push(i.image)
                resolve()
            }))
        }

        return Promise.all(promises).then(() => {

        })
    }

    async start() {
        let done = false
        let prev = window.performance.now()
        let start = window.performance.now()

        let dt: number, sleep_time: number

        while (!done) {
            dt = window.performance.now() - prev
            prev = window.performance.now()

            for (var i of this.objects) {
                i.update(dt)
            }

            Promise.all([
                draw(0, this.ctx, this.layers, this.width, this.height)
            ])

            sleep_time = frame_interval - (window.performance.now() - prev)

            if (sleep_time > 0) {
                await sleep(sleep_time)
            }
        }

        return State.TitleScreen
    }
}