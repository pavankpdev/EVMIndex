import {join} from "path";
import {importSchema} from "graphql-import"
import {composeWithMongoose, composeWithMongooseDiscriminators} from "graphql-compose-mongoose";
import mongoose from "mongoose";
import {schemaComposer} from "graphql-compose";
const { composeMongoose } = require('graphql-compose-mongoose');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const schemaPath = join(__dirname, '../schema.graphql');
const typeDefs = importSchema(schemaPath);
const schema = makeExecutableSchema({ typeDefs });

const typesArray = schema.getType('Approval')?.astNode?.fields.map((field: any) => {
    return {
        name: field?.name?.value,
        type: field?.type?.type?.name?.value || field?.type?.name?.value,
        isRequired: field.type?.kind === 'NonNullType'
    }
})

console.log(typesArray)

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
