// Image class is the abstract class for all images that will be used
// Important to note that image will only be drawn if there's any pending actions for the image.  Meaning if the image wasn't doing anything, it won't appear on the screen.
export abstract class GameImage {
    readonly actions: Array<Action>
    public distort: (ctx: CanvasRenderingContext2D, t: number) => void

    constructor(
        readonly show_inactive: boolean,
        protected prev_x: number = 1920/2,
        protected prev_y: number = 1080/2,
        protected prev_scx: number = 1,
        protected prev_scy: number = 1,
        protected prev_rad: number = 0,
        protected prev_opac: number = 1
    ) {
        this.actions = [];
        this.distort = () => {}
    }
    
    abstract draw(time: number, ctx: CanvasRenderingContext2D, scale: number) : void;

    get_transformation(time: number, ctx: CanvasRenderingContext2D, scale: number) {
        let has_action = false;
        let x = this.prev_x * scale, y = this.prev_y * scale, scx = this.prev_scx * scale, scy = this.prev_scy * scale, rad = this.prev_rad, opac = this.prev_opac;
        for (var i = 0; i < this.actions.length; i++) {
            let curr_action: Action = this.actions[i]
            // since the action is ordered by start time, the moment the time value goes below the current action's start time, we can end the loop because the remaining actions will be greater
            if (time < curr_action.start_time) {
                break;
            }

            // only concerned with the actions that takes place on time
            if (curr_action.start_time <= time && time <= curr_action.end_time ) {
                has_action = true;
                let type = curr_action.type
                // move the object
                if (type.substring(0, 4) === "Move") {
                    let val: number[] = <number[]> curr_action.get_value(time);

                    if (val.length === 1) {
                        if (type.substring(4, 5) === "X") {
                            x = val[0]
                            this.prev_x = x;
                        }
                        else {
                            y = val[0]
                            this.prev_y = y;
                        }
                    } else {
                        x = val[0] * scale;
                        y = val[1] * scale;

                        this.prev_x = val[0];
                        this.prev_y = val[1];
                    }
                }

                if (type.substring(0, 5) === "Scale") {
                    let val: number[] = <number[]> curr_action.get_value(time);

                    scx = val[0] * scale;
                    scy = val[0] * scale;

                    this.prev_scx = val[0]
                    this.prev_scy = val[0]
                }

                if (type.substring(0, 6) === "Rotate") {
                    let val: number[] = <number[]> curr_action.get_value(time);

                    rad = val[0];

                    this.prev_rad = rad;
                }

                if (type.substring(0, 6) === "Vector") {
                    let val: number[] = <number[]> curr_action.get_value(time);

                    if (val.length === 1) {
                        if (type.substring(6, 7) === "X") {
                            scx = val[0] * scale;
                            this.prev_scx = val[0]
                        }
                        else {
                            scy = val[0] * scale;
                            this.prev_scy = val[0]
                        }
                    } else {
                        scx = val[0] * scale;
                        scy = val[1] * scale;

                        this.prev_scx = val[0]
                        this.prev_scy = val[1]
                    }
                }

                if (type.substring(0, 4) === "Fade") {
                    let val: number[] = <number[]> curr_action.get_value(time);

                    opac = val[0];
                }
            }
        }

        return <[boolean, number, number, number, number, number, number]> [has_action, x, y, scx, scy, rad, opac];
    }
    
    // Commands for the images, based on osu storyboard commands
    // https://osu.ppy.sh/help/wiki/Storyboard_Scripting/Commands
    // The valid commands are:
    //  - func(start_value)
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

        // get all actions relating to this function
        let relevant_action: Action[] = this.actions.filter((val) => {
            return val.type.toString().substring(0, 4) === "Move"
        })

        // add the action to this.actions
        this.add_action(act, relevant_action);
    }

    fade(...args: Array<number | Ease | ((t: number) => number)>) {
        let act: Action = this.make_actions(1, ActionType.Fade, args);

        // get all actions relating to this function
        let relevant_action = this.actions.filter((val) => { return val.type.toString().substring(0, 4) === "Fade" })

        this.add_action(act, relevant_action);
    }

    scale(...args: Array<number | Ease | ((t: number) => number)>) {
        let act: Action = this.make_actions(1, ActionType.Scale, args);

        // get all actions relating to this function
        let relevant_action = this.actions.filter((val) => { return val.type.toString().substring(0, 5) === "Scale" || val.type.toString().substring(0, 6) === "Vector" })

        this.add_action(act, relevant_action);
    }

    rotate(...args: Array<number | Ease | ((t: number) => number)>) {
        let act: Action = this.make_actions(1, ActionType.Rotate, args);

        // get all actions relating to this function
        let relevant_action = this.actions.filter((val) => { return val.type.toString().substring(0, 6) === "Rotate" })

        this.add_action(act, relevant_action);
    }

    color(...args: Array<number | Ease | ((t: number) => number)>) {
        let act: Action = this.make_actions(3, ActionType.Color, args);

        // get all actions relating to this function
        let relevant_action = this.actions.filter((val) => { return val.type.toString().substring(0, 5) === "Color" })

        this.add_action(act, relevant_action);
    }

    move_x(...args: Array<number | Ease | ((t: number) => number)>) {
        let act: Action = this.make_actions(1, ActionType.MoveX, args);

        // get all actions relating to this function
        let relevant_action = this.actions.filter((val) => { return val.type.toString().substring(0, 4) === "Move" })

        this.add_action(act, relevant_action);
    }

    move_y(...args: Array<number | Ease | ((t: number) => number)>) {
        let act: Action = this.make_actions(1, ActionType.MoveY, args);

        // get all actions relating to this function
        let relevant_action = this.actions.filter((val) => { return val.type.toString().substring(0, 4) === "Move" })

        this.add_action(act, relevant_action);
    }

    vector(...args: Array<number | Ease | ((t: number) => number)>) {
        let act: Action = this.make_actions(2, ActionType.Vector, args);

        // get all actions relating to this function
        let relevant_action = this.actions.filter((val) => { return val.type.toString().substring(0, 5) === "Scale" || val.type.toString().substring(0, 6) === "Vector" })

        this.add_action(act, relevant_action);
    }

    vector_x(...args: Array<number | Ease | ((t: number) => number)>) {
        let act: Action = this.make_actions(1, ActionType.VectorX, args);

        // get all actions relating to this function
        let relevant_action = this.actions.filter((val) => { return val.type.toString().substring(0, 5) === "Scale" || val.type.toString().substring(0, 6) === "Vector" })

        this.add_action(act, relevant_action);
    }

    vector_y(...args: Array<number | Ease | ((t: number) => number)>) {
        let act: Action = this.make_actions(1, ActionType.VectorY, args);

        // get all actions relating to this function
        let relevant_action = this.actions.filter((val) => { return val.type.toString().substring(0, 5) === "Scale" || val.type.toString().substring(0, 6) === "Vector" })

        this.add_action(act, relevant_action);
    }

    movef(ease: Ease = Ease.Linear, ease_function: (t: number) => number = EaseFunction.get_func(ease), start_time: number, end_time: number, func: (t: number) => Array<number>) {
        let act: Action = new Action(ActionType.MoveF, ease, start_time, end_time, undefined, undefined, func, ease_function);

        // get all actions relating to this function
        let relevant_action = this.actions.filter((val) => { return val.type.toString().substring(0, 4) === "Move" })

        this.add_action(act, relevant_action);
    }

    fadef(ease: Ease = Ease.Linear, ease_function: (t: number) => number = EaseFunction.get_func(ease), start_time: number, end_time: number, func: (t: number) => Array<number>) {
        let act: Action = new Action(ActionType.FadeF, ease, start_time, end_time, undefined, undefined, func, ease_function);

        // get all actions relating to this function
        let relevant_action = this.actions.filter((val) => { return val.type.toString().substring(0, 4) === "Fade" })

        this.add_action(act, relevant_action);
    }

    scalef(ease: Ease = Ease.Linear, ease_function: (t: number) => number = EaseFunction.get_func(ease), start_time: number, end_time: number, func: (t: number) => Array<number>) {
        let act: Action = new Action(ActionType.ScaleF, ease, start_time, end_time, undefined, undefined, func, ease_function);

        // get all actions relating to this function
        let relevant_action = this.actions.filter((val) => { return val.type.toString().substring(0, 5) === "Scale" || val.type.toString().substring(0, 6) === "Vector" })

        this.add_action(act, relevant_action);
    }

    rotatef(ease: Ease = Ease.Linear, ease_function: (t: number) => number = EaseFunction.get_func(ease), start_time: number, end_time: number, func: (t: number) => Array<number>) {
        let act: Action = new Action(ActionType.RotateF, ease, start_time, end_time, undefined, undefined, func, ease_function);

        // get all actions relating to this function
        let relevant_action = this.actions.filter((val) => { return val.type.toString().substring(0, 6) === "Rotate" })

        this.add_action(act, relevant_action);
    }

    colorf(ease: Ease = Ease.Linear, ease_function: (t: number) => number = EaseFunction.get_func(ease), start_time: number, end_time: number, func: (t: number) => Array<number>) {
        let act: Action = new Action(ActionType.ColorF, ease, start_time, end_time, undefined, undefined, func, ease_function);

        // get all actions relating to this function
        let relevant_action = this.actions.filter((val) => { return val.type.toString().substring(0, 5) === "Color" })

        this.add_action(act, relevant_action);
    }

    move_xf(ease: Ease = Ease.Linear, ease_function: (t: number) => number = EaseFunction.get_func(ease), start_time: number, end_time: number, func: (t: number) => Array<number>) {
        let act: Action = new Action(ActionType.MoveXF, ease, start_time, end_time, undefined, undefined, func, ease_function);

        // get all actions relating to this function
        let relevant_action = this.actions.filter((val) => { return val.type.toString().substring(0, 4) === "Move" })

        this.add_action(act, relevant_action);
    }

    move_yf(ease: Ease = Ease.Linear, ease_function: (t: number) => number = EaseFunction.get_func(ease), start_time: number, end_time: number, func: (t: number) => Array<number>) {
        let act: Action = new Action(ActionType.MoveYF, ease, start_time, end_time, undefined, undefined, func, ease_function);

        // get all actions relating to this function
        let relevant_action = this.actions.filter((val) => { return val.type.toString().substring(0, 4) === "Move" })

        this.add_action(act, relevant_action);
    }

    vectorf(ease: Ease = Ease.Linear, ease_function: (t: number) => number = EaseFunction.get_func(ease), start_time: number, end_time: number, func: (t: number) => Array<number>) {
        let act: Action = new Action(ActionType.VectorF, ease, start_time, end_time, undefined, undefined, func, ease_function);

        // get all actions relating to this function
        let relevant_action = this.actions.filter((val) => { return val.type.toString().substring(0, 5) === "Scale" || val.type.toString().substring(0, 6) === "Vector" })

        this.add_action(act, relevant_action);
    }

    vector_xf(ease: Ease = Ease.Linear, ease_function: (t: number) => number = EaseFunction.get_func(ease), start_time: number, end_time: number, func: (t: number) => Array<number>) {
        let act: Action = new Action(ActionType.VectorXF, ease, start_time, end_time, undefined, undefined, func, ease_function);

        // get all actions relating to this function
        let relevant_action = this.actions.filter((val) => { return val.type.toString().substring(0, 5) === "Scale" || val.type.toString().substring(0, 6) === "Vector" })

        this.add_action(act, relevant_action);
    }

    vector_yf(ease: Ease = Ease.Linear, ease_function: (t: number) => number = EaseFunction.get_func(ease), start_time: number, end_time: number, func: (t: number) => Array<number>) {
        let act: Action = new Action(ActionType.VectorYF, ease, start_time, end_time, undefined, undefined, func, ease_function);

        // get all actions relating to this function
        let relevant_action = this.actions.filter((val) => { return val.type.toString().substring(0, 5) === "Scale" || val.type.toString().substring(0, 6) === "Vector" })

        this.add_action(act, relevant_action);
    }

    private add_action(act: Action, relevant_action: Action[]) {
        // if the action has no duration with 0, replace it with the new one, as it'll be used for continuous animation
        if (act.start_time == 0 && act.end_time == 0) {
            let replaced: boolean = false

            this.actions.forEach((action, ind) => {
                if (action.start_time == act.start_time && action.end_time == act.end_time) {
                    // make sure the action is a relevant action.
                    for (let relevant of relevant_action) {
                        // if the actions have the same start and end time, it is considered equal because there can't be any overlaps between actions
                        if (relevant.start_time == act.start_time && relevant.end_time == act.end_time) {
                            this.actions[ind] = act;
                            replaced = true
                        }
                    }
                }
            });
            if (!replaced) {
                // new action, so add it to the beginning
                this.actions.unshift(act)
            }
            return;
        }

        // see if the new action happens while other actions of the similar command are working
        relevant_action.forEach((val) => {
            let a0 = val.start_time, a1 = val.end_time, b0 = act.start_time, b1 = act.end_time;
            // found intersection
            if (!(b0 > a1 || a0 > b1)) {
                new Error("Invalid time input.  There are already move action in this time interval")
            }
        })

        // add it to the spot that does not break the order of the array, which is sorted by the starting time
        let added: boolean = false;
        for (let i = 0; i < this.actions.length; i++) {
            if (act.start_time < this.actions[i].start_time) {
                added = true;
                this.actions.splice(i, 0, act)
                break;
            }
        }

        if (!added) {
            this.actions.push(act);
        }
    }

    private make_actions(num_args: number, type: ActionType, arg: Array<number | Ease | ((t: number) => number)>) {
        let start_time: number = -1, end_time: number = -1, start_val: Array<number> = [], end_val: Array<number> = [], ease: Ease = Ease.Linear, ease_function: ((t: number) => number) | undefined = undefined;

        if (arg.length === num_args) {
            start_time = 0;
            end_time = start_time;

            for (let i = 0; i < num_args; i++) {
                start_val.push(<number> arg[i]);
            }
            end_val = start_val;
        }

        else if (arg.length === (1 + num_args)) {
            start_time = <number> arg[0];
            end_time = start_time;

            for (let i = 1; i < num_args + 1; i++) {
                start_val.push(<number> arg[i]);
            }
            end_val = start_val;
        }

        else if (arg.length === (2 + num_args * 2)) {
            start_time = <number> arg[0];
            end_time = <number> arg[1];

            for (let i = 2; i < 2 + num_args; i++) {
                start_val.push(<number> arg[i]);
            }

            for (let i = 2 + num_args; i < 2 + num_args * 2; i++) {
                end_val.push(<number> arg[i]);
            }
        }

        else if (arg.length === (3 + num_args * 2)) {
            ease = <Ease> arg[0];
            let offset = 0;

            if (ease === Ease.Custom) {
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
            let error_msg = `found ${num_args} arguments, but expected ${num_args}, ${1+num_args}, ${2+num_args*2}, ${3+num_args*2}, or ${3+num_args*2 + 1} arguments.`;
            new Error(error_msg);
        }

        return new Action(type, ease, start_time, end_time, start_val, end_val, undefined, ease_function);
    }
}

// Sprite class is for images with actual images to work with
export class Sprite extends GameImage {
    constructor(readonly image: HTMLImageElement, show_inactive: boolean = true) {
        super(show_inactive);
    }
    
    draw(time: number, ctx: CanvasRenderingContext2D, sf: number) {
        let t: any = this.get_transformation(time, ctx, sf);
        let [has_action, x, y, scx, scy, rad, opac] = this.get_transformation(time, ctx, sf)

        //console.log([has_action, x, y, scx, scy, rad, opac])

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
        let t: any = this.get_transformation(time, ctx, sf);
        let [has_action, x, y, scx, scy, rad, opac] = this.get_transformation(time, ctx, sf)

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

// the structure to keep track of each actions the images must perform
// list of properties:
//  - type: type of action, such as move and fade
//  - ease: type of ease function used
//  - start_time: time the action activates
//  - end_time: time the action ends
//  - start_value: the value the action begins on
//  - end_value: the value the action ends up on after the transformation
//  - transformation: the function that, given t within [0,1] denoting the distance between start_time and end_time the current time rests on, returns appropriate value for the current time based on action type
//  - ease_function: given t, returns new t that follows the ease function given by either the user or list of basic ease functions
export class Action {
    constructor(readonly type: ActionType, readonly ease: Ease, readonly start_time: number, readonly end_time: number, start_value: Array<number> = [0], end_value: Array<number> = [0], readonly transformation: (t: number) => Array<number> | undefined = function(t: number) { return undefined }, readonly ease_function: (t: number) => number = function(t: number) { return 0 }) {
        // If it's a linear movement from start to end value, figure out the transformation function based on that
        if (this.transformation(0) === undefined) {
            this.transformation = (t: number) => {
                let new_values = [];

                for (let i = 0; i < start_value.length; i++) {
                    let c = end_value[i] - start_value[i];
                    new_values.push(c * t + start_value[i]);
                }

                return new_values;
            }
        }

        // If the ease type is not Custom, assign the correct function on ease_function
        if (this.ease != Ease.Custom) {
            this.ease_function = EaseFunction.get_func(this.ease);
        }
    }

    // Given the time, return the value the image should be at.  For example, the move action will return the x and y location of the image of given time
    get_value(t: number) {
        // first check if the number is within start and end and raise error otherwise
        if (!(this.start_time < t && t < this.end_time)) {
            new Error(`${t} is not between ${this.start_time} and ${this.end_time}`);
        }
        // get the % represention of t
        let percentage = (t - this.start_time) / (this.end_time - this.start_time);

        if (this.end_time === this.start_time) {
            percentage = 0
        }

        // adjust percentage based on the easing function
        let new_t = this.ease_function(percentage);

        // use the transformation function to calculate the value
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
                    if (t === 0) {
                        return 0
                    }
                    else {
                        return Math.pow(2, 10 * (t-1))
                    }
                }
                break;
            case Ease.ExpOut:
                func = (t: number) => {
                    if (t === 1) {
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
                    if (t === 0) {
                        return 0
                    }
                    else if (t === 2) {
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
    Move = "Move",
    Fade = "Fade",
    Scale = "Scale",
    Rotate = "Rotate",
    Color = "Color",
    MoveX = "MoveX",
    MoveY = "MoveY",
    Vector = "Vector",
    VectorX = "VectorX",
    VectorY = "VectorY",

    MoveF = "MoveF",
    FadeF = "FadeF",
    ScaleF = "ScaleF",
    RotateF = "RotateF",
    ColorF = "ColorF",
    MoveXF = "MoveXF",
    MoveYF = "MoveYF",
    VectorF = "VectorF",
    VectorXF = "VectorXF",
    VectorYF = "VectorYF",
}