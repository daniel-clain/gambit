const nodeExternals = require('webpack-node-externals');

var sourceDir = `${__dirname}/../../source-code/server`
var compiledDir = `${__dirname}/../../compiled-code/server`

module.exports = {
  mode: "development",
  entry: [
    `${sourceDir}/server.ts`
  ],
  output: {
    path: compiledDir,
    filename: 'server.js'
  },
  devtool: 'source-map',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'awesome-typescript-loader',
        options: {
            configFileName: 'config/tsconfig.json',
            reportFiles: [ `${sourceDir}/server.ts`
            ]
        },
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  externals: [nodeExternals()]
};