const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

var sourceDir = `${__dirname}/../../source-code/client/different-build-modes/single-player-test`

module.exports = {
  mode: 'development',
  entry: `${sourceDir}/single-player-test.tsx`,
  devServer: { 
    liveReload: true,
    open: true,
    port: 7799,
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
          reportFiles: [`${sourceDir}/**/*`]
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
          name: '[name].[ext]'
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
      title: 'Gambit - Single Player Dev',
      meta:{viewport: "width=device-width, initial-scale=1.0"}
    }),
  ]
};