import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  test: {
    globals: true,
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
