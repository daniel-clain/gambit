
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const TerserPlugin  = require('terser-webpack-plugin')
const nodeExternals = require('webpack-node-externals');

const buildModesPath = 'source-code/client/different-build-modes'
const gameHost = 'source-code/game-host'
const compiledCodePath = 'compiled-code'
const hostPackagesPath = 'host-packages'

module.exports = (env, {mode}) => {
  mode = mode || 'development'
  env = env || {mainGame: true}
  console.log(`mode: ${mode} | env: ${env}`);


  const {buildDir, title, port, outputDir, outputFile} = 
  env.fightTest ? {
    buildDir: `${__dirname}/${buildModesPath}/fight-test/fight-test-root.tsx`,
    title: 'Gambit - Fight Test ',
    port: '6789',
    outputDir: `${__dirname}/${hostPackagesPath}/fight-test/`,
    outputFile: 'fightTest.js'
  } :
  env.localTest ? {
    buildDir: `${__dirname}/${buildModesPath}/local-test/local-test-root.tsx`,
    title: 'Gambit - Local Test ',
    port: '1234',
    outputDir: `${__dirname}/${hostPackagesPath}/local-test/`,
    outputFile: 'localTest.js'
  } :
  env.mainGame ? {
    buildDir: `${__dirname}/${buildModesPath}/main-game/main-game-root.tsx`,      
    title: 'Gambit - Main Game ',
    port: '6969',
    outputDir: `${__dirname}/${hostPackagesPath}/main-game/`,
    outputFile: 'mainGame.js'
  } : {}
  
  console.log('title :>> ', title);
  console.log('buildDir :>> ', buildDir);
  console.log('outputDir :>> ', outputDir);



  let config = {
    mode,
    entry: [buildDir],
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
          use: {
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
          },
        }
      ]
    },
    plugins: [
      new Dotenv(),
      new ForkTsCheckerWebpackPlugin(),
      new HtmlWebpackPlugin({
        title,
        meta:{viewport: "width=device-width, initial-scale=1.0"}
      }),
    ]
  }




  /* if(env.gameHost){
    config = {
      ...config,
      resolve: {
        extensions: ['.ts', '.js']
      },
      target: 'node',
      externals: [nodeExternals()],
      module: {
        rules: [
          {
            test: /\.ts?$/,
            loader: 'awesome-typescript-loader',
          }
        ]
      }
    }
  } */

  
  

  if(mode == 'production'){
    config = {...config,
      output: {
        filename: outputFile,
        path: outputDir,
        clean: true,
      }
    }
    config.module.rules.push(
      {
        test: /\.(jpg|png|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 100000,
          fallback: 'file-loader',
          name: '../images/[name].[ext]'
        }
      },
      {
        test: /\.mp3$/,
        loader: 'file-loader',
        options:{
          name: '../sounds/[name].[ext]'
        }
      },
    )
  }


  
  if(mode == 'development'){
    config = {...config,  
      mode: 'development',   
      devtool: 'eval-source-map',
      devServer: { 
        liveReload: true,
        port: port,
        hot: true,
        writeToDisk: false,
        open: true
      }
    }
    config.module.rules.push(
      {
        test: /\.(jpg|png|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 100000,
          fallback: 'file-loader',
          name: 'images/[name].[ext]'
        }
      },
      {
        test: /\.mp3$/,
        loader: 'file-loader',
        options:{
          name: 'sounds/[name].[ext]'
        }
      },
    )
  }

  return config
};