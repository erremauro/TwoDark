var fs = require( 'fs-extra' )
  , es = require('event-stream')
  , path = require( 'path' )
  , gulp = require( 'gulp' )
  , gulpLoadPlugins = require( 'gulp-load-plugins' )
  , svg2png = require( './lib/gulp-svg2png' )
  , TaskUtil = require('./lib/task-util')
  , config = require( './gulp.config.js' )
var $ = gulpLoadPlugins()

// Monitor svg changes and rebuild changed file.
gulp.task( 'watch', function() {
  TaskUtil.log( 'Monitoring file changes at ' + config.svgPath )
  var opts  = {
    ignoreInitial: true,
    events: [ 'add', 'change' ]
  }
  return $.watch( config.allSvg, opts, function( file ) {
    var basename = path.basename( file.path )
    if ( basename.match( config.patterns.gfxFiles ) ) {
      return build( file.path, config.gfx.dest, config.gfx.prefix )
    }
    else if ( basename.match( config.patterns.icnsFiles ) ) {
      return build( file.path, config.icons.dest, config.icons.prefix )
    }
  })
})

// Build all graphic files and icons.
gulp.task( 'default', [ 'build-gfx', 'build-icons' ] )

// Build all graphic files.
gulp.task( 'build-gfx', function() {
  TaskUtil.log( 'Building graphic files...' )
  return build( config.gfx.src, config.gfx.dest, config.gfx.prefix )
})

// Build all icon files.
gulp.task( 'build-icons', function() {
  TaskUtil.log( 'Building icon files...' )
  return build( config.icons.src, config.icons.dest, config.icons.prefix )
})

// Compress source svg files.
gulp.task( 'compress', function() {
  TaskUtil.log( 'Compressing svg sources...' )
  return gulp.src( config.allSvg )
    .pipe( $.svgmin() )
    .pipe( gulp.dest( './') )
})

// Clean built graphic and icons from unwanted files.
gulp.task( 'cleanup', function() {
  TaskUtil.log( 'Removing unwanted files from built images...' )
  return TaskUtil.getThemeImages().then( function( themeImages ) {
    themeImages = themeImages.concat(
      TaskUtil.copyImagesWithFactor( themeImages, 2 )
    )
    var graphics = TaskUtil.readDirs( config.gfx.dest )
    var unwanted = TaskUtil.arrDiff( graphics, themeImages )
    if ( unwanted.length > 0 ) {
      for ( var i = 0; i < unwanted.length; i++ ) {
        fs.unlinkSync( config.gfx.dest + '/' + unwanted[i] )
      }
    }
  })
})

// Safe delete all graphic files and icons.
gulp.task( 'clean-all', function() {
  TaskUtil.log( 'Cleaning the project...' )
  return TaskUtil.cleanDirs( [ config.gfx.dest, config.icons.dest ] )
})

// List missing graphic files
gulp.task( 'missing', [ 'missing-icons' ], function() {
  return TaskUtil.getThemeImages().then( function( themeImages ) {
    themeImages = themeImages.concat(
      TaskUtil.copyImagesWithFactor( themeImages, 2 )
    )

    var graphics = TaskUtil.readDirs( config.gfx.dest )
    var missing = TaskUtil.arrDiff( themeImages, graphics )

    TaskUtil.printMissing( missing, 'graphics' )
  })
})


gulp.task( 'missing-icons', function() {
  return TaskUtil.getThemeIcons().then( function( expectedIcons ) {
    var icons = TaskUtil.readDirs( config.icons.dest )
    var missing = TaskUtil.arrDiff( expectedIcons, icons )

    TaskUtil.printMissing( missing, 'icons' )
  })
  .fail( function( err ) {
    throw err
  })
})

/**
 * Convert all svg files at `path` to `.png`
 * Rendered files are built for standard and retina resolutions.
 * @param {!string|Vinyl} file - Source glob, file path or Vinyl file.
 * @param {!string} dest - Destination glob or directory path.
 * @param {!string} prefix - Type prefix (i.e. gfx|icns)
 * @returns {Stream}
 */
function build( file, dest, prefix ) {
  var changedSvg = typeof file === 'string' ? gulp.src( file ) : file
  var standard = changedSvg
    .pipe( svg2png() )
    .pipe( $.rename( function( pngFile ) {
      pngFile.basename = TaskUtil.rename( pngFile.basename, prefix + '_' )
    } ) )
  var retina = changedSvg
    .pipe( svg2png( { factor: 2 } ) )
    .pipe( $.rename( function( pngFile ) {
      pngFile.basename = TaskUtil.rename( pngFile.basename, prefix + '_', 2 )
    } ) )
  return es.merge( standard, retina ).pipe( gulp.dest( dest ) )
}
