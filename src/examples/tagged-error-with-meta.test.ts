import { describe, expect, it, vi } from 'vitest';

import { mockConsole } from '../tests/mocks/console.mock.js';
import { durationRegex } from '../tests/regex/duration.regex.js';
import { effectCause } from '../tests/runners/effect-cause.js';

import { stripAnsiCodes } from '../tests/util/strip-ansi-codes.util.js';
import { withMetaTaggedErrorTask } from './tagged-error-with-meta.js';

mockConsole({
  info: vi.fn(),
  error: vi.fn(),
});

describe('tagged-error-with-meta task', () => {
  it('should report one error', async () => {
    const cause = await effectCause(withMetaTaggedErrorTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toContain('1 error occured');
  });

  it('should display the error', async () => {
    const cause = await effectCause(withMetaTaggedErrorTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toContain(' WithMeta ');
    expect(result).toContain(' • Oh no! I failed!');
  });

  it('should display spans', async () => {
    const cause = await effectCause(withMetaTaggedErrorTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);
    const raw = stripAnsiCodes(result);

    expect(result).toContain('◯');
    expect(raw).toContain('├─ at withMetaTaggedErrorTask');
    expect(raw).toContain('╰─ at subTask');
    expect(raw.match(durationRegex)).toHaveLength(2);
  });

  it('should display span attributes', async () => {
    const cause = await effectCause(withMetaTaggedErrorTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);
    const raw = stripAnsiCodes(result);

    expect(raw).toContain('│     struff: awoowoo');
    expect(raw).toContain('      cool: true');
    expect(raw).toContain('      yolo: bro');
  });

  it('should display the stack', async () => {
    const cause = await effectCause(withMetaTaggedErrorTask);

    const { prettyPrint } = await import('./../pretty-print.js');
    const result = prettyPrint(cause);

    expect(result).toContain('🚨 Node Stacktrace');
    expect(result).toContain('🚨 Spans Stacktrace');
    expect(result).toMatch(
      /│ at .*\/effect-errors\/src\/examples\/tagged-error-with-meta\.ts:17:47/,
    );
    expect(result).toMatch(
      /│ at .*\/effect-errors\/src\/examples\/tagged-error-with-meta\.ts:10:24/,
    );
  });
});
