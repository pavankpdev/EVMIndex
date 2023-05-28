import { compile, JSONSchema } from "json-schema-to-typescript";
import fs from "fs/promises";
import { join } from "path";
import { GraphQLNamedType, GraphQLSchema } from "graphql";
import {
    FieldDefinitionNode,
    ObjectTypeDefinitionNode,
} from "graphql/language/ast";
import * as console from "console";

type TypeField = {
    typeName: string;
    executableSchema: GraphQLSchema;
};
const customScalarsMapping: Record<string, any> = {
    Bytes: {
        type: "string",
        pattern: "^0x[0-9a-fA-F]{2}$",
    },
    BigInt: {
        type: "string",
    },
};
export const generateTypes = async (params: TypeField) => {
    const { executableSchema, typeName } = params;
    console.info("[⏳] Generating types for", typeName);
    const typeFields = (
        (executableSchema?.getType(typeName) as GraphQLNamedType)
            ?.astNode as ObjectTypeDefinitionNode & { fields: FieldDefinitionNode[] }
    )?.fields.map((field: any) => {
        return {
            name: field?.name?.value,
            type: field?.type?.type?.name?.value || field?.type?.name?.value,
            isRequired: field.type?.kind === "NonNullType",
        };
    });

    const TSGeneratorSchema: JSONSchema = {
        title: typeName,
        type: "object",
        properties: typeFields.reduce((acc: any, curr: any) => {
            if (customScalarsMapping[curr.type]) {
                acc[curr.name] = customScalarsMapping[curr.type];
                return acc;
            } else {
                acc[curr.name] = {
                    type: curr.type,
                };
                return acc;
            }
        }, {}),
        additionalProperties: false,
        required: typeFields
            .filter((field: any) => field.isRequired)
            .map((field: any) => field.name),
    };

    const ts = await compile(TSGeneratorSchema, typeName);

    console.log(ts)

    // create Types Directory if doesn't exist
    await fs.mkdir(join(__dirname, "../types"), { recursive: true });

    // Write TS to file
    await fs.appendFile(join(__dirname, "../types/generated.ts"), '');

    return typeFields;
};
