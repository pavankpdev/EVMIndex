import {RxDatabase} from "rxdb";

export const ContractSchema = {
    name: "Contract Schema",
    "version": 0,
    "description": "Contract Schema that can be used to store registered contracts",
    "primaryKey": "id",
    "type": "object",
    properties: {
        id: {
            type: "string",
            primary: true,
        },
        name: {
            type: "string",
        },
        address: {
            type: "string",
        },
        abi: {
            type: "array",
        },
        startBlock: {
            type: "number",
        },
        webhooks: {
            type: "array",
        }
    }
}

export const getContractCollection = async (db: RxDatabase) =>  db.addCollections({
    contracts: {
        schema: ContractSchema,
    }
})