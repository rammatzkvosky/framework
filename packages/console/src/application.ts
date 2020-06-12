'use strict'

import { CAC } from 'cac'
import { Parser } from './parser'
import { ConsoleInput } from './input'
import { Command as CommandInstance } from './command'
import { Command, ConsoleApplication as ConsoleApplicationContract, Application as App } from '@supercharge/contracts'

export class Application implements ConsoleApplicationContract {
  /**
   * The application instance
   */
  private readonly app: App

  /**
   * The CLI application instance. We use the CAC library as the
   * underlying CLI framework. All Supercharge and app commands
   * will be translated and registered to the CAC instance.
   */
  private readonly cli: CAC

  /**
   * The list of commands.
   */
  public static commands: Command[]

  /**
   * Create a new console application instance.
   *
   * @param app
   */
  constructor (app: App) {
    this.app = app
    this.cli = this.createCli()
  }

  /**
   * Create a CLI instance.
   *
   * @returns {CAC}
   */
  createCli (): CAC {
    return new CAC('Supercharge Craft')
      .version(this.app.version())
      .help()
  }

  /**
   * Runs the incoming console command for the given `input`.
   *
   * @param {Array} input - command line arguments (process.argv)
   *
   * @returns {Promise}
   */
  async run (input: string[]): Promise<any> {
    await this.registerCommands()

    return this.cli.parse(input)
  }

  /**
   * Register
   */
  async registerCommands (): Promise<void> {
    Application.commands.forEach((command: Command) => {
      this.registerCommand(command)
    })
  }

  /**
   * Register the given console command.
   *
   * @param {Command} candidate
   */
  registerCommand (candidate: Command): void {
    const command = this.resolve(candidate)

    const { name, parameters, options } = this.parse(command.signature())

    const cliCommand = this.cli
      .command(`${name} ${parameters.translateToCacInput()}`, command.description())
      .action(async (...inputs) => {
        await command.handle(...inputs)
      })

    options.forEach((option: ConsoleInput) => {
      cliCommand.option(option.translateToCacInput(), option.getDescription(), {
        default: option.getDefault()
      })
    })
  }

  /**
   * Create a new instance of the given command.
   *
   * @param CommandConstructor
   *
   * @returns {CommandInstance}
   */
  resolve (CommandConstructor: Command): CommandInstance {
    return new CommandConstructor()
  }

  /**
   * Parse the given command `signature`.
   *
   * @param {String} signature
   *
   * @returns {Object}
   */
  parse (signature: string) {
    return Parser.parse(signature)
  }
}