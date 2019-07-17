const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './source-code/client/main-game/main-game.tsx',
  output:{
    path: __dirname + "./../compiled-code/client/main-game",
    filename: "main-game.js"
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts|tsx?$/,
        loader: 'awesome-typescript-loader',
        options: {
            configFileName: 'config/tsconfig.json',
            reportFiles: [ // need otherwise will compile server and node_modules
              "./source-code/client/main-game/main-game.tsx"
            ]
        },
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './source-code/client/base.html'
    })
  ]
};