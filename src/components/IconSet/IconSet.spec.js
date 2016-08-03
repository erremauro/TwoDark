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


import IconSet from './IconSet'
import { AnimationType } from '../../constants/AnimationType'

chai.use( chaiAsPromised )
chai.use( sinonChai )
chai.use( chaiEnzyme )

let sandbox

let _getTestComponent = () => {
  return(
    <IconSet
      image={'path/to/image'}
      description={'test description'}
      iconset={'/path/to/video'}
      scroll={{top: 0}}
    />
  )
}

describe( '<IconSet /> component', () => {
  beforeEach( 'Load Dom', () => {
    sandbox = sinon.sandbox.create()
  } )

  afterEach( 'Unload Dom', () => {
    sandbox.restore()
  } )

  describe( '- constructor:', () => {
    it('should throw warnings if required properties are missing', ( done ) => {
      var consoleSpy = sandbox.stub( console, 'error', () => {} )
      var wrapper = shallow( <IconSet /> )
      expect( consoleSpy.called ).to.be.true
      done()
    })

    it('should not raise errors when all properties are given', ( done ) => {
      var consoleSpy = sandbox.stub( console, 'error', () => {} )
      var wrapper = shallow( _getTestComponent() ).instance()
      expect( consoleSpy.notCalled ).to.be.true
      done()
    })
  })

  describe( '- componentDidMount:', () => {
    it( 'should retrieve TwoDark image DOM element.', () => {
      // Arrange
      const id = 'FileIcon-ImageBox'
      var img = document.createElement( 'img' )
      var wrapper = shallow( _getTestComponent() ).instance()

      img.id = id
      sandbox.stub( document, 'getElementById' ).withArgs( id ).returns( img )

      // Act
      wrapper.componentDidMount()

      // Assert
      expect( wrapper.image ).to.equal( img )
    })
  })

  describe( '- componentWillUpdate:', () => {
    it( 'should call animate() when image appear on screen from bottom', () => {
      // Arrange
      const id = 'FileIcon-ImageBox'
      var img = document.createElement( 'img' )
      var wrapper = shallow( _getTestComponent() ).instance()

      img.id = id
      window.innerHeight = 400

      var spyAnimate = sandbox.stub( wrapper, 'animate' )
      sandbox.stub( wrapper, 'image', img )
      sandbox.stub(
        img, 'getBoundingClientRect').returns({ top: 100, bottom: 300 })

      // Act
      wrapper.componentWillUpdate()

      // Assert
      expect( spyAnimate.calledOnce ).to.be.true
    })
  })

  describe( '- animate:', () => {
    it('should update imgClassName, opacity and animated state', () => {
      var wrapper = shallow( _getTestComponent() ).instance()
      wrapper.animate()
      expect( wrapper.animated ).to.be.true
      expect( wrapper.imgAlpha ).to.equal( 1 )
      expect( wrapper.imgClassName ).to.contains( 'animated' )
      expect(
        wrapper.imgClassName ).to.contains(
          AnimationType.BOUNCE_IN_UP )
    })
  })

  describe( '- resetAnimation:', () => {
    it('should reset imgClassName, opacity and animated state', () => {
      // Arrange
      var wrapper = shallow( _getTestComponent() ).instance()
      wrapper.animated = true
      wrapper.imgAlpha = 1
      wrapper.imgClassName = 'animated ' +
        AnimationType.BOUNCE_IN_UP
      // Act
      wrapper.resetAnimation()
      // Assert
      expect( wrapper.animated ).to.be.false
      expect( wrapper.imgAlpha ).to.equal( 0 )
      expect( wrapper.imgClassName ).to.not.contains( 'animated' )
      expect(
        wrapper.imgClassName ).to.not.contains(
          AnimationType.BOUNCE_IN_UP )
    })
  })
  xdescribe( '- render:', () => {} )

})
