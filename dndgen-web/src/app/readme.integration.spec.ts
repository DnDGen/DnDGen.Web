import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { routes } from './app.routes';
import packageJson from '../../package.json';

const __filename = fileURLToPath(import.meta.url);
const __dir = dirname(__filename);
const readme = readFileSync(resolve(__dir, '../../README.md'), 'utf-8');

const nonCiTestScripts = Object.keys(packageJson.scripts)
    .filter(s => s === 'test' || (s.startsWith('test:') && !s.includes(':ci')));

const nonGeneratorPaths = ['', 'home', 'error', '**'];
const generatorPaths = routes
    .filter(r => typeof r.path === 'string' && !nonGeneratorPaths.includes(r.path as string))
    .map(r => r.path as string);

describe('DnDGen Web README', () => {
    describe('npm scripts', () => {
        it.each(nonCiTestScripts)("documents the '%s' npm script", (script) => {
            expect(readme).toContain(`\`npm run ${script}\``);
        });
    });

    describe('generators', () => {
        it.each(generatorPaths)('documents the %s generator', (path) => {
            const name = path.charAt(0).toUpperCase() + path.slice(1);
            expect(readme).toContain(`**${name}**`);
        });
    });
});
