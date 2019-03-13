import { GameImage } from './image'

// Given the current state of the game, draw on canvas appropriately then return the amount of time took to complete it
export function draw(time: number, context: CanvasRenderingContext2D, layers: GameImage[][], width: number = 1920, height: number = 1080) {
    return new Promise (resolve => {
        let ctx = context;

        // get the scale factor of width and height and average it
        let scale_factor = ((width / 1920.0) + (height / 1080.0)) / 2;

        ctx.clearRect(0, 0, width, height);

        layers.forEach(function(layer) {
            layer.forEach(function(image) {
                image.draw(time, ctx, scale_factor);
            })
        })

        resolve()
    })
}