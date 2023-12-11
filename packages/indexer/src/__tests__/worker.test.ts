import { WorkerNode } from '@/lib/worker'
import path from 'path'

describe('WorkerNode Class', () => {
  let workerNode: WorkerNode

  beforeEach(() => {
    workerNode = new WorkerNode()
  })

  afterEach(async () => {
    const workerNode = new WorkerNode()
    await workerNode.terminateAllWorkers()
  })

  it('should be able to create an instance', () => {
    expect(workerNode).toBeInstanceOf(WorkerNode)
  })

  it('should be able to create a worker node ', () => {
    const workerId = workerNode.createWorker({
      path: path.resolve(__dirname, '..', '__worker.js'),
    })

    expect(workerId).toBeDefined()
    expect(workerId).toEqual(0)
  })

  it('should be able to send a message to a worker node', async () => {
    const workerId = workerNode.createWorker({
      path: path.resolve(__dirname, '..', '__worker.js'),
    })
    const message = 'Hello World'
    workerNode.sendToWorker(workerId, message)
  })
})
