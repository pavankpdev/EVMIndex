import 'fake-indexeddb/auto'
import { createRxDatabase } from 'rxdb'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'

export class DatabaseConnection {
  private static _instance: DatabaseConnection
  private _db: any

  private constructor() {
    this.connectToDB().then((rxdb) => {
      this._db = rxdb
    })
  }

  private async connectToDB() {
    return createRxDatabase({
      name: 'evmindex',
      storage: getRxStorageDexie(),
      multiInstance: true,
      eventReduce: true,
    })
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection._instance) {
      DatabaseConnection._instance = new DatabaseConnection()
    }
    return DatabaseConnection._instance
  }

  public getDB() {
    return this._db
  }
}
