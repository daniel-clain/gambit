const HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require("webpack");
var sourceDir = `${__dirname}/../../source-code/client/different-build-modes/main-game`
var compiledDir = `${__dirname}/../../compiled-code/client/main-game`

module.exports = {
  mode: 'development',
  entry: `${sourceDir}/main-game.tsx`,
  devServer: { 
    liveReload: true,
    open: true,
    port: 7744,
    hot: true
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
      title: 'Gambit - Main Game Dev',
      meta:{viewport: "width=device-width, initial-scale=1.0"}
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};