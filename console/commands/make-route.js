'use strict'

const Path = require('path')
const Helper = require('../../helper')
const Fs = require('../../filesystem')
const Handlebars = require('handlebars')
const BaseCommand = require('../base-command')

class MakeRoute extends BaseCommand {
  constructor () {
    super()

    this.stub = Path.resolve(__dirname, '..', 'stubs', 'make', 'route', 'route.stub')
  }

  /**
   * Returns the command signature.
   */
  static get signature () {
    return `
      make:route
        { filename: Name of your route file }
  `
  }

  /**
   * Returns the command description.
   */
  static get description () {
    return 'Scaffold a new route'
  }

  /**
   * Handle the command.
   */
  async handle ({ filename }) {
    await this.run(async () => {
      const file = filename.endsWith('.js') ? filename : `${filename}.js`

      if (await this.pathExists(Helper.routesPath(file))) {
        if (!await this.confirm(`The route [${file}] exists already. Replace it?`)) {
          return
        }
      }

      const stubContent = await this.getFileContent(this.stub)
      const template = Handlebars.compile(stubContent)
      const content = template({ routePath: await Fs.filename(file) })

      await this.writeFile(Helper.routesPath(file), content)

      this.completed('created', `routes/${file}`)
    })
  }
}

module.exports = MakeRoute
