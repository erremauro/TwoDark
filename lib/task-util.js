var fs = require( 'fs-extra' )
var path = require( 'path' )
var defer = require( 'q' ).nfcall
var colors = require( 'gulp-util' ).colors
var config = require( '../gulp.config.js' )
var Table = require('./table')

/**
 * Task Utility functions.
 **/
var TaskUtil = {
  /**
   * Get arrays diff.
   * @param {Array} n - First array.
   * @param {Array} m - Second array.
   * @returns {Array} - Resulting array from n - m
   */
  arrDiff: function( n, m ) {
    return n.filter( function( value ) {
      return m.indexOf( value ) === -1
    })
  },
  /**
   * Returns a copy of `images` renamed with `@<FACTOR>x` naming convention
   * @returns {string[]} - Renamed images.
   */
  copyImagesWithFactor: function( images, factor ) {
    return images.slice().map( function( value ) {
      var ext = path.extname( value )
      var prefix = '@' + factor + 'x'
      return value.replace( ext, prefix + ext )
    })
  },
  /**
   * Return a list of images required by the theme config file.
   * @returns {string[]} - An array of image names that the theme expect to find.
   */
  getThemeImages: function() {
    return defer( fs.readFile, config.theme )
      .then(function( buffer ) {
        return buffer.toString()
          .match( config.patterns.images )
          .map( function( image ) {
            return image.replace( config.patterns.imagesDir, '' )
          })
    })
  },
  getThemeIcons: function() {
    var requiredIcons = [
      'file_type_default.png',
      'file_type_text.png',
      'file_type_source.png',
      'file_type_image.png'
    ]
    requiredIcons = requiredIcons.concat(
      TaskUtil.copyImagesWithFactor( requiredIcons, 2 )
    )

    return defer( fs.readdir, config.iconsPrefs )
      .then( function( files ) {
        for (var i = 0; i < files.length; i++ ) {
          var file = fs.readFileSync( config.iconsPrefs + '/' + files[i] )
          var iconNames = file.toString().match(/file_type\w+/)
          if ( iconNames ) {
            requiredIcons.push( iconNames[0] + '.png' )
            requiredIcons.push( iconNames[0] + '@2x.png' )
          }
        }

        return requiredIcons
      })
  },
  /**
   * Pretty print missing files to console.
   * @param {string[]} missing - List of missing files.
   * @param {string} type - Type of missing file (graphics|icons)
   */
  printMissing: function( missing, type ) {
    var table  = new Table()
    missing.forEach( function( filename ) {
      table.cell( 'File', filename )
      table.cell(
        'Path', type === 'graphics' ? config.gfx.dest : config.icons.dest )
      table.newRow()
    })

    TaskUtil.logMessage( colors.cyan( 'Missing ' + type + ':' ) )

    if ( missing.length > 0 ) {
      console.log()
      console.log( table.toString() )
      console.log()
      console.log( colors.red('Missing files: ' + missing.length + '\n') )
    }
    else {
      TaskUtil.logMessage( colors.green( 'No file missing. ') )
    }
  },
  forceToArray: function( dirs ) {
    var _dirs = []

    if ( !Array.isArray( dirs ) ) {
      _dirs.push( dirs )
    }
    else {
      _dirs = dirs
    }
    return _dirs
  },
  cleanDirs: function( dirs ) {
    var _dirs = TaskUtil.forceToArray( dirs )
    var i, len = _dirs.length

    for ( i = 0; i < len; i++ ) {
      fs.removeSync( _dirs[i] + '/*.png' )
    }
  },
  /**
   * Synchronously read all `dirs` and returns a list of files.
   * @param {string[]} dirs - An array of directory paths.
   * @returns {string[]} - A list of files in `dirs` excluding '.' and '..'
   */
  readDirs: function( dirs ) {
    var _dirs = TaskUtil.forceToArray( dirs )
    var files = []
      , i, len = _dirs.length

    for ( i = 0; i < len; i++ ) {
      files = files.concat( fs.readdirSync( _dirs[i] ) )
    }
    return files
  },
  /**
   * Rename a `filename` by removing any `prefix` and adding a suffix
   * in the format `@<factor>x`.
   *
   * @example
   *
   * Passing a `factor` of 2 will gnerate a file with a "@2x" suffix:
   *
   *     ```js
   *     var filename = 'gfx_icon-buffer.svg'
   *     // returns "icon-buffer@2x.svg"
   *     var newFilename = rename( filename, 'gfx_', 2 )
   *     ````
   *
   * @param {string} filename - Source filename.
   * @param {string} prefix - Prefix to strip from `filename`.
   * @param {number} [factor] - resultin `filename` suffix factor.
   * @returns {string}
   */
  rename: function(filename, prefix, factor) {
    var suffix = ''
    if ( factor ) { suffix = '@' + factor + 'x' }
    return filename.replace( prefix, '' ) + suffix
  },
  /**
   * Convert `time` into a two-digit number
   *
   * @example
   *
   *    ```js
   *    var hours = new Date()
   *    // i.e. if hours === 8, result will be equale to "08"
   *    var result = TaskUtil.twoDigit( date.getHours() )
   *    ```
   *
   * @param {number} time - A number between 0 and 60
   * @returns {string} Two digit time if `time` < 10
   */
  twoDigit: function(time) {
    return ('0' + time ).slice( -2 )
  },
  timestamp: function() {
    var date = new Date()
    var timestamp = TaskUtil.twoDigit( date.getHours() ) + ':' +
      TaskUtil.twoDigit( date.getMinutes() ) + ':' +
      TaskUtil.twoDigit( date.getSeconds() )
    return colors.white('[') + colors.gray( timestamp ) + colors.white(']')
  },
  /**
   * Log a green message to the console.
   * @param {string} message - Message to be logged.
   */
  log: function( message ) {
    TaskUtil.logMessage( colors.green( message ) )
  },
  /**
   * Timestamp a message to the console.
   * @param {string} message - Message to be logged.
   */
  logMessage: function( message ) {
    console.log( TaskUtil.timestamp() + ' ' + message )
  }
}

module.exports = TaskUtil





