'use strict'

const BaseTest = require('@root/testing/base-test')
const Hashinator = require('@root/hashing/bcrypt-hashinator')

class BcryptHashinatorTest extends BaseTest {
  async makeBcryptHash (t) {
    const hasher = new Hashinator()
    t.truthy(await hasher.make('Supercharge'))
  }

  async verifyBcryptHash (t) {
    const hasher = new Hashinator()
    const hash = await hasher.make('Supercharge')
    t.true(await hasher.check('Supercharge', hash))
  }
}

module.exports = new BcryptHashinatorTest()
