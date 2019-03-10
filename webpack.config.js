var path = require('path')

module.exports = {
<<<<<<< HEAD
    entry: './src/typescript/game_engine/main.ts',
=======
    entry: ['babel-polyfill', './src/typescript/game_engine/main'],
>>>>>>> cff605171dfeaf922baed28a6435d1af1b92bf7b
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [{
            test: /\.(ts|js)x?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }],
    }
};