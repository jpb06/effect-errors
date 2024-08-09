# effect-errors

[![Open in Visual Studio Code](https://img.shields.io/static/v1?logo=visualstudiocode&label=&message=Open%20in%20Visual%20Studio%20Code&labelColor=2c2c32&color=007acc&logoColor=007acc)](https://github.dev/jpb06/effect-errors)
![npm bundle size](https://img.shields.io/bundlephobia/min/effect-errors)
![Github workflow](https://img.shields.io/github/actions/workflow/status/jpb06/effect-errors/ci.yml?branch=main&logo=github-actions&label=last%20workflow)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jpb06_effect-errors&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jpb06_effect-errors)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=jpb06_effect-errors&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=jpb06_effect-errors)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=jpb06_effect-errors&metric=security_rating)](https://sonarcloud.io/dashboard?id=jpb06_effect-errors)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=jpb06_effect-errors&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=jpb06_effect-errors)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=jpb06_effect-errors&metric=coverage)](https://sonarcloud.io/dashboard?id=jpb06_effect-errors)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=jpb06_effect-errors&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=jpb06_effect-errors)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=jpb06_effect-errors&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=jpb06_effect-errors)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=jpb06_effect-errors&metric=code_smells)](https://sonarcloud.io/dashboard?id=jpb06_effect-errors)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=jpb06_effect-errors&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jpb06_effect-errors)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=jpb06_effect-errors&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jpb06_effect-errors)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=jpb06_effect-errors&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=jpb06_effect-errors)
![Last commit](https://img.shields.io/github/last-commit/jpb06/effect-errors?logo=git)

Some sort of POC to improve the way [Effect](https://effect.website/) reports errors in a dev env 🤔

<!-- readme-package-icons start -->

<p align="left"><a href="https://docs.github.com/en/actions" target="_blank"><img height="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/GithubActions-Dark.svg" /></a>&nbsp;<a href="https://www.typescriptlang.org/docs/" target="_blank"><img height="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/TypeScript.svg" /></a>&nbsp;<a href="https://nodejs.org/en/docs/" target="_blank"><img height="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/NodeJS-Dark.svg" /></a>&nbsp;<a href="https://bun.sh/docs" target="_blank"><img height="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/Bun-Dark.svg" /></a>&nbsp;<a href="https://babeljs.io/docs/en/" target="_blank"><img height="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/Babel-Dark.svg" /></a>&nbsp;<a href="https://biomejs.dev/guides/getting-started/" target="_blank"><img height="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/Biome-Dark.svg" /></a>&nbsp;<a href="https://esbuild.github.io/getting-started/#install-esbuild" target="_blank"><img height="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/Esbuild-Dark.svg" /></a>&nbsp;<a href="https://vitest.dev/guide/" target="_blank"><img height="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/Vitest-Dark.svg" /></a>&nbsp;<a href="https://www.effect.website/docs/quickstart" target="_blank"><img height="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/Effect-Dark.svg" /></a></p>

<!-- readme-package-icons end -->

![example](./docs/parallel-errors-example.png)

## ⚡ So how does it work?

Had to re-export `runSync` and `runPromise` to apply `prettyPrint` function on the cause returned by a `catchAll`.

So using it would look like this :

```typescript
import { runPromise } from 'effect-errors';

await runPromise(
  Effect.gen(function* () {
    // ...
  }),
);
```

You can also directly import the `prettyPrint` function to do whatever with it if you want 🤷

```typescript
import { prettyPrint } from 'effect-errors';

await Effect.runPromise(
  pipe(
    Effect.gen(function* () {
      // ...
    }),
    Effect.sandbox,
    Effect.catchAll((e) => {
      console.error(prettyPrint(e));

      return Effect.fail('❌ runPromise failure') as never;
    }),
  ),
);
```

Signature is the following:

```typescript
const prettyPrint: <E>(cause: Cause<E>, options?: PrettyPrintOptions) => string;
```

`PrettyPrintOptions` allows you to tweak the following:

#### `enabled` - Whether pretty printing is enabled or not

> default: `true`

#### `stripCwd` - Whether spans and stacktrace should contain absolute or relative paths

> default: `false` (absolute paths)

#### `reverseSpans` - Whether spans order should reversed (entry point first instead of inner callee first)

> default: `true` (entry point first)

## ⚡ How should I raise errors?

The best way is to use either `SchemaError` or `TaggedError`.

### 🔶 `SchemaError`

Declaring the error could look like this:

```typescript
import { Schema } from '@effect/schema';

export class FileNotFoundError extends Schema.TaggedError<SchemaError>()(
  'FileNotFound',
  {
    cause: Schema.CauseDefectUnknown,
  },
) {}
```

You would then raise a `FileNotFoundError` to the error channel like this:

```typescript
Effect.tryPromise({
  try: () => ...,
  catch: (e) => new FileNotFoundError({ cause: e }),
});

// or raising directly
Effect.fail(new FileNotFoundError({ cause: "Oh no!" }));
```

### 🔶 `TaggedError`

```typescript
export class UserNotFoundError extends TaggedError('UserNotFound')<{
  cause?: unknown;
}> {}
```

You would then raise a `UserNotFoundError` to the error channel like this:

```typescript
Effect.tryPromise({
  try: () => ...,
  catch: (e) => new UserNotFoundError({ cause: e }),
});

// or raising directly
Effect.fail(new UserNotFoundError({ cause: "User does not exist" }));
```

### 🔶 Plain object

Alternatively, you _can_ use a plain object with a `_tag` and `message` attribute, but you won't get any stacktrace if you use this method:

```typescript
Effect.fail({ _tag: 'SucksToBeMe', message: 'Yeah...' });
```

## ⚡ Capturing errors data

You might want to apply your own logic to reported errors data; for example if you want to display errors in html. You can do so using `captureErrors`. The function has the following signature:

```typescript
interface ErrorSpan {
  name: string;
  attributes: ReadonlyMap<string, unknown>;
  status: SpanStatus;
}

interface ErrorData {
  errorType: unknown;
  message: unknown;
  stack?: string[];
  sources?: string[];
  spans?: ErrorSpan[];
  isPlainString: boolean;
}

interface CapturedErrors {
  interrupted: boolean;
  errors: ErrorData[];
}

interface CaptureErrorsOptions {
  reverseSpans?: boolean;
  stripCwd?: boolean;
}

const captureErrors: <E>(
  cause: Cause<E>,
  { reverseSpans, stripCwd }?: CaptureErrorsOptions,
) => CapturedErrors;
```

You can use `captureErrors` like so:

```typescript
import { captureErrors } from 'effect-errors';

await Effect.runPromise(
  pipe(
    effect,
    Effect.catchAll((e) => {
      const data = captureErrors(e);

      // ...
    }),
  ),
);
```

## ⚡ examples

### 🔶 error logging - `runPromise` / `runSync`

I wrote some examples for fun and giggles. You can run them using:

```bash
bun run-examples
```

### 🔶 Custom display for errors - `captureErrors`

You can check this [example using remix error boundaries](https://github.com/jpb06/remix-effect-errors).
