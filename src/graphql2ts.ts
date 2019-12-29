import { parse, DocumentNode } from 'graphql';
import prettier from 'prettier';

import { definitions } from './definitions';

export const graphql2ts = (source: string) => {
  const document: DocumentNode = parse(source);

  const definitionsTs = document.definitions.slice(0, 5).map((definition) => {
    if (definition.kind in definitions) {
      return definitions[definition.kind](definition);
    }

    console.error('not implemented for: ', definition.kind);
    return '';
  });

  return prettier.format(definitionsTs.join('\n'), { parser: 'babel' });
};
