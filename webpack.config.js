
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const webpack = require('webpack')

const buildModesPath = 'source-code/client/different-build-modes'
const hostPackagesPath = 'host-packages'

module.exports = ({remote}, {mode, configName}) => {
  buildType = configName?.[0]
  mode = mode || 'development'

  console.log('buildType :>> ', buildType);
  console.log('mode :>> ', mode);
  console.log('remote :>> ', remote);


  const {buildDir, title, port, outputDir, outputFile} = 
  buildType == 'fightTest' ? {
    buildDir: `${__dirname}/${buildModesPath}/fight-test/fight-test-root.tsx`,
    title: 'Gambit - Fight Test ',
    port: '6789',
    outputDir: `${__dirname}/${hostPackagesPath}/fight-test/`,
    outputFile: 'fightTest.js'
  } :
  buildType == 'localTest' ? {
    buildDir: `${__dirname}/${buildModesPath}/local-test/local-test-root.tsx`,
    title: 'Gambit - Local Test ',
    port: '1234',
    outputDir: `${__dirname}/${hostPackagesPath}/local-test/`,
    outputFile: 'localTest.js'
  } :
  buildType == 'mainGame' ? {
    buildDir: `${__dirname}/${buildModesPath}/main-game/main-game-root.tsx`,      
    title: 'Gambit - Main Game ',
    port: '5555',
    outputDir: `${__dirname}/${hostPackagesPath}/main-game/`,
    outputFile: 'mainGame.js'
  } : {}
  
  console.log('title :>> ', title);
  console.log('buildDir :>> ', buildDir);
  console.log('outputDir :>> ', outputDir);


  let config = {
    entry: [buildDir],    
    output: {
      filename: outputFile,
      path: outputDir,
      clean: true,
    },
    name: buildType,
    resolve: {
      alias: {
        'react-dom': '@hot-loader/react-dom',
      },
      modules: ['node_modules'],
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.(j|t)s(x)?$/,
          exclude: /node_modules/,
          use: [
            {loader: 'react-hot-loader/webpack'},
            {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              babelrc: false,
              presets: [
                [
                  '@babel/preset-env',
                  { targets: { browsers: 'last 2 versions' } }, // or whatever your project requires
                ],
                '@babel/preset-typescript',
                '@babel/preset-react',
              ],
              plugins: [
                // plugin-proposal-decorators is only needed if you're using experimental decorators in TypeScript
                ['@babel/plugin-proposal-decorators', { legacy: true }],
                ['@babel/plugin-proposal-class-properties', { loose: true }],
                'react-hot-loader/babel',
              ],
            },
          }],
        },
        {
          test: /\.(jpg|png|gif)$/,
          loader: 'url-loader',
          options: {
            limit: false,
            fallback: 'file-loader',
            name: 'images/[folder]/[name].[hash:8].[ext]'
          }
        },
        {
          test: /\.mp3$/,
          loader: 'file-loader',
          options:{
            name: 'sounds/[name].[ext]'
          }
        }
      ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        title,
        meta:{viewport: "width=device-width, initial-scale=1.0"}
      }),
    ]
  }


  if(mode == 'development'){
    config = {...config,  
      mode: 'development',
      devtool: 'eval-source-map',
      devServer: { 
        liveReload: true,
        port: port,
        hot: true,
        open: true,
        proxy: {
          '/api': {
            target: 'ws://localhost:6969',
            ws: true
          }
        }
      }
    }
  }

  return config
};