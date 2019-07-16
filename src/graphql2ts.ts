import {
  parse,
  DocumentNode,
  ObjectTypeDefinitionNode,
  InputObjectTypeDefinitionNode,
  EnumTypeDefinitionNode, UnionTypeDefinitionNode, InterfaceTypeDefinitionNode
} from 'graphql';
import {parse as babelParser } from '@babel/parser';
import generate from '@babel/generator';

export const objectTypeDefinition = (definition: ObjectTypeDefinitionNode) => {
  const { name, description, fields } = definition;

  console.log('definition ', definition);

  const descriptionCode = description ? `description: '${description.value}',` : '';

  const code = `
    const ${name.value} = new GraphQLObjectType({
      name: '${name.value}',
      ${descriptionCode}
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

  const definitionsTs = document.definitions.map(definition => {
    if (definition.kind in DEFINITION_TO_TS) {
      return DEFINITION_TO_TS[definition.kind](definition);
    }

    console.log('not implemented for: ', definition.kind);
    return ''
  });

  return definitionsTs.join('\n');
};
