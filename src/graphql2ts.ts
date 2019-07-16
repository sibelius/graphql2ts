import { parse, DocumentNode } from 'graphql';
import fs from 'fs';
import path from 'path';
import {parse as babelParser } from '@babel/parser';
import generate from '@babel/generator';

const cwd = process.cwd();

(async () => {
  // if (process.argv.length !== 4) {
  //   console.log(`usage: ${process.argv[0]} ${process.argv[1]} schema.graphql`);
  //   return;
  // }

  const filename = path.join(cwd, process.argv[3] || 'schema.graphql');

  const schema = fs.readFileSync(filename, { encoding: 'utf8' });

  const document: DocumentNode = parse(schema);

  for (const definition of document.definitions) {
    switch (definition.kind) {
      case 'ObjectTypeDefinition':
        const { name, description, fields } = definition;

        // TODO - handle fields

        const code = `
          const ${name.value} = new GraphQLObjectType({
            name: '${name.value}',
            description: '${description.value}',
          });
        `;
        const ast = babelParser(code);
        const output = generate(ast);

        console.log(name.value);
        console.log(output);

        return ;
      case 'InputObjectTypeDefinition':
        return ;
      case 'EnumTypeDefinition':
        return ;
      case 'UnionTypeDefinition':
        return ;
      case 'InterfaceTypeDefinition':
        return;
    }
  }

  // TODO - transform document
  // console.log('document: ', document);
})();
