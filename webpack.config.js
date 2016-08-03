var fs = require('fs')
var webpack = require('webpack')
var path = require('path')

var config = {
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:3000', // WebpackDevServer host and port
    'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    path.join(__dirname, 'src/index.js'),
  ],
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '/assets/js'),
    publicPath: '/assets/js'
  },
  resolve: {
    alias: {
      'react': path.join(__dirname, 'node_modules', 'react')
    },
    extensions: ['', '.js', '.scss'],
    modulesDirectories: [ 'node_modules' ]
  },
  resolveLoader: {
    'fallback': path.join(__dirname, 'node_modules')
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    function () {
      // Removes bundle's hash from index script src in development.
      this.plugin( 'done', function ( stats ) {
        var replaceInFile = function ( filePath, toReplace, replacement ) {
          var replacer = function ( match ) {
              console.log('Replacing in %s: %s => %s',
                filePath, match, replacement )
              return replacement
          }
          var str = fs.readFileSync( filePath, 'utf8' )
          var out = str.replace( new RegExp( toReplace, 'g' ), replacer )
          fs.writeFileSync( filePath, out )
        };

        replaceInFile( path.join( __dirname, 'index.html' ),
          'bundle-[a-z0-9]+.js',
          'bundle.js'
        )
      })
    }
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: [ 'babel' ],
      include: path.join( __dirname )
    }, {
      test: /\.scss$/,
      loaders: ['style', 'css', 'postcss', 'sass']
    }, {
      test: /\.md$/,
      loader: 'html!markdown'
    }, {
      test: /\.(png|woff|woff2|eot|ttf|svg|png|mp4)$/,
      loader: 'url'
    }]
  },
  devServer: {
    contentBase: path.join( __dirname ),
    colors: true,
    historyApiFallback: true,
    inline: true,
    hot: true,
  },
};

module.exports = config;
