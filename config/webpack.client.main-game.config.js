const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

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
        test: /\.png$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './source-code/client/base.html'
    }),
    new CopyPlugin([
      { 
        from: './source-code/client/images/**/*', 
        to: './../images',
        test: /\.(jpe?g|png)$/i,     
        flatten: true,   
        ignore: ['*.ts']
      },
    ])
  ]
};