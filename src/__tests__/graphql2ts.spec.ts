import path from 'path';
import fs from 'fs';

import { graphql2ts } from '../graphql2ts';

const defineTest = (dirName: string, testFilePrefix: string, only = false) => {
  const testName = `transforms correctly ${testFilePrefix}`;

  const myIt = only ? it.only : it;

  myIt(testName, () => {
    const fixtureDir = path.join(dirName, '..', '__testfixtures__');
    const inputPath = path.join(fixtureDir, testFilePrefix + '.graphql');
    const expectedOutput = fs.readFileSync(
      path.join(fixtureDir, testFilePrefix + '.ts'),
      'utf8'
    );

    const source = fs.readFileSync(inputPath, { encoding: 'utf8' });

    const result = graphql2ts(source);

    expect(result.trim()).toEqual(expectedOutput.trim());
  });
};

describe('graphql2ts', () => {
  defineTest(__dirname, 'simple');
});
