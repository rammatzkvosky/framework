'use strict'

const PendingRequest = require('./../pending-request')

class MakesHttpRequests {
  actAs(user) {
    return new PendingRequest().actAs(user)
  }

  withHeader(name, value) {
    return new PendingRequest().header(name, value)
  }

  withHeaders(headers) {
    return new PendingRequest().headers(headers)
  }

  withoutMiddleware(names) {
    return new PendingRequest().withoutMiddleware(names)
  }

  get({ uri, headers }) {
    return new PendingRequest().headers(headers).inject({ method: 'GET', uri })
  }

  post({ uri, headers, payload }) {
    return new PendingRequest().headers(headers).inject({ method: 'POST', uri, payload })
  }

  put({ uri, headers, payload }) {
    return new PendingRequest().headers(headers).inject({ method: 'PUT', uri, payload })
  }

  patch({ uri, headers, payload }) {
    return new PendingRequest().headers(headers).inject({ method: 'PATCH', uri, payload })
  }

  delete({ uri, headers, payload }) {
    return new PendingRequest().headers(headers).inject({ method: 'DELETE', uri, payload })
  }
}

module.exports = MakesHttpRequests
