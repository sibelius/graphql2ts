import path from "path";
import fs from "fs";
import { promisify } from 'util';
import { graphql2ts } from './graphql2ts';

const writeFileAsync = promisify(fs.writeFile);

const cwd = process.cwd();

(async () => {
  // if (process.argv.length !== 4) {
  //   console.log(`usage: ${process.argv[0]} ${process.argv[1]} schema.graphql`);
  //   return;
  // }

  const filename = path.join(cwd, process.argv[3] || 'schema.graphql');

  const source = fs.readFileSync(filename, { encoding: 'utf8' });

  const result = await graphql2ts(source);

  console.log('result: ', result);

  await writeFileAsync(path.join(cwd, 'schema.ts'), result);
})();
