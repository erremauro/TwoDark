var fs = require( 'fs' )
  , path = require( 'path' )
  , q = require( 'q' )
  , gutil = require('gulp-util')
  , map = require( 'map-stream' )
  , cheerio = require( 'cheerio' )
  , svg2png = require( 'svg2png' )

/**
 * @typedef {Object} Size
 * @property {number} width - Size's width
 * @property {number} height - Size's height
 */

 /**
  * @typedef {Object} Svg2PngProps
  * @property {number} factor - size multiplier factor
  */

 /**
  * @callback MapStreamCallback
  * @param {?Error} err - An optional error
  * @param {File} file - A file to return
  */

/**
 * Scale size and convert .svg file to .png
 * @constructor
 * @param {Svg2PngProps} props - Custom Properties.
 * @property {Svg2PngProps} props - Object properties.
 */
function Svg2Png( props ) {
  this.props = { factor: 1 }
  if ( props ) {
    this.props = Object.assign( this.props, props )
  }
}
/**
 * Get scaled size of `svg` by `factor`
 * @param {Buffer} svg - Svg file content
 * @param {number} factor - size multiplier factor
 * @returns {Size} Scaled size for `svg`
 */
Svg2Png.prototype.getSize = function( svg, factor ) {
  var $ = cheerio.load( svg.toString() )
  var svgElement = $.root().find( 'svg' )
    , width = parseInt( svgElement.attr( 'width' ), 10 )
    , height = parseInt( svgElement.attr( 'height' ), 10 )
  return {
    width: Math.round( width * factor ),
    height: Math.round( height * factor )
  }
}
/**
 * Change `filename` extension to `.png`
 * @param {string} filename - A file name.
 * @return {string} - `filename` with `.png` extension.
 */
Svg2Png.prototype.rename = function( filename ) {
  return filename.replace( path.extname( filename ), '.png' )
}
/**
 * Read content of a `source` svg and resize accordingly to `factor` property.
 * @param {Buffer} source - Source svg file
 * @param {MapStreamCallback} cb - Resolve callback
 */
Svg2Png.prototype.execute = function ( source, cb ) {
  var self = this
  q.nfcall(fs.readFile, source.path )
    .then( function( buffer ) {
      var size = self.getSize( buffer, self.props.factor )
      return svg2png(buffer, size )
    })
    .then( function( contents ) {
      return cb(
        null, new gutil.File({
          base: source.base,
          path: self.rename( source.path ),
          contents: contents
        })
      )
    })
    .done()
}
/**
 * Gulp plugin to resize and convert svg files to png
 * @props {Svg2PngProps} props - Plugin properties.
 * @returns {Stream}
 */
function GulpSvg2Png( props ) {
  var convert = new Svg2Png( props )
  return map( convert.execute.bind( convert ) )
}

module.exports = GulpSvg2Png
