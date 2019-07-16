import {
  parse,
  DocumentNode,
  ObjectTypeDefinitionNode,
  InputObjectTypeDefinitionNode,
  EnumTypeDefinitionNode,
  UnionTypeDefinitionNode,
  InterfaceTypeDefinitionNode,
  FieldDefinitionNode,
  TypeNode,
  StringValueNode, InputValueDefinitionNode
} from 'graphql';
import {parse as babelParser } from '@babel/parser';
import generate from '@babel/generator';

export const typedNode = (type: TypeNode) => {
  switch (type.kind) {
    case 'NamedType':
      return type.name.value;
    case 'ListType':
      return `GraphQLList(${typedNode(type.type)})`;
    case 'NonNullType':
      return `GraphQLNonNull(${typedNode(type.type)})`;
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

  const argCode = field.arguments.map(arg => inputValueDefinitionNode(arg));

  const args = argCode.length > 0
    ? `
      args: {
        ${argCode.join('\n')}
      }
    ` : '';

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

  const fieldsCode = fields.map(field => fieldDefinition(field)).join('\n');

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

export const inputObjectTypeDefinition = (definition: InputObjectTypeDefinitionNode) => {
  return '';
};

export const enumTypeDefinition = (definition: EnumTypeDefinitionNode) => {
  return '';
};

export const unionTypeDefinition = (definition: UnionTypeDefinitionNode) => {
  return '';
};

export const interfaceTypeDefinition = (definition: InterfaceTypeDefinitionNode) => {
  return '';
};

const DEFINITION_TO_TS = {
  ObjectTypeDefinition: objectTypeDefinition,
  InputObjectTypeDefinition: inputObjectTypeDefinition,
  EnumTypeDefinition: enumTypeDefinition,
  UnionTypeDefinition: unionTypeDefinition,
  InterfaceTypeDefinition: interfaceTypeDefinition,
};

export const graphql2ts = (source: string) => {
  const document: DocumentNode = parse(source);

  const definitionsTs = document.definitions.slice(0,5).map(definition => {
    if (definition.kind in DEFINITION_TO_TS) {
      return DEFINITION_TO_TS[definition.kind](definition);
    }

    console.log('not implemented for: ', definition.kind);
    return ''
  });

  return definitionsTs.join('\n');
};
