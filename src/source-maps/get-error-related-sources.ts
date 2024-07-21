import { getErrorLocationFrom } from './get-error-location-from-file-path.js';
import { getSourceCode } from './get-source-code.js';
import {
  type ErrorRelatedSources,
  getSourcesFromMapFile,
} from './get-sources-from-map-file.js';

export const getErrorRelatedSources = async (
  sourceFile: string,
): Promise<ErrorRelatedSources | undefined> => {
  const location = getErrorLocationFrom(sourceFile);
  if (location === undefined) {
    return;
  }

  const { filePath, line, column } = location;

  if (filePath.endsWith('.ts')) {
    const source = await getSourceCode(location);

    return {
      runPath: `${filePath}:${line}:${column}`,
      sourcesPath: undefined,
      source,
    };
  }

  return await getSourcesFromMapFile(location);
};
