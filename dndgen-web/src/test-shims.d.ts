/**
 * TEMPORARY TEST SHIMS FOR MIGRATION
 * 
 * This file provides global type definitions for unmigrated test files that still use Jasmine syntax.
 * As each test file is migrated to Vitest, it will have explicit imports and won't use these shims.
 * 
 * This file will be REMOVED in Phase 8 after all test files are migrated.
 */

import type { 
  describe as vitestDescribe,
  it as vitestIt,
  expect as vitestExpect,
  beforeEach as vitestBeforeEach,
  afterEach as vitestAfterEach,
  vi as vitestVi
} from 'vitest';

declare global {
  const describe: typeof vitestDescribe;
  const it: typeof vitestIt;
  const expect: typeof vitestExpect;
  const beforeEach: typeof vitestBeforeEach;
  const afterEach: typeof vitestAfterEach;
  const vi: typeof vitestVi;
}

export {};
