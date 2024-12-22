import color from 'picocolors';

import type {
  ErrorRelatedSources,
  ErrorSpan,
  PrettyPrintOptions,
} from '../../../index.js';
import { stripCwdPath } from '../../strip-cwd-path.js';

export const printEffectStacktrace = (
  sources: Omit<ErrorRelatedSources, '_tag'>[] | undefined,
  spans: ErrorSpan[] | undefined,
  { stripCwd }: PrettyPrintOptions,
) => {
  if (
    spans === undefined ||
    spans.length === 0 ||
    sources === undefined ||
    sources.length === 0
  ) {
    return [];
  }

  const paths = sources.map(({ name, runPath, sourcesPath }) => {
    const path = sourcesPath !== undefined ? sourcesPath : runPath;
    return { path: stripCwd ? stripCwdPath(path) : path, name };
  });

  return [
    `${color.bold(color.red('◯'))} ${color.red('Sources')} 🕵️`,
    ...paths.map(({ path, name }) =>
      color.red(
        `│ at ${name.length === 0 ? 'module code' : color.underline(name)} (${path})`,
      ),
    ),
    color.red('┴'),
  ];
};
