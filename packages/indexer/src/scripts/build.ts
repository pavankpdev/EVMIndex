import {join} from "path";
import {importSchema} from "graphql-import"
const { makeExecutableSchema } = require('@graphql-tools/schema');
import {
    GraphQLSchema,
    buildClientSchema,
    GraphQLObjectType
} from 'graphql';
import { introspectionFromSchema } from 'graphql/utilities/introspectionFromSchema';
import {deleteGeneratedTypes} from "../utils/deleteGeneratedTypes";
import {generateTypes} from "../utils/generateTypes";
import {generateModels} from "../utils/generateModels";
import {deleteGeneratedModels} from "../utils/deleteGeneratedModels";

function getTypesListFromSchema(schema: GraphQLSchema) {
    const introspection = introspectionFromSchema(schema);
    const clientSchema = buildClientSchema(introspection);
    const types = clientSchema.getTypeMap();
    return Object.values(types).filter((type: any) => (type instanceof GraphQLObjectType && type.name !== 'Query' && type.name !== 'Mutation' && !type.name.startsWith('__'))).map((type: any) => type?.name)

}

const schemaPath = join(__dirname, '../schema.graphql');
const typeDefs = importSchema(schemaPath);
const executableSchema = makeExecutableSchema({ typeDefs });

const build = async () => {
    await deleteGeneratedTypes();
    const typesList = getTypesListFromSchema(executableSchema);
    for (let i = 0; i < typesList.length; i++) {
        const typeName = typesList[i];
        await deleteGeneratedModels(typeName)
        // TODO: check for duplicate type names
        await generateTypes({typeName, executableSchema})
        await generateModels(typeName)
    }
}

build()
    .then(() => {
        console.log('Build successful')
        process.exit(0)
    })
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
    .finally(() => {
        console.log('Build finished')
    })



