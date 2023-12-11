import { parentPort, workerData } from 'worker_threads'

const run = async () => {
  console.log('Running Worker in background', Date.now())
  console.log(workerData)
  return 'EVMIndex running in background lol'
}

export const workersManager = () => {
  run()
  return 'EVMIndex running in background'
}

if (parentPort) parentPort.postMessage(workersManager())
