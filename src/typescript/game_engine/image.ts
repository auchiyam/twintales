import { Transformable } from './transformable'

// Image class is the abstract class for all images that will be used
// Important to note that image will only be drawn if there's any pending actions for the image.  Meaning if the image wasn't doing anything, it won't appear on the screen.
export abstract class GameImage extends Transformable {
    public distort: (ctx: CanvasRenderingContext2D, t: number) => void

    constructor(
        readonly show_inactive: boolean,
    ) {
        super()
        this.distort = () => {}
    }
    
    abstract draw(time: number, ctx: CanvasRenderingContext2D, scale: number) : void;
}

// Sprite class is for images with actual images to work with
export class Sprite extends GameImage {
    constructor(readonly image: HTMLImageElement, show_inactive: boolean = true) {
        super(show_inactive);
    }
    
    draw(time: number, ctx: CanvasRenderingContext2D, sf: number) {
        let [has_action, x, y, scx, scy, rad, opac] = this.scale_transformation(time, sf)

        // draw the image if the image performed some kind of action, or if it's set to show regardless of activity
        if (has_action || this.show_inactive) {
            // adjust the context so that the image will be drawn properly
            ctx.setTransform(scx, 0, 0, scy, x, y);
            if (rad > 0) {
                ctx.rotate(rad);
            }
            if (opac < 1) {
                ctx.globalAlpha = opac
            }

            ctx.drawImage(this.image, -this.image.width / 2, -this.image.height / 2);

            // reset the context to ensure the next one will be drawn properly
            ctx.setTransform(1, 0, 0, 1, 0, 0)
            if (opac < 1) {
                ctx.globalAlpha = 1
            }
        }
    }
}

// Vector class is intended for images that is dynamically drawn
export class DynamicSprite extends GameImage {
    constructor(readonly draw_base: (ctx: CanvasRenderingContext2D, t: number) => void, show_inactive: boolean = false) {
        super(show_inactive);
    }
    
    draw(time: number, ctx: CanvasRenderingContext2D, sf: number) {
        let [has_action, x, y, scx, scy, rad, opac] = this.scale_transformation(time, sf)

        // draw the image if the image performed some kind of action, or if it's set to show regardless of activity
        if (has_action || this.show_inactive) {
            // adjust the context so that the image will be drawn properly
            ctx.setTransform(scx, 0, 0, scy, x, y);
            if (rad > 0) {
                ctx.rotate(rad);
            }
            if (opac < 1) {
                ctx.globalAlpha = opac
            }

            this.draw_base(ctx, time);

            // reset the context to ensure the next one will be drawn properly
            ctx.setTransform(1, 0, 0, 1, 0, 0)
            if (opac < 1) {
                ctx.globalAlpha = 1
            }
        }
    }
}

