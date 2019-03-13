import { Game } from './game';
import { State } from '../game_engine/state';
import { get_assets } from '../api/api'
import { Sprite, GameImage, DynamicSprite } from '../game_engine/image';
import { sleep, measureTextHeight } from '../game_engine/general';
import { draw } from '../game_engine/draw_canvas'
import { resize_canvas } from '../game_engine/initialize';

// handles everything in the title screen
export class TitleScreen extends Game {
    private cursor: number;
    private selected: boolean;
    private next_state: State;
    private images: any;
    private options: string[] = ["Start", "Practice", "Replay", "Ranking", "Option"];

    constructor(canvas: HTMLCanvasElement) {
        super(canvas, <CanvasRenderingContext2D> canvas.getContext("2d"), [], canvas.width, canvas.height);

        this.cursor = 0;
        this.selected = false;
        this.next_state = State.PlayGame;
        this.images = {};
    }

    async initialize() {
        // load all images
        let val = await get_assets("all", "title_page");
        let asset_count = 0;
        let max = val.count;

        // returns the promise that says all the assets has been loaded for the title screen
        return new Promise(resolve => {
            // get all the images
            for (let key in val.assets.images) {
                if (val.assets.images.hasOwnProperty(key)) {
                    let asset = val.assets.images[key]

                    let img:HTMLImageElement = new Image();

                    img.src = asset;

                    img.onload = () => {
                        asset_count += 1;

                        // if all the assets has been loaded, resolve it
                        if (asset_count == max) {
                            resolve();
                        }
                    }

                    this.images[key] = img;
                }
            }

            // get all the music: TODO
            // .. logic ..
        // after all the images are loaded, draw the title page
        }).then(resolve => {
            this.layers.push([]);                   // background layer
            this.layers.push(this.draw_cursor());   // cursor layer
            this.layers.push(this.draw_title());    // foreground layer
        })
    }

    async start() {       
        // begin accepting user inputs
        window.addEventListener("resize", () => {
            resize_canvas(this.canvas);

            this.width = this.canvas.width;
            this.height = this.canvas.height;
        })

        let key_held: number[] = [];

        window.addEventListener("keydown", (e) => {
            e = e || window.event;

            let key = e.key;

            switch (key) {
                case "Left":
                case "ArrowLeft":
                    if (!key_held.includes(0)) {
                        this.move_cursor(0)
                    }
                    key_held.push(0)
                    break;
                case "Right":
                case "ArrowRight":
                    if (!key_held.includes(3)) {
                        this.move_cursor(3)
                    }
                    key_held.push(3)
                    break;
                case "Enter":
                    this.selected = true;
                    break;
            }
        });

        window.addEventListener("keyup", (e) => {
            let v: number;

            switch (e.key) {
                case "Left":
                case "ArrowLeft":
                    v = 0
                    break;
                case "Right":
                case "ArrowRight":
                    v = 3
                    break;
            }

            key_held = key_held.filter((val) => {
                return val != v
            })
        });

        // main loop
        // keep track of the beginning time so that curr_time will be at the right time
        let beginning_loop
        let subtime = 0

        let beginning = window.performance.now()
        let sub_beginning = beginning

        while (!this.selected) {
            // keep track of the beginning of the loop
            beginning_loop = window.performance.now()

            // do the logic asynchronously
            await Promise.all([
                draw(0, this.ctx, this.layers, this.width, this.height)
            ]);

            if (subtime > 200) {
                sub_beginning = window.performance.now()

                // with chance, create a line at the background to make title cooler

                // randomly get x for the laser

                // draw a line at that x and make it slowly fade away

                // ideas: rainbow color?  slanted?
            }

            // if everything finished before the designated time, take a break
            let sleep_time = 17 - (window.performance.now() - beginning_loop)

            if (sleep_time > 0) {
                await sleep(sleep_time);
            }

            // now that the loop finished, update the curr_time for the next loop
            subtime = window.performance.now() - sub_beginning
        }

        // return the new state so that main can redirect the user there
        return this.next_state
    }

    private draw_title() {
        let spr: GameImage[] = []

        // draw logo
        let logo: Sprite = new Sprite(this.images['logo']);

        logo.move(1920 / 2, 1080 / 3);
        logo.scale(.7);

        spr.push(logo);

        let step = 1920 / (this.options.length + 1)

        // draw the texts
        let os = [];
        let font_family = "aleo", font_size = 50, font_type = "normal"

        for (let i = 0; i < this.options.length; i++) {
            let o: DynamicSprite = new DynamicSprite((ctx: CanvasRenderingContext2D, t: number) => {
                ctx.font = `${font_type} ${font_size}px ${font_family}`
    
                if (i != this.cursor) {
                    ctx.fillStyle = "#202020";
                }
                else {
                    ctx.fillStyle = "#EEE"
                }
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                ctx.fillText(this.options[i], 0, 0);
            })

            os.push(o);
        }

        // then move the texts to the right coordinates
        for (let i = 0; i < os.length; i++) {
            os[i].move(0, step * (i + 1), 1080 / 4 * 3);
        }

        spr = spr.concat(os)

        return spr;
    }

    private draw_cursor() {
        let cs = new DynamicSprite((ctx, t) => {
            let width = 1920 / 8, height = 1080 / 3 / 3 / 1.5;
            ctx.fillStyle = "#202020"
            ctx.fillRect(- width / 2, - height / 2, width, height);
        })

        let step = 1920 / (this.options.length + 1)

        cs.move(step * (this.cursor + 1), 1080 / 4 * 3)

        return [cs]
    }

    // dir: left, down, up, right in that order, others for initialization
    private move_cursor(dir: number) {
        let offset = dir === 0 ? -1 : 1
        let n = this.cursor + offset
        let m = this.options.length

        this.cursor = ((n % m) + m) % m

        let step = 1920 / (this.options.length + 1)

        let cs: DynamicSprite = <DynamicSprite> this.layers[1][0]

        cs.move(step * (this.cursor + 1), 1080 / 4 * 3)
    }
}