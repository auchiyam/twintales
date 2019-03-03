export enum State {
    Initialize,         // Draw the canvas and start the game
    Loading,            // Wait for all the assets to be loaded
    TitleScreen,        // The initial state of the game
    PlayGame,           // The game start has been selected, and the prologue should be displayed
    PracticeStages,     // The practice stage has been selected, and the practice stage sequence should be displayed
    Option,             // The option has been selected, and the option should be displayed
}