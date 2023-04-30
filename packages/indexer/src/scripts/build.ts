import {join} from "path";
import {importSchema} from "graphql-import"
const { makeExecutableSchema } = require('@graphql-tools/schema');
import {compile as JsonToTS, JSONSchema} from 'json-schema-to-typescript'

const schemaPath = join(__dirname, '../schema.graphql');
const typeDefs = importSchema(schemaPath);
const schema = makeExecutableSchema({ typeDefs });

// TODO: Get that "Approval" name reference dynamically
const typesArray = schema.getType('Approval')?.astNode?.fields.map((field: any) => {
    return {
        name: field?.name?.value,
        type: field?.type?.type?.name?.value || field?.type?.name?.value,
        isRequired: field.type?.kind === 'NonNullType'
    }
})

const customScalarsMapping: Record<string, any> = {
    Bytes: {
        type: 'string',
        "pattern": "^0x[0-9a-fA-F]{2}$"
    },
    BigInt: {
        anyOf: [
            { "type": "string" },
            { "type": "number" }
        ]
    },
}

const TSGeneratorSchema: JSONSchema = ({
    title: 'Approval',
    type: 'object',
    properties: typesArray.reduce((acc: any, curr: any) => {
        console.log(curr.type)
        if (customScalarsMapping[curr.type]) {
            acc[curr.name] = customScalarsMapping[curr.type]
            return acc
        } else {
            acc[curr.name] = {
                type: curr.type,
            }
            return acc
        }

    }, {}),
    additionalProperties: false,
    required: typesArray.filter((field: any) => field.isRequired).map((field: any) => field.name),
})
// @ts-ignore
JsonToTS(
    TSGeneratorSchema,
    "Approval",
).then((ts: any) => {
    console.log(ts)
})

// console.log(schema.getType('Approval')?._fields?.id?.astNode?.name?.value)
// console.log(schema.getType('Approval')?._fields?.id?.astNode?.type?.kind)
// console.log(schema.getType('Approval')?._fields?.id?.type?.ofType?.name)

// const models = composeWithMongoose(
//     mongoose.model('Approval', new mongoose.Schema({
//
//     })),
//     schemaComposer as any
// );
//
//
// mongoose.connect('mongodb://localhost:27017/nft').then(() => {
//     models.getResolver('createOne').resolve({
//         args: {
//             record: {
//                 id: 'Approval',
//                 owner: '0x123',
//                 approved: '0x123',
//                 tokenId: '123',
//                 blockNumber: '12',
//                 blockTimestamp: '12',
//                 transactionHash: '12',
//             }
//         }
//     })
//         .then((res: any) => {
//             console.log(res)
//         })
// })
//
//
//
