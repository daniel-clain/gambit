const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  devServer: {
    contentBase: './compiled-code/client/fighter-sandbox',
    compress: true,
    port: 80,
    disableHostCheck: true,
    host: '192.168.1.6',
    public: 'http://danscomp'
  },
  entry: './source-code/client/fighter-sandbox/fighter-sandbox.tsx',
  output:{
    path: __dirname + "./../compiled-code/client/fighter-sandbox/",
    filename: "fighter-sandbox.js"
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
              "./source-code/client/fighter-sandbox/**/*"
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
      template: './source-code/client/fighter-sandbox/fighter-sandbox.html'
    }),
    new CopyPlugin([
      { 
        from: './source-code/client/images/**/*', 
        to: './images',
        test: /\.(jpe?g|png)$/i,     
        flatten: true,   
        ignore: ['*.ts']
      },
    ]),
  ]
};