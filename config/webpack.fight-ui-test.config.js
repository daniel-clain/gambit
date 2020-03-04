const HtmlWebpackPlugin = require('html-webpack-plugin');

var sourceDir = `${__dirname}/../source-code/client/different-build-modes/fight-ui-test`

module.exports = {
  mode: 'development',
  entry: `${sourceDir}/fight-ui-test.tsx`,
  devServer: {
    liveReload: true,
    open: true,
    port: 7788,
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
            reportFiles: [ `${sourceDir}/**/*`]
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
      title: 'Gambit - Fight UI Test Dev',
      meta:{viewport: "width=device-width, initial-scale=1.0"},
      favicon: "./favicon.ico",
    }),
  ]
};