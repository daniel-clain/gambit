
const HtmlWebpackPlugin = require('html-webpack-plugin');
var sourceDir = `${__dirname}/../source-code/test-page/`

module.exports = {
  mode: 'none',
  entry: `${sourceDir}test.ts`,
  devServer: {
    watchContentBase: true,
    liveReload: true,
    port: 619,
    open: true
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'awesome-typescript-loader',
        options: {configFileName: 'config/tsconfig.json',
        reportFiles: [ `${sourceDir}/**/*`]},
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [new HtmlWebpackPlugin({template: `${sourceDir}test.html`})]
};