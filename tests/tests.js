var fs = require( 'fs' )
var path = require( 'path' )
var defer = require( 'q' ).nfcall
var chai = require( 'chai' )
var chaiAsPromised = require( 'chai-as-promised' )
var config = require('../gulp.config.js')
var TaskUtil = require('../lib/task-util')

chai.use( chaiAsPromised )
var should = chai.should()

describe('Graphics', function() {
  it('should have all required graphic files', function( done ) {
    var missingCount

    TaskUtil.getThemeImages().then( function( themeImages ) {
      themeImages = themeImages.concat( 
        TaskUtil.copyImagesWithFactor( themeImages, 2 ) 
      )
      var graphics = TaskUtil.readDirs( config.gfx.dest )
      var missing = TaskUtil.arrDiff( themeImages, graphics )
      missingCount = missing.length
      missing.should.have.lengthOf( 0 )
      done()
    })
    .fail( function( err ) {
      var message = missingCount + ' graphic images missing. '
      message += 'Run "gulp missing" to view a complete list.'
      done( new Error( message ) )
    })
  })
})

describe( 'Icons', function( done ) {
  it('should have all required icons', function( done ) {
    var missingCount
    
    TaskUtil.getThemeIcons().then( function( expectedIcons ) {
      var icons = TaskUtil.readDirs( config.icons.dest )
      var missing = TaskUtil.arrDiff( expectedIcons, icons )
      missingCount = missing.length
      missing.should.have.lengthOf( 0 )
      done()
    })
    .fail( function( err ) {
      console.log( err.message )
      var message = missingCount + ' icons missing. '
      message += 'Run "gulp missing" to view a complete list.'
      done( new Error( message ) )
    })

  })
})
