'use strict'

const Path = require('path')
const Config = require('../../../config')
const Helper = require('../../../helper')
const BaseTest = require('../../../base-test')
const HttpKernel = require('../../../src/foundation/http/kernel')
const Application = require('../../../src/foundation/application')

class AuthBootstrapperTest extends BaseTest {
  async serialLoadSchemesAndStrategies (t) {
    Helper.setAppRoot(Path.resolve(__dirname, 'fixtures'))

    const kernel = new HttpKernel(new Application())
    await kernel._createServer()
    await kernel._registerBootstrappers()

    t.deepEqual(Object.keys(kernel.getServer().auth._schemes), ['test-scheme'])
    t.deepEqual(Object.keys(kernel.getServer().auth._strategies), ['test-auth'])
  }

  async serialNoAuthStrategiesAvailable (t) {
    Config.set('auth.default', 'test-auth')
    Helper.setAppRoot(Path.resolve(__dirname, 'not-existent-folder'))

    const kernel = new HttpKernel(new Application())
    await kernel._createServer()
    await kernel._registerBootstrappers()

    t.deepEqual(Object.keys(kernel.getServer().auth._schemes), [])
    t.deepEqual(Object.keys(kernel.getServer().auth._strategies), [])
  }

  async serialSetDefaultStrategy (t) {
    Config.set('auth.default', 'test-auth')
    Helper.setAppRoot(Path.resolve(__dirname, 'fixtures'))

    const kernel = new HttpKernel(new Application())
    await kernel._createServer()
    await kernel._registerBootstrappers()

    t.deepEqual(Object.keys(kernel.getServer().auth._schemes), ['test-scheme'])
    t.deepEqual(Object.keys(kernel.getServer().auth._strategies), ['test-auth'])
  }
}

module.exports = new AuthBootstrapperTest()