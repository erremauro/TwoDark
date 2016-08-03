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


import AppIcons from './AppIcons'
import { AnimationType } from '../../constants/AnimationType'

chai.use(chaiAsPromised)
chai.use(sinonChai)
chai.use(chaiEnzyme)

let sandbox

let _getTestComponent = () => {
  return(
    <AppIcons
      lead={'Lead Text'}
      image={'path/to/image'}
      description={'test description'}
      scroll={{top: 0}}
    />
  )
}

describe('<AppIcons /> component', () => {
  beforeEach('Load Dom', () => {
    sandbox = sinon.sandbox.create()
  })

  afterEach('Unload Dom', () => {
    sandbox.restore()
  })

  describe( '- constructor:', () => {
    it('should throw warnings if required properties are missing', ( done ) => {
      var consoleSpy = sandbox.stub( console, 'error', () => {} )
      var wrapper = shallow( <AppIcons /> )
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

  describe(' - componentDidMount:', () => {
    it('should initialize DOM element properties', () => {
      // Arrange
      const sectionId = 'AppIcons'
      const appIconsId = 'AppIcons-Image'

      var section = document.createElement('div')
      var appIcons = document.createElement('div')
      var wrapper = shallow( _getTestComponent() ).instance()

      section.id = sectionId
      appIcons.id = appIconsId

      sandbox.stub( document, 'getElementById', ( id ) => {
        switch ( id ) {
          case sectionId:
            return section
          case appIconsId:
            return appIcons
          default:
            return null
        }
      })

      // Act
      wrapper.componentDidMount()

      // Assert
      expect( wrapper.section ).to.equal( section )
      expect( wrapper.appIcons ).to.equal( appIcons )
    })
  })

  describe(' - componentWillUpdate:', () => {
    it('should call animate() when component appear from the bottom', () => {
      // Arrange
      const sectionId = 'AppIcons'
      const appIconsId = 'AppIcons-Image'

      var section = document.createElement('div')
      var appIcons = document.createElement('div')
      var wrapper = shallow( _getTestComponent() ).instance()

      section.id = sectionId
      appIcons.id = appIconsId
      window.innerHeight = 400

      var spyAnimate = sandbox.stub( wrapper, 'animate' )
      sandbox.stub( wrapper, 'appIcons', appIcons )
      sandbox.stub(
        appIcons, 'getBoundingClientRect').returns({ top: 100, bottom: 300 })

      // Act
      wrapper.componentWillUpdate()

      // Assert
      expect( spyAnimate.calledOnce ).to.be.true
    })
  })

  describe(' - animate:', () => {
    it('should update appIconClass and animated state', () => {
      // Arrange
      var wrapper = shallow( _getTestComponent() ).instance()
      wrapper.animated = false
      // Act
      wrapper.animate()
      // Assert
      expect( wrapper.animated ).to.be.true
      expect( wrapper.appIconClass ).to.contains( 'animated' )
      expect( wrapper.appIconClass ).to.contains( AnimationType.BOUNCE )
    })
  })

  describe(' - resetAnimation:', () => {
    it('should reset appIconClass and animated state', () => {
      // Arrange
      var wrapper = shallow( _getTestComponent() ).instance()
      wrapper.animated = true
      wrapper.appIconClass = 'animated ' + AnimationType.BOUNCE
      // Act
      wrapper.resetAnimation()
      // Assert
      expect( wrapper.animated ).to.be.false
      expect( wrapper.appIconClass ).to.not.contains( 'animated' )
      expect( wrapper.appIconClass ).to.not.contains( AnimationType.BOUNCE )
    })
  })

  xdescribe(' - render:', () => {
    xit('should be tested')
  })

})
