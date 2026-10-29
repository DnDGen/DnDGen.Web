import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  test: {
    globals: false,
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    watch: false,
    testTimeout: 60000,
    hookTimeout: 60000,
    pool: 'forks',
    retry: 1,

    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['**/*.spec.ts', '**/*.config.ts']
    },

    reporters: ['default', 'junit'],

    server: {
      deps: {
        inline: ['@angular/**', '@ng-bootstrap/**']
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
