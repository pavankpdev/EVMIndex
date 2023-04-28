import gqlToMongoDB from 'graphql-to-mongodb';
import {loadSchemaSync} from "@graphql-tools/load";
import {GraphQLFileLoader} from "@graphql-tools/graphql-file-loader";
import {MongoClient} from "mongodb";
import {addResolversToSchema} from "@graphql-tools/schema";
import {join} from "path";
import {importSchema} from "graphql-import"

const schemaPath = join(__dirname, '../schema.graphql');

// FIXME: unable to parse Bytes type
const typeDefs = importSchema(schemaPath);

const schema = loadSchemaSync(schemaPath, {
    loaders: [new GraphQLFileLoader()],
});

// TODO: gql to mongo modal