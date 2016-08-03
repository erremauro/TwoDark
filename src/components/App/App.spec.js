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


import App from './App'
import { AnimationType } from '../../constants/AnimationType'

chai.use( chaiAsPromised )
chai.use( sinonChai )
chai.use( chaiEnzyme )

let sandbox

let _getTestComponent = () => {
  return( <App /> )
}

describe('<App /> component', () => {
  beforeEach('Load Dom', () => {
    sandbox = sinon.sandbox.create()
  })

  afterEach('Unload Dom', () => {
    sandbox.restore()
  })

  describe(' - componentWillMount:', () => {
    it( 'should add window scroll event listener', () => {
      // Arrange
      var wrapper = shallow( _getTestComponent() ).instance()
      var stubScrollEvent = sandbox.stub( window, 'addEventListener' )
      sandbox.stub( console, 'error', () => {} ) // ignore mount props error
      sandbox.stub( console, 'log', () => {} ) // ignore mount props error
      sandbox.stub( console, 'warn', () => {} ) // ignore mount props error
      // Act
      wrapper.componentWillMount()
      // Assert
      expect( stubScrollEvent.calledOnce ).to.be.true
    })
  })

  describe(' - componentWillUpdate:', () => {
    it( 'should call animate() when user scrolls down from top', () => {
      // Arrange
      var wrapper = shallow( _getTestComponent() ).instance()
      var stubAnimate = sandbox.stub( wrapper, 'animate' )
      var stubResetAnimation = sandbox.stub( wrapper, 'resetAnimation' )
      // Act
      wrapper.animated = false
      wrapper.componentWillUpdate(null, { scroll: { top: 200 } } )
      // Assert
      expect( stubAnimate.calledOnce ).to.be.true
      expect( stubResetAnimation.called ).to.be.false
    })

    it( 'should call resetAnimation() when user scrolls to top', () => {
      // Arrange
      var wrapper = shallow( _getTestComponent() ).instance()
      var stubAnimate = sandbox.stub( wrapper, 'animate' )
      var stubResetAnimation = sandbox.stub( wrapper, 'resetAnimation' )
      // Act
      wrapper.animated = true
      wrapper.componentWillUpdate(null, { scroll: { top: 0 } } )
      // Assert
      expect( stubAnimate.called ).to.be.false
      expect( stubResetAnimation.calledOnce ).to.be.true
    })
  })

  describe(' - animate:', () => {
    it( 'should add CSS transition and class to body, set animate to true.', () => {
      // Arrange
      var wrapper = shallow( _getTestComponent() ).instance()
      var body = document.createElement( 'div' )
      var stubContainer = sandbox.stub( wrapper, 'getAppContainer', () => {
        return body
      })
      // Act
      wrapper.animated = false
      wrapper.animate()
      // Assert
      expect( wrapper.animated ).to.be.true
      expect( body.style.transition ).to.equal( 'all 0.5s linear' )
      expect( body.className ).to.contains( AnimationType.BG_COLOR_FADE )
    })
  })

  describe(' - resetAnimation:', () => {
    it( 'should remove CSS class from body, set animate to false.', () => {
      // Arrange
      var wrapper = shallow( _getTestComponent() ).instance()
      var body = document.createElement( 'div' )
      var stubContainer = sandbox.stub( wrapper, 'getAppContainer', () => {
        return body
      })
      // Act
      wrapper.animated = false
      wrapper.resetAnimation()
      // Assert
      expect( wrapper.animated ).to.be.false
      expect( body.className ).to.not.contains( AnimationType.BG_COLOR_FADE )
    })
  })

  describe(' - handleScroll:', () => {
    it( 'should reload the AppState on scroll.', () => {
      // Arrange
      var wrapper = shallow( _getTestComponent() ).instance()
      var stubState = sandbox.stub( wrapper, 'setState' )
      // Act
      wrapper.handleScroll()
      // Assert
      expect( wrapper.setState ).to.be.calledOnce
    })
  })

  describe(' - componentWillUnmount:', () => {
    it( 'should remove event listeners for scroll event from window', () => {
      // Arrange
      var wrapper = shallow( _getTestComponent() ).instance()
      var stubScrollEvent = sandbox.stub( window, 'removeEventListener' )
      // Act
      wrapper.componentWillUnmount()
      // Assert
      expect( stubScrollEvent.calledOnce ).to.be.true
    })
  })
})
