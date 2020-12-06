const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

var sourceDir = `${__dirname}/../../source-code/client/different-build-modes/main-game`
var compiledDir = `${__dirname}/../../host-packages/main-game`

module.exports = {
  mode: 'development',
  entry: `${sourceDir}/main-game.tsx`,
  devtool: 'source-map',  
  output:{
    path: compiledDir,
    filename: 'bundle.js',
  },
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
        loader: 'url-loader',
        options: {
          limit: 100000,
          fallback: 'file-loader',
          name: 'images/[name].[ext]'
        }
      },
      {
        test: /\.mp3$/,
        loader: 'file-loader',
        options:{
          name: 'sounds/[name].[ext]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Gambit - Main Game',
      hash: true,
      meta:{viewport: "width=device-width, initial-scale=1.0"}
    })
  ]
};