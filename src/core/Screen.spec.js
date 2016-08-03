/* eslint no-unused-vars: 'off' */
/* eslint no-undef: 'off' */
import 'babel-polyfill'
import browser from '../tests/browser'
import React from 'react'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinonChai from 'sinon-chai'
import chaiEnzyme from 'chai-enzyme'
import sinon from 'sinon'
import { shallow, mount } from 'enzyme'
import TestUtils from 'react-addons-test-utils'

import Screen from './Screen'

// browser()

chai.use(chaiAsPromised)
chai.use(sinonChai)
chai.use(chaiEnzyme)

let sandbox


describe('core/Screen tests.', () => {
  beforeEach('Load Dom', () => {
    sandbox = sinon.sandbox.create()
    window.innerHeight = 400
  })

  afterEach('Unload Dom', () => {
    sandbox.restore()
  })

  describe('- isOver:', () => {
    it('Should detect element overlapping on viewport\' center', () => {
      var elem = document.createElement('div')
      sandbox.stub( elem, 'getBoundingClientRect').returns({
        top: 100,
        bottom: 300,
      })

      var isOver = Screen.isOver( elem, 'center' )
      expect(isOver).to.be.true
    })

    it('Should detect element overlapping on viewport\' top', () => {
      var elem = document.createElement('div')
      sandbox.stub( elem, 'getBoundingClientRect').returns({
        top: 0,
        bottom: 100,
      })

      var isOver = Screen.isOver( elem, 'top' )
      expect(isOver).to.be.true
    })

    it('Should detect element overlapping on viewport\' bottom', () => {
      var elem = document.createElement('div')
      sandbox.stub( elem, 'getBoundingClientRect').returns({
        top: 300,
        bottom: 580,
      })

      var isOver = Screen.isOver( elem, 'bottom' )
      expect(isOver).to.be.true
    })

    it('Should NOT detect element overlapping', () => {
      var elem = document.createElement('div')
      sandbox.stub( elem, 'getBoundingClientRect').returns({
        top: 800,
        bottom: 1074,
      })

      var isOverTop = Screen.isOver( elem, 'top' )
      var isOverCenter = Screen.isOver( elem, 'center' )
      var isOverBottom = Screen.isOver( elem, 'bottom' )

      expect( isOverTop ).to.be.false
      expect( isOverCenter ).to.be.false
      expect( isOverBottom ).to.be.false
    })
  })

  describe('- requestAnimationFrame:', () => {
    it('should get a valid requestAnimationFrame function.', () => {
      var requestAnimationFrame = Screen.requestAnimationFrame()
      expect( requestAnimationFrame ).to.be.defined
      expect( requestAnimationFrame ).to.be.a( 'function' )
    })
  })

  describe('- addClass:', () => {
    it('should add class to element', () => {
      var elem = document.createElement( 'div' )
      Screen.addClass( elem, 'test-class' )
      expect( elem.className ).to.match( /test-class/g )
    })

    it('should add class to string className', () => {
      var className = 'active'
      className = Screen.addClass( className, 'test-class' )
      expect( className ).to.equal( 'active test-class' )
    })
  })

  describe('- removeClass:', () => {
    it('should remove class from element', () => {
      var elem = document.createElement( 'div' )
      elem.className = 'active test'
      Screen.removeClass( elem, 'test' )
      expect( elem.className ).to.equal( 'active' )
    })

    it('should remove class from string className', () => {
      var className = 'active test'
      className = Screen.removeClass( className, 'test' )
      expect( className ).to.equal( 'active' )
    })
  })

  describe(' - stripHtml:', () => {
    it('should string HTML tags from text', () => {
      var html = '<p>Test Text</p>'
      var result = Screen.stripHtml( html )
      expect( result ).to.equal( 'Test Text' )
    })
  })

  describe(' - random:', () => {
    it('should generate a random number in a given range', () => {
      const min = 1
      const max = 2
      var result = Screen.random( min, max )
      expect( result ).to.be.greaterThan( min )
      expect( result ).to.be.lessThan( max )
    })
  })

  describe(' - shake:', () => {
    it('should generate top and left positions', () => {
      var result = Screen.shake()
      expect( result ).to.have.property( 'top' )
      expect( result ).to.have.property( 'left' )
      expect( result.top ).to.be.a( 'string' )
      expect( result.left ).to.be.a( 'string' )
      expect( result.top ).to.match( /\d{1,}\.\d{1,}px/i )
    })

    it('should generate random top/left positions', () => {
      var r1 = Screen.shake()
      var r2 = Screen.shake()
      var r3 = Screen.shake()

      expect( r1 ).to.not.equal( r2 )
      expect( r1 ).to.not.equal( r3 )
      expect( r2 ).to.not.equal( r3 )
    })

    it('should generate a random position between 1 and 6', () => {
      var positions = [
        Screen.shake(),
        Screen.shake(),
        Screen.shake(),
      ]

      for (var i = 0; i < positions.length; i++ ) {
        for ( var key in positions[ i ] ) {
          var value = parseFloat( positions[ i ][ key ].replace('px', '' ) )
          expect( value ).to.be.greaterThan( 1 )
          expect( value ).to.be.lessThan( 6 )
        }
      }
    })
  })
})
