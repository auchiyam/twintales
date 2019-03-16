import { Game } from './game'
import { GameObject } from '../game_objects/object';
import { Player } from '../game_objects/player';
import { draw } from '../game_engine/draw_canvas';
import { State } from '../game_engine/state';
import { sleep, frame_interval } from '../game_engine/general';
import { PlayerBullet } from '../game_objects/bullet';

export class PlayGame extends Game {
    public objects: GameObject[]
    public player!: Player
    public shoot: boolean
    public id_count = 0
    public direction: number[]
    constructor(canvas: HTMLCanvasElement) {
        super(canvas)
        this.objects = []
        this.layers.push([])
        this.shoot = false
        this.direction = []
    }

    initialize() {
        // load player
        let player = new Player(() => {}, this.id_count)
        this.add_object(player)

        this.player = player

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
            this.initialize_button_events();
        })
    }

    async start() {
        let done = false
        let prev = window.performance.now()

        let dt: number, sleep_time: number
        let frame_count = 0

        while (!done) {
            // add shots ever 3 frames if the shoot button is being held
            if (this.shoot && frame_count % 3 == 0) {
                let p_bullet = new PlayerBullet([], () => {
                    let i = 0
                    this.objects = this.objects.filter((val, ind) => {
                        if (val.id === p_bullet.id) {
                            i = ind
                        }
                        return val.id !== p_bullet.id
                    });

                    this.layers[0] = this.layers[0].filter((val, ind) => {
                        return ind !== i
                    })
                }, this.id_count, this.player.x + 20, this.player.y)
                await p_bullet.initialize()

                this.add_object(p_bullet)
                this.layers[0].push(p_bullet.image)
            }

            // update the direction the player is going
            var horizontal: number = 0, vertical: number = 0
            for (var j of this.direction) {
                switch (j) {
                    case (0):
                        horizontal = -1
                        break;
                    case (1):
                        vertical = -3
                        break;
                    case (2):
                        vertical = 3
                        break;
                    case (3):
                        horizontal = 1
                }
            }

            this.player.direction = 5 + horizontal + vertical

            dt = window.performance.now() - prev
            prev = window.performance.now()

            // update all the objects
            for (var i of this.objects) {
                i.update(dt)
            }

            // run through the engine
            Promise.all([
                draw(0, this.ctx, this.layers, this.width, this.height)
            ])

            // if the loop executed everything fast enough, take a break
            sleep_time = frame_interval - (window.performance.now() - prev)

            if (sleep_time > 0) {
                await sleep(sleep_time)
            }

            frame_count++;
        }

        return State.TitleScreen
    }

    async initialize_button_events() {
        let held_down: number[] = []
        window.addEventListener("keydown", async (e) => {
            e = e || window.event;

            let key = e.key;

            switch (key) {
                // held down: 0
                case "Left":
                case "ArrowLeft":
                    if (!this.direction.includes(0)) {
                        this.direction.push(0)
                    }
                    break;
                // held down: 1
                case "Down":
                case "ArrowDown":
                    if (!this.direction.includes(1)) {
                        this.direction.push(1)
                    }
                    break;
                // held down: 2
                case "Up":
                case "ArrowUp":
                    if (!this.direction.includes(2)) {
                        this.direction.push(2)
                    }
                    break;
                // held down: 3
                case "Right":
                case "ArrowRight":
                    if (!this.direction.includes(3)) {
                        this.direction.push(3)
                    }
                    break;
                // held down: 4
                case "z":
                case "Z":
                    if (!held_down.includes(4)) {
                        held_down.push(4)
                        this.shoot = true
                    }
                    break;
                case "Shift":
                    if (!held_down.includes(5)) {
                        held_down.push(5)
                        this.player.slow = true
                    }
                    break;
                case "x":
                case "X":

                    break;
            }
        });

        window.addEventListener("keyup", (e) => {
            e = e || window.event;

            let key = e.key;

            switch (key) {
                case "Left":
                case "ArrowLeft":
                    if (this.direction.includes(0)) {
                        this.direction = this.direction.filter((val) => {return val !== 0})
                    }
                    break;
                case "Down":
                case "ArrowDown":
                    if (this.direction.includes(1)) {
                        this.direction = this.direction.filter((val) => {return val !== 1})
                    }
                    break;
                case "Up":
                case "ArrowUp":
                    if (this.direction.includes(2)) {
                        this.direction = this.direction.filter((val) => {return val !== 2})
                    }
                    break;
                case "Right":
                case "ArrowRight":
                    if (this.direction.includes(3)) {
                        this.direction = this.direction.filter((val) => {return val !== 3})
                    }
                    break;
                case "z":
                case "Z":
                    if (held_down.includes(4)) {
                        held_down = held_down.filter((val) => {return val !== 4})
                        this.shoot = false
                    }
                    break;
                case "Shift":
                    if (held_down.includes(5)) {
                        held_down = held_down.filter((val) => {return val !== 5})
                        this.player.slow = false
                    }
            }
        });
    }

    add_object(obj: GameObject) {
        this.objects.push(obj)
        this.id_count++
    }
}