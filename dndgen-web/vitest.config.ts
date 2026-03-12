/**
 * VITEST CONFIGURATION - NOT USED BY DEFAULT
 * 
 * This file is NOT automatically used by Angular CLI's test builder.
 * It serves as documentation for test configuration and is only used when:
 * - Explicitly specified via CLI: `ng test --config vitest.config.ts`
 * - Referenced in package.json scripts
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
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    watch: false,
    
    // Local settings (from karma.conf.js):
    testTimeout: 10000,  // 10 seconds
    hookTimeout: 10000,
    bail: 1,  // Fail fast (equivalent to oneFailurePerSpec, stopSpecOnExpectationFailure, failFast)
    
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['**/*.spec.ts', '**/*.config.ts']
    },
    
    reporters: ['default'],  // Progress only
    
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
