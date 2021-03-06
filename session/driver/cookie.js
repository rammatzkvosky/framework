'use strict'

class CookieDriver {
  constructor (config) {
    this.cookieName = config.cookie.name
  }

  /**
   * Start the cookie driver. Nothing
   * to do here because the data
   * is stored on the request.
   */
  async start () { }

  /**
   * Start the cookie driver. Nothing
   * to do here.
   */
  async stop () { }

  /**
   * Read the session data from cookie.
   *
   * @param {String} _
   * @param {Request} request
   *
   * @returns {Object}
   */
  async read (_, request) {
    if (request.hasCookie(this.cookieName)) {
      const { values } = request.cookie(this.cookieName)

      return values
    }

    return {}
  }

  /**
   * Store session data in a cookie.
   *
   * @param {String} sessionId
   * @param {Object} values
   * @param {Toolkit} h
   */
  async write (sessionId, values, h) {
    h.cookie(this.cookieName, { id: sessionId, values })
  }

  /**
   * Keep session data in cookie alive.
   * Extending the cookie lifetime is
   * possible by re-storing it.
   *
   * @param {String} sessionId
   * @param {Object} values
   * @param {Toolkit} h
   */
  async touch (_, value, h) {
    this.write(_, value, h)
  }
}

module.exports = CookieDriver
