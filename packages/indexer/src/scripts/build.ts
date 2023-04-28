import {loadSchemaSync} from "@graphql-tools/load";
import {GraphQLFileLoader} from "@graphql-tools/graphql-file-loader";
import {join} from "path";
import {importSchema} from "graphql-import"

const schemaPath = join(__dirname, '../schema.graphql');

// FIXME: unable to parse Bytes type
const typeDefs = importSchema(schemaPath);

const schema = loadSchemaSync(schemaPath, {
    loaders: [new GraphQLFileLoader()],
});

// TODO: gql to mongo modal