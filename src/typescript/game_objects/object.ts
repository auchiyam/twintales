import { GameImage } from "../game_engine/image";
import { Transformable } from '../game_engine/transformable'

export abstract class GameObject extends Transformable {
    public image!: GameImage
    constructor(
        public hitbox: (number | string)[][],
        public destroy: () => void,
        public id: number
    ) {
        super()
    }

    // initialize everything the game object requires
    abstract async initialize(): Promise<{}>
    // draw the object on the screen
    abstract update(dt: number): void
}