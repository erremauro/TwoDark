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
import TestUtils from 'react-addons-test-utils'

import Hero from './Hero'
import { AnimationType } from '../../constants/AnimationType'

chai.use( chaiAsPromised )
chai.use( sinonChai )
chai.use( chaiEnzyme )

let sandbox

let _getTestComponent = () => {
  return(
    <Hero
      video={'/path/to/video'}
      poster={'/path/to/poster'}
      image={'path/to/image'}
      description={'test description'}
      scroll={{top: 0}}
    />
  )
}

describe('<Hero /> component', () => {
  beforeEach('Load Dom', () => {
    sandbox = sinon.sandbox.create()
  })

  afterEach('Unload Dom', () => {
    sandbox.restore()
  })

  describe( '- constructor:', () => {
    it('should throw warnings if required properties are missing', ( done ) => {
      var consoleSpy = sandbox.stub( console, 'error', () => {} )
      var wrapper = shallow( <Hero /> )
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

  describe( '- componentDidMount:', () => {
    it( 'should initialize DOM element properties and pause the video', () => {
      var getElemSpy = sandbox.spy( document, 'getElementById' )
      var pauseVideoStub = sandbox.stub( Hero.prototype, 'pauseVideo' )
      var wrapper = mount( _getTestComponent() )
      expect( getElemSpy.calledWith( 'Hero-Background' ) ).to.be.true
      expect( getElemSpy.calledWith( 'Hero-Video' ) ).to.be.true
      expect( pauseVideoStub.calledOnce ).to.be.true
    })
  })

  describe( ' - playVideo:', () => {
    it( 'should call play on video HTMLElement', () => {
      var mockVideoElem = document.createElement( 'video' )
      var spyVideoElem = sandbox.spy( mockVideoElem, 'play' )
      var getElemStub = sandbox.stub( document, 'getElementById', ( id ) => {
        if ( id === 'Hero-Video' ) {
          return mockVideoElem
        }
      })
      var wrapper = mount( _getTestComponent() )
      wrapper.instance().playVideo()
      expect( spyVideoElem.calledOnce ).to.be.true
      expect( wrapper.instance().videoIsPlaying ).to.be.true
    })

    it( 'should NOT call play on video if is not paused', () => {
      var mockVideoElem = document.createElement( 'video' )
      var spyVideoElem = sandbox.spy( mockVideoElem, 'play' )
      var getElemStub = sandbox.stub( document, 'getElementById', ( id ) => {
        if ( id === 'Hero-Video' ) {
          return mockVideoElem
        }
      })
      var wrapper = mount( _getTestComponent() )

      wrapper.instance().playVideo()
      // Video is already playing...
      wrapper.instance().playVideo()

      expect( spyVideoElem.calledOnce ).to.be.true
      expect( wrapper.instance().videoIsPlaying ).to.be.true
    })
  })

  describe( ' - pauseVideo:', () => {
    it( 'should NOT call pause on video if it\'s not playing', () => {
      var mockVideoElem = document.createElement( 'video' )
      var spyVideoElem = sandbox.spy( mockVideoElem, 'pause' )
      var getElemStub = sandbox.stub( document, 'getElementById', ( id ) => {
        if ( id === 'Hero-Video' ) {
          return mockVideoElem
        }
      })

      var wrapper = mount( _getTestComponent() )

      sandbox.stub( wrapper.instance(), 'videoIsPlaying', false )
      wrapper.instance().pauseVideo()

      expect( spyVideoElem.calledOnce ).to.be.false
      expect( wrapper.instance().videoIsPlaying ).to.be.false
    })

    it( 'should call pause on video HTMLlement', () => {
      var mockVideoElem = document.createElement( 'video' )
      var spyVideoElem = sandbox.spy( mockVideoElem, 'pause' )
      var getElemStub = sandbox.stub( document, 'getElementById', ( id ) => {
        if ( id === 'Hero-Video' ) {
          return mockVideoElem
        }
      })

      var wrapper = mount( _getTestComponent() )

      sandbox.stub( wrapper.instance(), 'videoIsPlaying', true )

      wrapper.instance().pauseVideo()
      expect( spyVideoElem.calledOnce ).to.be.true
      expect( wrapper.instance().videoIsPlaying ).to.be.false
    })
  })

  describe(' - maximizeWindowView:', () => {
    it( 'should NOT update className if video is already maximized', () => {
      var wrapper = mount( _getTestComponent() )

      var oViewClassName = wrapper.instance().viewClassName
      var oViewOpacity = wrapper.instance().viewOpacity

      sandbox.stub( wrapper.instance(), 'viewIsMaximized', true )
      wrapper.instance().maximizeWindowView()

      expect( wrapper.instance().viewClassName ).to.equal( oViewClassName )
      expect( wrapper.instance().viewOpacity ).to.equal( oViewOpacity )
      expect( wrapper.instance().viewIsMaximized ).to.be.true
    })

    it( 'should update className, opacity and state', () => {
      var wrapper = mount( _getTestComponent() )

      sandbox.stub( wrapper.instance(), 'viewIsMaximized', false )
      wrapper.instance().maximizeWindowView()

      expect(
        wrapper.instance().viewClassName ).to.contains( AnimationType.ZOOM_IN )
      expect( wrapper.instance().viewOpacity ).to.equal( 1 )
      expect( wrapper.instance().viewIsMaximized ).to.be.true
    })
  })

  describe(' - minimizeWindowView:', () => {
    it( 'should NOT update className if video is already minimized', () => {
      var wrapper = mount( _getTestComponent() )

      var oViewClassName = wrapper.instance().viewClassName
      var oViewOpacity = wrapper.instance().viewOpacity

      sandbox.stub( wrapper.instance(), 'viewIsMaximized', false )
      wrapper.instance().minimizeWindowView()

      expect( wrapper.instance().viewClassName ).to.equal( oViewClassName )
      expect( wrapper.instance().viewOpacity ).to.equal( oViewOpacity )
      expect( wrapper.instance().viewIsMaximized ).to.be.false
    })

    it( 'should update className, opacity and state', () => {
      var wrapper = mount( _getTestComponent() )

      sandbox.stub( wrapper.instance(), 'viewIsMaximized', true )
      wrapper.instance().minimizeWindowView()

      expect(
        wrapper.instance().viewClassName ).to.contains( AnimationType.ZOOM_OUT )
      expect( wrapper.instance().viewOpacity ).to.equal( 0 )
      expect( wrapper.instance().viewIsMaximized ).to.be.false
    })
  })

  xdescribe( '- render:', () => {
    xit( 'should render the component.', () => {
    } )
  })
})
