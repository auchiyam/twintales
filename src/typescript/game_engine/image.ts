// Image class is the abstract class for all images that will be used
// Important to note that image will only be drawn if there's any pending actions for the image.  Meaning if the image wasn't doing anything, it won't appear on the screen.
export abstract class Image {
    readonly actions: Array<Action>

    constructor() {
        this.actions = [];
    }
    abstract draw(time: number): void;
    
    // Commands for the images, based on osu storyboard commands
    // https://osu.ppy.sh/help/wiki/Storyboard_Scripting/Commands
    // The valid commands are:
    //  - func(start_time, start_value)
    //  - func(start_time, end_time, start_value, end_value)
    //  - func(ease_type, ease_function if Custom, start_time, end_time, start_value, end_value)
    // the values depends on which function you use.  For example, the arity of move function's value is 2 because it must keep track of both x and y while fade function is only 1, for opacity of the image.
    //  - ex: move(start_time, end_time, x0, y0, x1, y1)
    //  - ex: fade(start_time, end_time, opacity0, opacity1)
    // list of value arities:
    //  - move:     2 -- (x, y)
    //  - fade:     1 -- (opacity)
    //  - scale:    1 -- (multiplier)
    //  - rotate:   1 -- (angle (in radian))
    //  - color:    3 -- (red, green, blue)
    //  - move_x:   1 -- (x)
    //  - move_y:   1 -- (y)
    //  - vector:   2 -- (x multiplyer, y multiplier)
    //  - vector_x: 1 -- (x multiplier)
    //  - vector_y: 1 -- (y multiplier)
    move(...args: Array<number | Ease | ((t: number) => number)>) {
        let act: Action = this.make_actions(2, ActionType.Move, args);

        this.actions.push(act);
    }

    fade(...args: Array<number | Ease | ((t: number) => number)>) {
        let act: Action = this.make_actions(1, ActionType.Fade, args);

        this.actions.push(act);
    }

    scale(...args: Array<number | Ease | ((t: number) => number)>) {
        let act: Action = this.make_actions(1, ActionType.Scale, args);

        this.actions.push(act);
    }

    rotate(...args: Array<number | Ease | ((t: number) => number)>) {
        let act: Action = this.make_actions(1, ActionType.Rotate, args);

        this.actions.push(act);
    }

    color(...args: Array<number | Ease | ((t: number) => number)>) {
        let act: Action = this.make_actions(3, ActionType.Color, args);

        this.actions.push(act);
    }

    move_x(...args: Array<number | Ease | ((t: number) => number)>) {
        let act: Action = this.make_actions(1, ActionType.MoveX, args);

        this.actions.push(act);
    }

    move_y(...args: Array<number | Ease | ((t: number) => number)>) {
        let act: Action = this.make_actions(1, ActionType.MoveY, args);

        this.actions.push(act);
    }

    vector(...args: Array<number | Ease | ((t: number) => number)>) {
        let act: Action = this.make_actions(2, ActionType.Vector, args);

        this.actions.push(act);
    }

    vector_x(...args: Array<number | Ease | ((t: number) => number)>) {
        let act: Action = this.make_actions(1, ActionType.VectorX, args);

        this.actions.push(act);
    }

    vector_y(...args: Array<number | Ease | ((t: number) => number)>) {
        let act: Action = this.make_actions(1, ActionType.VectorY, args);

        this.actions.push(act);
    }

    movef(ease: Ease = Ease.Linear, ease_function: (t: number) => number = EaseFunction.get_func(ease), start_time: number, end_time: number, func: (t: number) => Array<number>) {
        if (ease != Ease.Custom) {

        }

        let act: Action = new Action(ActionType.MoveF, ease, start_time, end_time, undefined, undefined, func);

        this.actions.push(act);
    }

    fadef(ease: Ease = Ease.Linear, start_time: number, end_time: number, func: (t: number) => Array<number>) {
        let act: Action = new Action(ActionType.FadeF, ease, start_time, end_time, undefined, undefined, func);

        this.actions.push(act);
    }

    scalef(ease: Ease = Ease.Linear, start_time: number, end_time: number, func: (t: number) => Array<number>) {
        let act: Action = new Action(ActionType.ScaleF, ease, start_time, end_time, undefined, undefined, func);

        this.actions.push(act);
    }

    rotatef(ease: Ease = Ease.Linear, start_time: number, end_time: number, func: (t: number) => Array<number>) {
        let act: Action = new Action(ActionType.RotateF, ease, start_time, end_time, undefined, undefined, func);

        this.actions.push(act);
    }

    colorf(ease: Ease = Ease.Linear, start_time: number, end_time: number, func: (t: number) => Array<number>) {
        let act: Action = new Action(ActionType.ColorF, ease, start_time, end_time, undefined, undefined, func);

        this.actions.push(act);
    }

    move_xf(ease: Ease = Ease.Linear, start_time: number, end_time: number, func: (t: number) => Array<number>) {
        let act: Action = new Action(ActionType.MoveXF, ease, start_time, end_time, undefined, undefined, func);

        this.actions.push(act);
    }

    move_yf(ease: Ease = Ease.Linear, start_time: number, end_time: number, func: (t: number) => Array<number>) {
        let act: Action = new Action(ActionType.MoveYF, ease, start_time, end_time, undefined, undefined, func);

        this.actions.push(act);
    }

    vectorf(ease: Ease = Ease.Linear, start_time: number, end_time: number, func: (t: number) => Array<number>) {
        let act: Action = new Action(ActionType.VectorF, ease, start_time, end_time, undefined, undefined, func);

        this.actions.push(act);
    }

    vector_xf(ease: Ease = Ease.Linear, start_time: number, end_time: number, func: (t: number) => Array<number>) {
        let act: Action = new Action(ActionType.VectorXF, ease, start_time, end_time, undefined, undefined, func);

        this.actions.push(act);
    }

    vector_yf(ease: Ease = Ease.Linear, start_time: number, end_time: number, func: (t: number) => Array<number>) {
        let act: Action = new Action(ActionType.VectorYF, ease, start_time, end_time, undefined, undefined, func);

        this.actions.push(act);
    }

    private make_actions(num_args: number, type: ActionType, arg: Array<number | Ease | ((t: number) => number)>) {
        let start_time: number = -1, end_time: number = -1, start_val: Array<number> = [], end_val: Array<number> = [], ease: Ease = Ease.Linear, ease_function: (t: number) => number;

        if (arg.length == (1 + num_args)) {
            start_time = <number> arg[0];
            end_time = start_time;

            for (let i = 1; i < num_args + 1; i++) {
                start_val.push(<number> arg[i]);
            }
            end_val = start_val;
        }

        else if (arg.length == (2 + num_args * 2)) {
            start_time = <number> arg[0];
            end_time = <number> arg[1];

            for (let i = 2; i < 2 + num_args; i++) {
                start_val.push(<number> arg[i]);
            }

            for (let i = 2 + num_args; i < 2 + num_args * 2; i++) {
                end_val.push(<number> arg[i]);
            }
        }

        else if (arg.length == (3 + num_args * 2)) {
            ease = <Ease> arg[0];
            let offset = 0;

            if (ease == Ease.Custom) {
                offset += 1;
                ease_function = <(t: number) => number> arg[1]
            }

            start_time = <number> arg[1 + offset];
            end_time = <number> arg[2 + offset];

            

            for (let i = 3 + offset; i < 3 + num_args + offset; i++) {
                start_val.push(<number> arg[i]);
            }

            for (let i = 3 + num_args + offset; i < 3 + num_args * 2 + offset; i++) {
                end_val.push(<number> arg[i]);
            }
        }

        else {
            // Argument error
            let error_msg = "found ${num_args} arguments, but expected ${1+num_args}, ${2+num_args*2}, ${3+num_args*2 + offset}, or ${3+num_args*2 + 1} arguments.";
            new Error(error_msg);
        }

        return new Action(type, ease, start_time, end_time, start_val, end_val);
    }
}

// Sprite class is for images with actual images to work with
export class Sprite extends Image {
    constructor(readonly image_file: string) {
        super();
    }
    
    draw(time: number) {

    }
}

// Vector class is intended for images that is dynamically drawn
export class Vector extends Image {
    constructor() {
        super();
    }
    
    draw(time: number) {

    }
}

// the structure to keep track of each actions the images must perform
// list of properties:
//  - type: type of action, such as move and fade
//  - ease: type of ease function used
//  - start_time: time the action activates
//  - end_time: time the action ends
//  - start_value: the value the action begins on
//  - end_value: the value the action ends up on after the transformation
//  - transformation: the function that, given t within [0,1] denoting the distance between start_time and end_time the current time rests on, returns appropriate value for the current time based on action type
export class Action {
    constructor(readonly type: ActionType, readonly ease: Ease, readonly start_time: number, readonly end_time: number, start_value: Array<number> = [0], end_value: Array<number> = [0], readonly transformation: (t: number) => Array<number> = function(t: number) { return [] }, readonly ease_function: (t: number) => number = function(t: number) { return 0 }) {

        // If it's a linear movement from start to end value, figure out the transformation function based on that
        if (this.transformation(0).length > 0) {
            this.transformation = (t: number) => {
                let new_values = [];

                for (let i = 0; i < start_value.length; i++) {
                    let c = end_value[i] - start_value[i];
                    new_values.push(c * t + start_value[i]);
                }

                return new_values
            }
        }

        // If the ease type is not Custom, assign the correct function on ease_function
        if (this.ease != Ease.Custom) {
            this.ease_function = EaseFunction.get_func(this.ease);
        }
    }

    //Given the time, return the value the image should be at.  For example, the move action will return the x and y location of the image
    get_value(t: number) {
        // first check if the number is within start and end and raise error otherwise
        if (!(this.start_time < t && t < this.end_time)) {
            new Error("${t} is not between ${this.start_time} and ${this.end_time}");
        }

        // get the % represention of t
        let percentage = (t - this.start_time) / (this.end_time - this.start_time);

        // adjust percentage based on the easing function
        let new_t = this.ease_function(percentage);

        return this.transformation(new_t);
    }
}

// Returns a function that calculates the new t based on the type of easing provided.  Assumes t is [0,1], c = 1, and b = 0 because the ease function will be used to distort the time instead of actual values
// https://github.com/danro/jquery-easing/blob/master/jquery.easing.js
//  - implementation of all the common ease functions.
export class EaseFunction {
    static get_func(ease: Ease) {
        let func: ((t: number) => number) = (t: number) => {
            return t;
        };

        switch (ease) {
            case Ease.Linear:
                // do nothing as it is the default
                break;

            case Ease.QuadIn:
                func = (t: number) => {
                    return t*t;
                }
                break;
            case Ease.QuadOut:
                func = (t: number) => {
                    return t*(t-2);
                }
                break;
            case Ease.QuadInOut:
                func = (t: number) => {
                    t *= 2
                    if (t < 1) {
                        return (t*t) * .5;
                    } else {
                        t--;                        
                        return (t*(t-2) - 1) * -.5;
                    }
                }
                break;

            case Ease.CubicIn:
                func = (t: number) => {
                    return t*t*t;
                }
                break;
            case Ease.CubicOut:
                func = (t: number) => {
                    t--;
                    return (t*t*t + 1);
                }
                break;
            case Ease.CubicInOut:
                func = (t: number) => {
                    t *= 2
                    if (t < 1) {
                        return t*t*t * .5;
                    }
                    else {
                        t -= 2;
                        return (t*t*t + 2) * .5;
                    }
                }
                break;

            case Ease.QuartIn:
                func = (t: number) => {
                    return t*t*t*t;
                }
                break;
            case Ease.QuartOut:
                func = (t: number) => {
                    t--;
                    return (t*t*t*t - 1) * -1;
                }
                break;
            case Ease.QuartInOut:
                func = (t: number) => {
                    t *= 2;
                    if (t < 1) {
                        return t*t*t*t*.5;
                    }
                    else {
                        t -= 2;
                        return (t*t*t*t - 2) * -.5;
                    }
                }
                break;

            case Ease.QuintIn:
                func = (t: number) => {
                    return t*t*t*t*t;
                }
                break;
            case Ease.QuintOut:
                func = (t: number) => {
                    t--;
                    return t*t*t*t*t + 1;
                }
                break;
            case Ease.QuintInOut:
                func = (t: number) => {
                    t *= 2;
                    if (t < 1) {
                        return t*t*t*t*t * .5;
                    }
                    else {
                        t -= 2;
                        return (t*t*t*t*t + 2) * .5
                    }
                }
                break;

            case Ease.SinIn:
                func = (t: number) => {
                    return -1 * Math.cos(t * (Math.PI/2)) + 1
                }
                break;
            case Ease.SinOut:
                func = (t: number) => {
                    return Math.sin(t * (Math.PI/2))
                }
                break;
            case Ease.SinInOut:
                func = (t: number) => {
                    return .5 * (Math.cos(Math.PI * t) - 1)
                }
                break;

            case Ease.ExpIn:
                func = (t: number) => {
                    if (t == 0) {
                        return 0
                    }
                    else {
                        return Math.pow(2, 10 * (t-1))
                    }
                }
                break;
            case Ease.ExpOut:
                func = (t: number) => {
                    if (t == 1) {
                        return 1
                    }
                    else {
                        return -Math.pow(2, -10 * t) + 1
                    }
                }
                break;
            case Ease.ExpInOut:
                func = (t: number) => {
                    t *= 2
                    if (t == 0) {
                        return 0
                    }
                    else if (t == 2) {
                        return 1
                    }
                    else if (t < 1) {
                        return .5 * Math.pow(2, 10 * (t-1))
                    }
                    else {
                        t--;
                        return .5 * (-Math.pow(2, -10 * t) + 2)
                    }
                }
                break;

            case Ease.CircIn:
                func = (t: number) => {
                    return -1 * (Math.sqrt(1 - t*t) - 1);
                }
                break;
            case Ease.CircOut:
                func = (t: number) => {
                    t--;
                    return Math.sqrt(1 - t * t) - 1
                }
                break;
            case Ease.CircInOut:
                func = (t: number) => {
                    t *= 2
                    if (t < 1) {
                        return -.5 * (Math.sqrt(1 - t*t) - 1)
                    }
                    else {
                        t -= 2
                        return .5 * (Math.sqrt(1 - t * t) + 1)
                    }
                }
                break;

            case Ease.BackIn:
                func = (t: number) => {
                    let s = 1.70158
                    return t * t * ((s + 1) * t - s)
                }
                break;
            case Ease.BackOut:
                func = (t: number) => {
                    let s = 1.70158
                    t--;
                    return t * t * ((s + 1) * t + s) + 1
                }
                break;
            case Ease.BackInOut:
                func = (t: number) => {
                    let s = 1.70158
                    t *= 2
                    s *= 1.525
                    if (t < 1) {
                        return .5 * (t * t * ((s + 1) * t - s))
                    }
                    else {
                        return .5 * (t * t * ((s + 1) * t + s) + 2)
                    }
                }
                break;

            case Ease.BounceIn:
                func = (t: number) => {
                    t = 1 - t
                    return 1 - this.get_func(Ease.BounceOut)(t)
                }
                break;
            case Ease.BounceOut:
                func = (t: number) => {
                    if (t < 1/2.75) {
                        return 7.5625 * t * t
                    }
                    else if (t < 2 / 2.75) {
                        t -= 1.5/2.75
                        return 7.5625 * t * t + .75
                    }
                    else if (t < 2.5 / 2.75) {
                        t -= 2.25/2.75
                        return 7.5625 * t * t + .9375
                    }
                    else {
                        t -= 2.625
                        return 7.5625 * t * t + .984375
                    }
                }
                break;
            case Ease.BounceInOut:
                func = (t: number) => {
                    if (t < .5) {
                        return this.get_func(Ease.BounceIn)(t * 2) * .5
                    }
                    else {
                        return this.get_func(Ease.BounceOut)(t * 2 - 1) * .5
                    }
                }
                break;

            default:
                new Error("This ease function has not been defined in get_func()");
                break;
        }

        return func;
    }
}

// Ease enum is to use the commonly used ease function.
export enum Ease {
    Linear,

    QuadIn,
    QuadOut,
    QuadInOut,

    CubicIn,
    CubicOut,
    CubicInOut,

    QuartIn,
    QuartOut,
    QuartInOut,

    QuintIn,
    QuintOut,
    QuintInOut,

    SinIn,
    SinOut,
    SinInOut,

    ExpIn,
    ExpOut,
    ExpInOut,

    CircIn,
    CircOut,
    CircInOut,

    //ElasticIn,
    //ElasticOut,
    //ElasticInOut,

    BackIn,
    BackOut,
    BackInOut,

    BounceIn,
    BounceOut,
    BounceInOut,

    Custom,
}

// ActionType enum is list of all actions an image can perform
export enum ActionType {
    Move,
    Fade,
    Scale,
    Rotate,
    Color,
    MoveX,
    MoveY,
    Vector,
    VectorX,
    VectorY,

    MoveF,
    FadeF,
    ScaleF,
    RotateF,
    ColorF,
    MoveXF,
    MoveYF,
    VectorF,
    VectorXF,
    VectorYF,
}