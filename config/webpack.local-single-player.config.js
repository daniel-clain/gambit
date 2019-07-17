const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');


var sourceDir = `${__dirname}/../source-code/client/local-single-player`
var compiledDir = `${__dirname}/../compiled-code/client/local-single-player`

module.exports = {
  mode: 'development',  
  devServer: {
    contentBase: compiledDir,
    progress: true,
    watchContentBase: true,
    liveReload: true,
    compress: true,
    port: 80,
    disableHostCheck: true,
    host: '192.168.1.6',
    public: 'http://danscomp'
  },
  entry: `${sourceDir}/local-single-player.tsx`,
  output:{
    path: __dirname + './../compiled-code/client/local-single-player',
    filename: "local-single-player.js"
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
            reportFiles: [ // need otherwise will compile server and node_modules
              `./../source-code/client/local-single-player/**/*`
            ]
        },
      },
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
    ]),
  ]
};