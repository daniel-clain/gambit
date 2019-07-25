const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');


var sourceDir = `${__dirname}/../source-code/client/manager-ui-test`
var compiledDir = `${__dirname}/../compiled-code/client/manager-ui-test`

module.exports = {
  mode: 'development',  
  devServer: {
    contentBase: compiledDir,
    progress: true,
    watchContentBase: true,
    liveReload: true,
  },
  entry: `${sourceDir}/manager-ui-test.tsx`,
  output:{
    path: __dirname + './../compiled-code/client/manager-ui-test',
    filename: "manager-ui-test.js"
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
              `./../source-code/client/manager-ui-test/**/*`
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
    ]),
  ]
};