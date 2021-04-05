const HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require("webpack");
var sourceDir = `${__dirname}/../../source-code/client/different-build-modes/main-game`
const Dotenv = require('dotenv-webpack');

console.log('Main game client running at localhost:7744')

module.exports = {
  mode: 'development',
  entry: `${sourceDir}/main-game-root.tsx`,
  output: {
    clean: true
  },
  devServer: { 
    liveReload: true,
    open: true,
    port: 7744,
    hot: true,
    writeToDisk: false
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts|?$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/,
        options: {
            configFileName: 'config/tsconfig.json',
            reportFiles: [ `${sourceDir}/**/*`
            ],
            plugins: ['react-hot-loader/babel'],
        },
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
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
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Gambit - Main Game Dev',
      meta:{viewport: "width=device-width, initial-scale=1.0"}
    }),
    new Dotenv(),
    new webpack.HotModuleReplacementPlugin()
  ]
};