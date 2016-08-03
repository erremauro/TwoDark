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

import Api from './Api'

chai.use(chaiAsPromised)
chai.use(sinonChai)
chai.use(chaiEnzyme)

let sandbox

describe('core/Api tests.', () => {
  beforeEach('Load Dom', () => {
    sandbox = sinon.sandbox.create()
  })

  afterEach('Unload Dom', () => {
    sandbox.restore()
  })

  describe( '- getAppState:', () => {
    it('Can get the App state', () => {
      var appState = Api.getAppState()
      expect( appState ).to.have.property( 'media' )
      expect( appState ).to.have.property( 'text' )
      expect( appState ).to.have.property( 'scroll' )

      expect( appState.media ).to.be.defined
      expect( appState.text ).to.be.defined
      expect( appState.scroll ).to.be.defined
    })
  })
})
