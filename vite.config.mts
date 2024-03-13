import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./src/tests/matchers'],
    coverage: {
      reporter: ['text', 'json', 'html', 'lcov', 'json-summary'],
      all: true,
      include: ['src/**/*.ts'],
      exclude: [
        'src/tests/**/*',
        'src/**/*.type.ts',
        'src/**/index.ts',
        'src/types',
        'src/**/*.test.ts',
        'src/examples',
        'src/runners',
        'src/config',
      ],
    },
  },
});
