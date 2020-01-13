const HtmlWebpackPlugin = require('html-webpack-plugin');

var sourceDir = `${__dirname}/../source-code/client/main-game`
var compiledDir = `${__dirname}/../compiled-code/client/main-game`

module.exports = {
  mode: 'development',
  entry: `${sourceDir}/main-game.tsx`,
  output:{
    path: compiledDir,
    filename: "main-game.js"
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts|tsx?$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/,
        options: {
            configFileName: 'config/tsconfig.json',
            reportFiles: [ `${sourceDir}/**/*`
            ]
        },
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(jpg|png)$/,
        loader: 'url-loader'
      },
      {
        test: /\.mp3$/,
        loader: 'file-loader'
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