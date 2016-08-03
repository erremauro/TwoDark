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


import Download from './Download'
import { AnimationType } from '../../constants/AnimationType'

chai.use(chaiAsPromised)
chai.use(sinonChai)
chai.use(chaiEnzyme)

let sandbox

let _getTestComponent = () => {
  return(
    <Download
      lead={'Lead Text'}
      image={'path/to/image'}
      description={'test description'}
      scroll={{top: 0}}
    />
  )
}


describe('<Download /> component', () => {
  beforeEach('Load Dom', () => {
    sandbox = sinon.sandbox.create()
  })

  afterEach('Unload Dom', () => {
    sandbox.restore()
  })

  describe( '- constructor:', () => {
    it('should throw warnings if required properties are missing', ( done ) => {
      var consoleSpy = sandbox.stub( console, 'error', () => {} )
      var wrapper = shallow( <Download /> )
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
      const linkElemId = 'Download-Link'
      const imgElemId = 'Download-Image'

      var linkElem = document.createElement('div')
      var imgElem = document.createElement('div')
      var wrapper = shallow( _getTestComponent() ).instance()

      linkElem.id = linkElemId
      imgElem.id = imgElemId

      sandbox.stub( document, 'getElementById', ( id ) => {
        switch ( id ) {
          case linkElemId:
            return linkElem
          case imgElemId:
            return imgElem
          default:
            return null
        }
      })

      // Act
      wrapper.componentDidMount()

      // Assert
      expect( wrapper.linkElem ).to.equal( linkElem )
      expect( wrapper.imgElem ).to.equal( imgElem )
    })

    it('should listen to mouseover/mouseout events on Download link.', () => {
      // Arrange
      const linkElemId = 'Download-Link'
      const imgElemId = 'Download-Image'

      var linkElem = document.createElement('div')
      var imgElem = document.createElement('div')
      var wrapper = shallow( _getTestComponent() ).instance()

      linkElem.id = linkElemId
      imgElem.id = imgElemId

      var stubAddEvent = sandbox.stub( linkElem, 'addEventListener' )
      var addMouseOver = stubAddEvent.withArgs( 'mouseover' )
      var addMouseOut = stubAddEvent.withArgs( 'mouseout' )

      sandbox.stub( document, 'getElementById', ( id ) => {
        switch ( id ) {
          case linkElemId:
            return linkElem
          case imgElemId:
            return imgElem
          default:
            return null
        }
      })

      // Act
      wrapper.componentDidMount()

      // Assert
      expect( addMouseOver.calledOnce ).to.be.true
      expect( addMouseOut.calledOnce ).to.be.true
    })
  })

  describe(' - componentWillUnmount:', () => {
    it( 'should stop listening to mouseover/mouseout Download link events', ( done ) => {
      // Arrange
      const linkElemId = 'Download-Link'
      const imgElemId = 'Download-Image'

      var linkElem = document.createElement('div')
      var imgElem = document.createElement('div')
      var wrapper = shallow( _getTestComponent() ).instance()

      linkElem.id = linkElemId
      imgElem.id = imgElemId

      wrapper.linkElem = linkElem
      wrapper.imgElem = imgElem

      sandbox.stub( wrapper, 'linkElem', linkElem )
      var stubAddEvent = sandbox.stub( linkElem, 'removeEventListener' )

      var removeMouseOver = stubAddEvent.withArgs( 'mouseover' )
      var removeMouseOut = stubAddEvent.withArgs( 'mouseout' )

      // Act
      wrapper.componentWillUnmount()

      // Assert
      expect( removeMouseOver.calledOnce ).to.be.true
      expect( removeMouseOut.calledOnce ).to.be.true

      done()
    })
  })

  xdescribe(' - handleMouseOver:', () => {
    xit('should be tested')
  })

  xdescribe(' - handleMouseOut:', () => {
    xit('should be tested')
  })

  xdescribe(' - render:', () => {
    xit('should be tested')
  })
})
