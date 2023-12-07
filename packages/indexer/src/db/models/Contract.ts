import {ExtractDocumentTypeFromTypedRxJsonSchema, RxDatabase, RxJsonSchema, toTypedRxJsonSchema} from "rxdb";

export const ContractSchemaLiteral = {
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
    },
    required: ['id', 'name', 'address', 'abi']
} as const;

const schemaTyped = toTypedRxJsonSchema(ContractSchemaLiteral);

// aggregate the document type from the schema
export type ContractType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;

// create the typed RxJsonSchema from the literal typed object.
export const ContractSchema: RxJsonSchema<ContractType> = ContractSchemaLiteral;

export const getContractCollection = async (db: RxDatabase) =>  db.addCollections({
    contracts: {
        schema: ContractSchema,
    }
})