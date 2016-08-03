/* eslint no-unused-vars: 'off' */
/* eslint no-undef: 'off' */
import 'babel-polyfill'
// import browser from '../../tests/browser'
import React from 'react'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinonChai from 'sinon-chai'
import chaiEnzyme from 'chai-enzyme'
import sinon from 'sinon'
import { shallow, mount } from 'enzyme'
import TestUtils from 'react-addons-test-utils'
import $ComponentName from './$ComponentName'

chai.use(chaiAsPromised)
chai.use(sinonChai)
chai.use(chaiEnzyme)

let sandbox

describe('<$ComponentName /> component', () => {
  beforeEach('Load Dom', () => {
    sandbox = sinon.sandbox.create()
  })

  afterEach('Unload Dom', () => {
    sandbox.restore()
  })

  xit('Must be tested', () => {
  })
})
