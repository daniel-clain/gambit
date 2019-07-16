
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: "development",
  entry: [
    './source-code/server/server.ts'
  ],
  output: {
    path: __dirname + "./../compiled-code/server",
    filename: 'server.js'
  },
  devtool: "source-map-loader",
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'awesome-typescript-loader',
        options: {
            configFileName: 'config/tsconfig.json',
            reportFiles: [ // need otherwise will compile server and node_modules
              "./source-code/server/server.ts"
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