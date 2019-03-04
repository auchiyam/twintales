import { GameState } from './state'

// Given the current state of the game, draw on canvas appropriately then return the amount of time took to complete it
export function draw(state: GameState) {
    let start_time = state.time;
    let canvas = state.canvas;

    return Date.now() - start_time;
}