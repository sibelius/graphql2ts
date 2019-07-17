import yargs from 'yargs';

import fs from "fs";
import { graphql2ts } from './graphql2ts';
import path from "path";
import { promisify } from 'util';

const cwd = process.cwd();

const writeFileAsync = promisify(fs.writeFile);

type Argv = {
  src: string,
  keyMaxLength: number,
}

export const run = async (argv: Argv) => {
  argv = yargs(argv || process.argv.slice(2))
    .usage(
      'Transform .graphql file to .graphql-js .ts file'
    )
    .default('graphql', 'schema.graphql')
    .describe(
      'graphql',
      'The .graphql file'
    )
    .default('output', 'schema.ts')
    .describe(
      'output',
      'the schema.ts output file',
    )
    .argv;

  const filename = path.join(cwd, argv.graphql);

  const source = fs.readFileSync(filename, { encoding: 'utf8' });

  const result = await graphql2ts(source);

  console.log('result: ', result);

  await writeFileAsync(path.join(cwd, argv.output), result);
};
