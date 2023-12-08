import "fake-indexeddb/auto";
import { createRxDatabase, addRxPlugin } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';

export class DatabaseConnection {
  private static _instance: DatabaseConnection;
  private _db: any;

  private constructor() {
    this.connectToDB().then((rxdb) => {
      this._db = rxdb
    })
  }

  private async connectToDB() {
    addRxPlugin(RxDBUpdatePlugin);

    return createRxDatabase({
      name: 'evmindex',
      storage: getRxStorageDexie(),
      multiInstance: true,
      eventReduce: true,
    });
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection._instance) {
      DatabaseConnection._instance = new DatabaseConnection();
    }
    return DatabaseConnection._instance;
  }

  public getDB() {
    return this._db;
  }
}