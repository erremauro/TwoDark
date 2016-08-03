/* eslint no-unused-vars: 'off' */
/* eslint no-undef: 'off' */
import 'babel-polyfill'
// import browser from '../../tests/browser'
// browser()

import React from 'react'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinonChai from 'sinon-chai'
import chaiEnzyme from 'chai-enzyme'
import sinon from 'sinon'
import { shallow, mount } from 'enzyme'


import Theme from './Theme'
import { AnimationType } from '../../constants/AnimationType'

chai.use(chaiAsPromised)
chai.use(sinonChai)
chai.use(chaiEnzyme)

let sandbox

let _getTestComponent = () => {
  return(
    <Theme
      image={'path/to/image'}
      description={'test description'}
      scroll={{top: 0}}
    />
  )
}

describe('<Theme /> component', () => {
  beforeEach('Load Dom', () => {
    sandbox = sinon.sandbox.create()
  })

  afterEach('Unload Dom', () => {
    sandbox.restore()
  })

  describe( '- constructor:', () => {
    it('should throw warnings if required properties are missing', ( done ) => {
      var consoleSpy = sandbox.stub( console, 'error', () => {} )
      var wrapper = shallow( <Theme /> )
      expect( consoleSpy.called ).to.be.true
      done()
    })

    it('should not raise errors when all properties are given', ( done ) => {
      var consoleSpy = sandbox.stub( console, 'error', () => {} )
      var wrapper = shallow( _getTestComponent() )
      expect( consoleSpy.notCalled ).to.be.true
      done()
    })
  })

  describe(' - componetDidMount:', () => {
    it( 'should retrieve colorScheme and codeImage DOM elements', () => {
      // Arrange
      let colorSchemeId = 'Theme-ColorScheme-Container'
      let colorImageId = 'Theme-Image-Container'

      var colorScheme = document.createElement( 'div' )
      var codeImage = document.createElement( 'div' )
      var wrapper = shallow( _getTestComponent() ).instance()

      colorScheme.id = colorSchemeId
      codeImage.id = colorImageId

      document.body.appendChild( colorScheme )
      document.body.appendChild( codeImage )

      // Act
      wrapper.componentDidMount()

      // Assert
      expect( wrapper.colorScheme ).to.equal( colorScheme )
      expect( wrapper.codeImage ).to.equal( codeImage )
    })
  })

  describe( '- componentWillUpdate:', () => {
    it( 'should call animateColorScheme() when PALETTE appear from bottom', () => {
      // Arrange
      let colorSchemeId = 'Theme-ColorScheme-Container'
      let colorImageId = 'Theme-Image-Container'

      var colorScheme = document.createElement( 'div' )
      var codeImage = document.createElement( 'div' )
      var wrapper = shallow( _getTestComponent() ).instance()

      colorScheme.id = colorSchemeId
      codeImage.id = colorImageId
      window.innerHeight = 400

      var spyAnimateColor = sandbox.stub( wrapper, 'animateColorScheme' )
      var spyAnimateCode = sandbox.stub( wrapper, 'animateCodeImage' )

      sandbox.stub( wrapper, 'colorScheme', colorScheme )
      sandbox.stub( wrapper, 'codeImage', codeImage )

      sandbox.stub(
        colorScheme, 'getBoundingClientRect').returns({ top: 100, bottom: 300 })
      sandbox.stub(
        codeImage, 'getBoundingClientRect').returns({ top: 999, bottom: 999 })

      // Act
      wrapper.componentWillUpdate()

      // Assert
      expect( spyAnimateColor.calledOnce ).to.be.true
      expect( spyAnimateCode.notCalled ).to.be.true
    })

    it( 'should call animateCodeImage() when CODE IMAGE appear from bottom', () => {
      // Arrange
      let colorSchemeId = 'Theme-ColorScheme-Container'
      let colorImageId = 'Theme-Image-Container'

      var colorScheme = document.createElement( 'div' )
      var codeImage = document.createElement( 'div' )
      var wrapper = shallow( _getTestComponent() ).instance()

      colorScheme.id = colorSchemeId
      codeImage.id = colorImageId
      window.innerHeight = 400

      var spyAnimateColor = sandbox.stub( wrapper, 'animateColorScheme' )
      var spyAnimateCode = sandbox.stub( wrapper, 'animateCodeImage' )
      sandbox.stub( wrapper, 'colorScheme', colorScheme )
      sandbox.stub( wrapper, 'codeImage', codeImage )
      sandbox.stub(
        colorScheme, 'getBoundingClientRect').returns({ top: 999, bottom: 999 })
      sandbox.stub(
        codeImage, 'getBoundingClientRect').returns({ top: 100, bottom: 300 })

      // Act
      wrapper.componentWillUpdate()

      // Assert
      expect( spyAnimateColor.notCalled ).to.be.true
      expect( spyAnimateCode.calledOnce ).to.be.true
    })
  })

  describe( '- animateColorScheme:', () => {
    it( 'should set paletteOpacity to 0 and paletteAnimated to false', () => {
      // Arrange
      var wrapper = shallow( _getTestComponent() ).instance()
      wrapper.paletteOpacity = 0
      wrapper.paletteAnimated = false
      // Act
      wrapper.animateColorScheme()
      // Assert
      expect( wrapper.paletteOpacity ).to.equal( 1 )
      expect( wrapper.paletteAnimated ).to.equal( true )
    })
  })

  describe( '- resetColorSchemeAnimation:', () => {
    it( 'should set paletteOpacity to 1 and paletteAnimated to true', () => {
      // Arrange
      var wrapper = shallow( _getTestComponent() ).instance()
      wrapper.paletteOpacity = 1
      wrapper.paletteAnimated = true
      // Act
      wrapper.resetColorSchemeAnimation()
      // Assert
      expect( wrapper.paletteOpacity ).to.equal( 0 )
      expect( wrapper.paletteAnimated ).to.equal( false )
    })
  })

  describe( '- animateCodeImage:', () => {
    it( 'should update codeImage related instance variables.', () => {
      // Arrange
      var wrapper = shallow( _getTestComponent() ).instance()
      wrapper.codeImageOpacity = 0
      wrapper.codeImageAnimated = false
      // Act
      wrapper.animateCodeImage()
      // Assert
      expect( wrapper.codeImageOpacity ).to.equal( 1 )
      expect( wrapper.codeImageAnimated ).to.equal( true )
      expect( wrapper.codeImageClass ).to.contains( AnimationType.SLIDE_IN_UP )
    })
  })

  describe( '- resetCodeImageAnimation:', () => {
    it( 'should reset codeImage related instance variables.', () => {
      // Arrange
      var wrapper = shallow( _getTestComponent() ).instance()
      wrapper.codeImageOpacity = 1
      wrapper.codeImageAnimated = true
      // Act
      wrapper.resetCodeImageAnimation()
      // Assert
      expect( wrapper.codeImageOpacity ).to.equal( 0 )
      expect( wrapper.codeImageAnimated ).to.equal( false )
      expect( wrapper.codeImageClass ).to.not.contains( AnimationType.SLIDE_IN_UP )
    })
  })

  describe( '- createColorPaletteNodes:', () => {
    it( 'should create animated color palette DIVs', ( done ) => {
      // Arrange
      var wrapper = shallow( _getTestComponent() ).instance()
      wrapper.paletteOpacity = 1
      wrapper.paletteAnimated = true
      // Act
      var nodes = wrapper.createColorPaletteNodes()
      // Assert
      expect( nodes ).to.have.lengthOf( 5 )
      for( var i = 1; i <= nodes.length; i++ ) {
        var singleNode = nodes[ i - 1 ]
        expect( singleNode.props.className ).to.contains('animated-' + i )
        expect( singleNode.props.className ).to.contains( AnimationType.ZOOM_IN )
        expect( singleNode.props.style.opacity ).to.equal( 1 )
      }
      done()
    })

    it( 'should create static color palette DIVs', ( done ) => {
      // Arrange
      var wrapper = shallow( _getTestComponent() ).instance()
      wrapper.paletteOpacity = 0
      wrapper.paletteAnimated = false
      // Act
      var nodes = wrapper.createColorPaletteNodes()
      // Assert
      expect( nodes ).to.have.lengthOf( 5 )
      for( var i = 1; i <= nodes.length; i++ ) {
        var singleNode = nodes[ i - 1 ]
        expect( singleNode.props.className ).to.contains('animated-' + i )
        expect( singleNode.props.className ).to.not.contains( AnimationType.ZOOM_IN )
        expect( singleNode.props.style.opacity ).to.equal( 0 )
      }
      done()
    })
  })
  xdescribe( '- render:', () => {})
})
