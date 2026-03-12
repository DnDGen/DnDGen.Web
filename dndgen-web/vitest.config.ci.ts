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
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    watch: false,
    
    // CI settings (from karma.conf.ci.js):
    testTimeout: 60000,  // 60 seconds (1000 * 60)
    hookTimeout: 60000,
    // No bail - run all tests (equivalent to disabling oneFailurePerSpec, etc.)
    
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['**/*.spec.ts', '**/*.config.ts']
    },
    
    // JUnit reporter for CI
    // Note: outputFile is specified via CLI argument (--outputFile.junit) in package.json scripts
    // This allows each test command to specify its own output filename
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
