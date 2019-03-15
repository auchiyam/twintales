import { GameObject } from "./object";
import { GameImage, DynamicSprite } from "../game_engine/image"

export class Player extends GameObject {
    public image!: GameImage
    public x: number
    public y: number
    public direction: number
    constructor() {
        let hitbox = [[0, 0, 5]]
        super(hitbox)
        this.x = 1920 / 8
        this.y = 1080 / 2
        this.direction = 5
    }

    async initialize() {
        // load image
        // draw spinning square for now
        
        return new Promise((resolve) => {
            this.image = new DynamicSprite((ctx, t) => {
                let size = 50

                ctx.fillStyle = "#202020";
                ctx.fillRect(-size/2, -size/2, size, size);
            })

            this.initialize_button_events();

            resolve()
        })
    }

    destroy() {

    }

    respawn() {

    }

    update(dt: number) {
        let offset_rad = Math.PI * (dt / 1000.0) // do half a circle every second
        let off_x = 0, off_y = 0
        let direction = this.direction

        let angles = [-5/4, -6/4, -7/4, -1, -1, -0, -3/4, -2/4, -1/4].map((val) => {return val * Math.PI})

        if (direction !== 5) {
            let angle = angles[direction - 1];
            let speed = 1920.0 / 2000.0

            off_x = speed * Math.cos(angle)
            off_y = speed * Math.sin(angle)
        }

        // if it goes out of bounds, get rid of offset
        // if x goes below
        if ((!(20 < this.x) && (direction % 3 === 1)) || (!(this.x < 1900) && (direction % 3 == 0))) {
            off_x = 0
        }

        if ((!(20 < this.y) && (Math.floor(direction/3) === 2)) || (!(this.y < 1060) && (Math.floor(direction/3) / 3 == 0))) {
            off_y = 0
        }

        // update the current status
        this.rotate(this.rad + offset_rad)
        this.move(this.x + off_x * dt, this.y + off_y * dt)

        this.apply_transformation(0)

        // and then update the image to match the status
        this.image.rotate(this.rad % Math.PI / 2)
        this.image.move(this.x, this.y)
    }

    initialize_button_events() {
        let held_down: number[] = []
        window.addEventListener("keydown", (e) => {
            e = e || window.event;

            let key = e.key;

            switch (key) {
                case "Left":
                case "ArrowLeft":
                    if (!held_down.includes(0)) {
                        this.direction -= 1;
                        held_down.push(0)
                    }
                    break;
                case "Down":
                case "ArrowDown":
                    if (!held_down.includes(1)) {
                        this.direction -= 3;
                        held_down.push(1)
                    }
                    break;
                case "Up":
                case "ArrowUp":
                    if (!held_down.includes(2)) {
                        this.direction += 3;
                        held_down.push(2)
                    }
                    break;
                case "Right":
                case "ArrowRight":
                    if (!held_down.includes(3)) {
                        this.direction += 1;
                        held_down.push(3)
                    }
                    break;
                // shoot
                case "z":
                case "Z":
                    
                    break;
                case "Shift":

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
                    if (held_down.includes(0)) {
                        this.direction += 1;
                        held_down = held_down.filter((val) => {return val !== 0})
                    }
                    break;
                case "Down":
                case "ArrowDown":
                    if (held_down.includes(1)) {
                        this.direction += 3;
                        held_down = held_down.filter((val) => {return val !== 1})
                    }
                    break;
                case "Up":
                case "ArrowUp":
                    if (held_down.includes(2)) {
                        this.direction -= 3;
                        held_down = held_down.filter((val) => {return val !== 2})
                    }
                    break;
                case "Right":
                case "ArrowRight":
                    if (held_down.includes(3)) {
                        this.direction -= 1;
                        held_down = held_down.filter((val) => {return val !== 3})
                    }
                    break;
                case "Z":
                    
                    break;
            }
        });
    }


}