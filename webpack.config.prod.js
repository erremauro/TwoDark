var fs = require( 'fs')
var webpack = require( 'webpack' )
var path = require( 'path' )

var config = {
  entry: [
    path.join(__dirname, 'src/index.js'),
  ],
  output: {
    filename: 'bundle-[hash].js',
    path: path.join(__dirname, 'assets/js/'),
    publicPath: './',
  },
  resolve: {
    alias: {
      'react': path.join( __dirname, 'node_modules', 'react' )
    },
    extensions: [ '', '.js', '.scss' ],
    modulesDirectories: [ 'node_modules' ]
  },
  resolveLoader: {
    'fallback': path.join( __dirname, 'node_modules' )
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
        }
    }),
    function () {
      // Adds bundle's hash tp index script src in production
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

      // Build's hash, found in `stats` since build lifecycle is done.
      var hash = stats.hash

      replaceInFile( path.join( __dirname, 'index.html' ),
          'bundle.js',
          'bundle-' + hash + '.js'
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
      test: /\.(png|mp4)$/,
      loader: 'file'
    }, {
      test: /\.(woff|woff2|svg)$/,
      loader: 'url'
    },]
  },
};

module.exports = config;
