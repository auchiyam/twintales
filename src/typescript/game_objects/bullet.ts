import { GameObject } from "./object";
import { DynamicSprite } from "../game_engine/image";

export abstract class Bullet extends GameObject {
    private t: number
    protected use_dt: boolean
    constructor(
        hitbox: number[][],
        destroy: () => void,
        id: number,
        use_dt?: boolean
    ) {
        super(hitbox, destroy, id)
        this.t = 0
        if (use_dt === undefined) {
            this.use_dt = false
        } else {
            this.use_dt = use_dt
        }
    }

    abstract transform(t: number) : void

    update(dt: number) {
        if (!this.use_dt) {
            this.transform(this.t + dt)
        }
        else {
            this.transform(dt)
        }

        this.t += dt
    }
}

export class PlayerBullet extends Bullet {
    constructor(hitbox: number[][], destroy: () => void, id: number,
        x: number, y: number, 
    ) {
        super(hitbox, destroy, id, true)
        this.x = x
        this.y = y
    }

    initialize() {
        return new Promise(resolve => {
            let spr = new DynamicSprite((ctx, t) => {
                let x_len = 15, y_len = 10
                ctx.beginPath()

                ctx.moveTo(-x_len/2, -y_len/2)
                ctx.lineTo(-x_len/2, y_len/2)
                ctx.lineTo(x_len/2, 0)

                ctx.closePath()

                ctx.fillStyle = "#202020"
                ctx.fill()
            })

            this.image = spr

            resolve()
        })
    }

    async transform(t: number) {
        let speed = 1920.0 / 1000.0

        if (this.x > 1980) {
            await this.destroy()
            return;
        }

        this.move(this.x + speed * t, this.y)

        this.apply_transformation(0)

        this.image.move(this.x, this.y)
    }
}