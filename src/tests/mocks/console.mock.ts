import { type Mock, vi } from 'vitest';

interface ConsoleMockingArgs {
  error?: Mock;
  info?: Mock;
  log?: Mock;
  warn?: Mock;
}

export const mockConsole = async (args: ConsoleMockingArgs) => {
  global.console = {
    ...(await vi.importActual('node:console')),
    ...args,
  };
};
