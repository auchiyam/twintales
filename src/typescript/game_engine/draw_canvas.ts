import { GameState } from './state'

// Given the current state of the game, draw on canvas appropriately then return the amount of time took to complete it
export function draw(state: GameState) {
    let start_time = state.time;
    let canvas = state.canvas
    let ctx = state.context;
    let layers = state.images;

    // get the scale factor of width and height and average it
    let scale_factor = ((canvas.width / 1920.0) + (canvas.height / 1080.0)) / 2

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    layers.forEach(function(layer) {
        layer.forEach(function(image) {
            image.draw(state.time, ctx, scale_factor);
        })
    })

    return Date.now() - start_time;
}