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
    reporters: ['default', 'junit'],
    env: {
      VITE_WEB_API_URL: 'http://localhost:7071',
      VITE_ROLL_API_URL: 'http://localhost:7071',
      VITE_TREASURE_API_URL: 'http://localhost:7071',
      VITE_CHARACTER_API_URL: 'http://localhost:7071',
      VITE_ENCOUNTER_API_URL: 'http://localhost:7071',
      VITE_DUNGEON_API_URL: 'http://localhost:7071',
    },
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
