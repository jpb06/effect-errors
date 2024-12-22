import { defineConfig } from 'vitest/config';

// biome-ignore lint/style/noDefaultExport: vitest config
export default defineConfig({
  test: {
    //setupFiles: ['./src/tests/matchers'],
    coverage: {
      reporter: ['text', 'json', 'html', 'lcov', 'json-summary'],
      all: true,
      include: ['src/**/*.ts'],
      exclude: [
        'src/tests',
        'src/types',
        'src/temp',
        'src/examples',
        'src/runners',
        'src/config',
        '**/index.ts',
        '**/*.d.ts',
        '**/*.type.ts',
        '**/*.test.ts',
      ],
    },
  },
});
