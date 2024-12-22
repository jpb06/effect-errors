import { Effect, pipe } from 'effect';

import { removeNodeModulesEntriesFromStack } from '../logic/spans/maybe-add-error-to-spans-stack.js';
import { maybeMapSourcemaps } from './maybe-map-sourcemaps.js';

export const getSourcesFromStack = (maybeStack: string | undefined) =>
  pipe(
    Effect.gen(function* () {
      if (maybeStack === undefined) {
        return {
          sources: [],
          location: [],
        };
      }

      const relevantStackEntries =
        removeNodeModulesEntriesFromStack(maybeStack);
      const sourcesOrLocation = yield* maybeMapSourcemaps(
        '',
        relevantStackEntries,
      );

      return {
        sources: sourcesOrLocation.filter((el) => el._tag === 'sources'),
        location: sourcesOrLocation.filter((el) => el._tag === 'location'),
      };
    }),
    Effect.withSpan('get-sources-from-stack'),
  );
