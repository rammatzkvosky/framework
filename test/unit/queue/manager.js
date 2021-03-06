'use strict'

const Config = require('../../../config')
const BaseTest = require('../../../base-test')
const QueueManager = require('../../../queue')

class QueueManagerTest extends BaseTest {
  async before () {
    Config.set('queue.driver', 'sync')
  }

  async serialResolvableDefaultConnection (t) {
    const manager = QueueManager

    class SyncConnector {
      connect () {}
      disconnect () {}
    }

    const connect = this
      .stub(SyncConnector.prototype, 'connect')
      .returns(new SyncConnector())

    const disconnect = this
      .stub(SyncConnector.prototype, 'disconnect')
      .callThrough()

    manager.addConnector('sync', SyncConnector)

    t.true(await manager.connection() instanceof SyncConnector)
    t.true(connect.calledOnce)

    await manager.stop()
    t.true(disconnect.calledOnce)

    connect.restore()
    disconnect.restore()
  }

  async serialResolvableConnection (t) {
    const manager = QueueManager

    class QueueConnector {
      connect () { }
    }

    const connect = this
      .stub(QueueConnector.prototype, 'connect')
      .returns(new QueueConnector())

    manager.addConnector('testing', QueueConnector)

    t.true(await manager.connection('testing') instanceof QueueConnector)
    t.true(manager.hasConnection('testing'))
    t.true(connect.calledOnce)

    connect.restore()
  }

  async serialRetrievesTheSameConnection (t) {
    const manager = QueueManager

    class SameQueueConnector {
      connect () { }
    }

    const connect = this
      .stub(SameQueueConnector.prototype, 'connect')
      .returns(new SameQueueConnector())

    const name = 'same-testing-connector'
    manager.addConnector(name, SameQueueConnector)

    const connection = await manager.connection(name)

    t.true(connection instanceof SameQueueConnector)
    t.is(await manager.connection(name), connection)

    connect.restore()
  }

  async throwsWhenRetrievingMissingConnector (t) {
    t.throws(() => QueueManager.getConnector('not-existent'))
  }
}

module.exports = new QueueManagerTest()
