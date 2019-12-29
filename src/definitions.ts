import {
  ObjectTypeDefinitionNode,
  FieldDefinitionNode,
  TypeNode,
  StringValueNode,
  InputValueDefinitionNode,
  DefinitionNode,
} from 'graphql';
import { parse as babelParser } from '@babel/parser';
import generate from '@babel/generator';

export const typedNode = (type: TypeNode): string => {
  switch (type.kind) {
    case 'NamedType':
      return type.name.value;
    case 'ListType':
      return `new GraphQLList(${typedNode(type.type)})`;
    case 'NonNullType':
      return `new GraphQLNonNull(${typedNode(type.type)})`;
    default:
      return '';
  }
};

export const descriptionDefinition = (description?: StringValueNode) => {
  return description ? `description: '${description.value}',` : '';
};

export const inputValueDefinitionNode = (input: InputValueDefinitionNode) => {
  const { name, description, type } = input;

  const code = `
    ${name.value}: {
      type: ${typedNode(type)},
      ${descriptionDefinition(description)}
    },
  `;

  return code;
};

export const fieldDefinition = (field: FieldDefinitionNode) => {
  const { name, description, type } = field;

  const argCode =
    field.arguments?.map((arg) => inputValueDefinitionNode(arg)) ?? [];

  const args =
    argCode.length > 0
      ? `
      args: {
        ${argCode.join('\n')}
      }
    `
      : '';

  const code = `
    ${name.value}: {
      type: ${typedNode(type)},
      ${descriptionDefinition(description)}
      ${args}
    },
  `;

  return code;
};

export const objectTypeDefinition = (definition: ObjectTypeDefinitionNode) => {
  const { name, description, fields } = definition;

  const fieldsCode =
    fields?.map((field) => fieldDefinition(field)).join('\n') ?? [];

  const code = `
    const ${name.value} = new GraphQLObjectType({
      name: '${name.value}',
      ${descriptionDefinition(description)}
      fields: () => ({
        ${fieldsCode}
      })
    });
  `;
  const ast = babelParser(code);

  const output = generate(ast);

  return output.code;
};

export const passThroughDefinition = () => '';

type Definitions = {
  [K in DefinitionNode['kind']]: (def?: DefinitionNode) => string;
};

export const definitions = {
  ObjectTypeDefinition: objectTypeDefinition,
  InputObjectTypeDefinition: passThroughDefinition,
  EnumTypeDefinition: passThroughDefinition,
  UnionTypeDefinition: passThroughDefinition,
  InterfaceTypeDefinition: passThroughDefinition,
} as Definitions;
