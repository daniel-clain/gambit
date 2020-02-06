const HtmlWebpackPlugin = require('html-webpack-plugin');

var sourceDir = `${__dirname}/../source-code/client/manager-ui-test`
var compiledDir = `${__dirname}/../compiled-code/client/manager-ui-test`

module.exports = {
  mode: 'development',  
  entry: `${sourceDir}/manager-ui-test.tsx`,
  devServer: {
    watchContentBase: true,
    liveReload: true,
    open: true,
    port: 7766
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
            reportFiles: [ `${sourceDir}/**/*`]
        },
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(jpg|png)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 100000,
            fallback: 'file-loader',
            name: '[name].[ext]',
            publicPath: './../'
          }
        }
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