'use strict'

const ms = require('ms')
const Config = require('../config')
const Session = require('./session')
const SessionManager = require('./')
const StartSession = require('./middleware/start-session')
const StartSessionDriver = require('./middleware/start-driver')

class SessionBootstrapper {
  constructor ({ server }) {
    this.driver = null
    this.server = server
    this.manager = SessionManager
  }

  /**
   * Returns the default cookie options.
   *
   * @returns {Object}
   */
  _defaultCookieOptions () {
    return {
      encoding: 'iron',
      password: Config.get('app.key')
    }
  }

  /**
   * Returns the cookie options.
   *
   * @returns {Object}
   */
  cookieOptions () {
    const { cookie } = this.manager.config()

    return cookie
  }

  /**
   * Returns the session lifetime as a
   * human-readable string, e.g. “7d”.
   *
   * @returns {Integer|String}
   */
  lifetime () {
    const { lifetime } = this.manager.config()

    return lifetime ? ms(lifetime) : null
  }

  /**
   * Add session support to the HTTP server for a configured session driver.
   * Starts the driver instance, prepares the session cookie and decorates
   * the request with `request.session`. Extends the request lifecycle
   * with a session extension point.
   */
  async boot () {
    if (!this._sessionConfigured()) {
      return
    }

    this.driver = await this._sessionDriver()

    this._prepareSessionCookie()
    this._prepareCsrfCookie()
    this._decorateRequest()

    await this.server.extClass(StartSessionDriver, StartSession)
  }

  /**
   * Determines whether a session driver is configured.
   *
   * @returns {Boolean}
   */
  _sessionConfigured () {
    return this.manager._sessionConfigured()
  }

  /**
   * Creates and boots the session driver.
   */
  async _sessionDriver () {
    return this.manager.driver()
  }

  /**
   * Initializes the session cookie.
   */
  _prepareSessionCookie () {
    const { name, ...options } = this.cookieOptions()

    this.server.state(name, {
      ttl: this.lifetime(),
      ...this._defaultCookieOptions(),
      ...options
    })
  }

  /**
   * Initializes the CSRF response cookie.
   */
  _prepareCsrfCookie () {
    const { name, ...options } = this.cookieOptions()

    this.server.state('XSRF-TOKEN', {
      ttl: this.lifetime(),
      ignoreErrors: true,
      ...this._defaultCookieOptions(),
      ...options

    })
  }

  /**
   * Decorates the HTTP request object with a `request.session` property.
   * This session member contains the session details for each request.
   */
  _decorateRequest () {
    this.server.decorate('request', 'session', (request) => this._sessionDecoration(request), {
      apply: true // ensure the "request.session" decoration for each request
    })
  }

  /**
   * Create a new session instance for the current request.
   *
   * @param {Object} request
   *
   * @returns {Session}
   */
  _sessionDecoration (request) {
    return new Session({
      request,
      driver: this.driver,
      config: this.manager.config()
    })
  }
}

module.exports = SessionBootstrapper
