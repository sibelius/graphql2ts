import yargs from 'yargs';

import fs from 'fs';
import { graphql2ts } from './graphql2ts';
import path from 'path';
import { promisify } from 'util';

const cwd = process.cwd();

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

export const run = async () => {
  const { graphql, output } = yargs(process.argv.slice(2))
    .usage('Transform .graphql file to .graphql-js .ts file')
    .default('graphql', 'schema.graphql')
    .describe('graphql', 'The .graphql file')
    .default('output', 'schema.ts')
    .describe('output', 'the schema.ts output file').argv;

  const filename = path.join(cwd, graphql);
  const source = await readFileAsync(filename, { encoding: 'utf8' });
  const result = graphql2ts(source);

  console.log(result);

  await writeFileAsync(path.join(cwd, output), result);
};
