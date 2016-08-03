var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('../webpack.config');

var HOST = process.env['HOST'] || '127.0.0.1'; // eslint-disable-line
var PORT = process.env['PORT'] || 3000;        // eslint-disable-line

new WebpackDevServer( webpack( config ), {
  publicPath: config.output.publicPath,
  contentBase: config.devServer.contentBase,
  hot: config.devServer.hot,
  historyApiFallback: config.devServer.historyApiFallback,
  inline: config.devServer.inline,
  stats: {
    colors: true
  }
}).listen( PORT, HOST, function ( err ) {
  if ( err ) {
    console.log( err );
  }

  console.log( 'Listening to ' + HOST + ':' + PORT );
});
