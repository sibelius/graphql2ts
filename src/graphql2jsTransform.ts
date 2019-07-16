import { API, FileInfo, Options } from 'jscodeshift';
import fs from 'fs';

function transform(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift; // alias the jscodeshift API

  const filePath = file.path.replace(/\.js$/, '.graphql');

  const root = j(file.source); // parse JS code into an AST

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: false,
    lineTerminator: '\n',
  };

  root
    .find(j.ObjectTypeDefinition)
    .forEach(path => {
      console.log('node: ', path);
    });

  return root.toSource(printOptions);
}

module.exports = transform;
// module.exports.parser = 'tsx';
