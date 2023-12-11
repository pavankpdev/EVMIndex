import { EVMIndex } from '../'

describe('EVMIndex Class', () => {
  let evmIndex: EVMIndex

  beforeEach(() => {
    evmIndex = new EVMIndex()
  })

  it('should be able to create an instance', () => {
    expect(evmIndex).toBeInstanceOf(EVMIndex)
  })
})
