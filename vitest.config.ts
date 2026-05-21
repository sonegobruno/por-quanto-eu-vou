/// <reference types="vitest/config" />
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const workspaceRoot = path.dirname(fileURLToPath(import.meta.url));

/**
 * Supplemental Vitest config merged by @angular/build:unit-test (via runnerConfig).
 * Do not set test.include or test.projects — the Angular builder controls those.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@app': path.resolve(workspaceRoot, 'src/app'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    clearMocks: true,
    coverage: {
      provider: 'v8',
      reportsDirectory: path.resolve(workspaceRoot, 'coverage'),
      reporter: ['text', 'html', 'lcov'],
      include: ['src/app/**/*.ts'],
      exclude: [
        'src/**/*.spec.ts',
        'src/test-setup.ts',
        'src/main.ts',
        'src/main.server.ts',
        'src/server.ts',
      ],
    },
  },
});
