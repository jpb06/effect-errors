import fs from 'fs';

export const getExampleSources = async (
  file: 'from-promise' | 'parallel-errors',
) =>
  await fs.promises.readFile(`./src/examples/${file}.ts`, {
    encoding: 'utf-8',
  });
