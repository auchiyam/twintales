export function sleep(ms: number) {
    return new Promise(resolve=>setTimeout(resolve, ms));
}

export function measureTextHeight(font_family: string, font_size: number, font_type:string) {
    let ratio = 0 // let ratio be the ratio between 200px font size and the actual height of letter 'A' in height given by the font

    let font = font_family + " " + font_type

    switch (font) {
        case ("aleo bold"):
            ratio = 200.0/145.0
        case ("aleo regular"):
            ratio = 200.0/144.0
        case ("aleo light"):
            ratio = 200.0/143.0
    }

    return font_size * ratio
}

export var frame_interval = 10;