import { createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
export async function connectToDB() {
  return createRxDatabase({
    name: 'evmindex',                   // <- name
    storage: getRxStorageDexie(),       // <- RxStorage
    multiInstance: true,                // <- multiInstance (optional, default: true)
    eventReduce: true,                  // <- eventReduce (optional, default: false)
  });
}