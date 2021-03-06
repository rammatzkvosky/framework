'use strict'

const Path = require('path')
const Fs = require('../filesystem')
const Ace = require('@adonisjs/ace')
const Collect = require('@supercharge/collections')

class ConsoleKernel {
  constructor () {
    this._kernel = Ace
  }

  /**
   * Load all console commands coming from the
   * framework’s core and user-land bootstrappers.
   */
  async bootstrap () {
    await Collect(
      await this.loadCommandFiles()
    ).forEach(commandFile => {
      this.addCommand(require(commandFile))
    })
  }

  /**
   * Load all core commands files.
   *
   * @returns {Array}
   */
  async loadCommandFiles () {
    return Fs.allFiles(Path.resolve(__dirname, 'commands'), {
      ignore: ['command.js']
    })
  }

  /**
   * Add a command to the console kernel.
   *
   * @param {Class} command
   */
  addCommand (command) {
    this._kernel.addCommand(command)
  }

  /**
   * Start the console kernel.
   */
  start () {
    this._kernel.wireUpWithCommander()
    this._kernel.invoke()
  }
}

module.exports = ConsoleKernel
