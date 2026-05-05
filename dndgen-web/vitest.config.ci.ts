/**
 * VITEST CI CONFIGURATION - NOT USED BY DEFAULT
 * 
 * This file is NOT automatically used by Angular CLI's test builder.
 * It serves as documentation for CI test configuration and is only used when:
 * - Explicitly specified via CLI: `ng test --config vitest.config.ci.ts`
 * - Referenced in package.json scripts (e.g., test:ci, test:cd:*)
 * 
 * By default, `ng test` uses Angular's built-in Vitest integration configured in angular.json.
 */
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
    
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['**/*.spec.ts', '**/*.config.ts']
    },
    
    reporters: ['verbose', 'junit'],
    
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
