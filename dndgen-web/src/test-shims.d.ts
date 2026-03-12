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
  vi as vitestVi,
  TestFunction
} from 'vitest';

// Done callback type for Jasmine-style async tests
type DoneCallback = () => void;

// Jasmine spy interface with .and property
interface JasmineSpy {
  (...args: any[]): any;
  and: {
    returnValue(value: any): any;
    returnValues(...values: any[]): any;
    callFake(fn: any): any;
    stub(): any;
    resolveTo(value: any): any;
    rejectWith(value: any): any;
  };
  calls: {
    first(): { args: any[] };
    argsFor(index: number): any[];
    count(): number;
    all(): { args: any[] }[];
    allArgs(): any[][];
    any(): boolean;
    mostRecent(): { args: any[] };
    reset(): void;
  };
}

declare global {
  // Override it/test to support done callback
  const describe: typeof vitestDescribe;
  const xdescribe: typeof vitestDescribe.skip;
  const fdescribe: typeof vitestDescribe.only;
  const it: {
    (name: string, fn?: (done: DoneCallback) => void | Promise<void>, timeout?: number): void;
    skip: typeof vitestIt.skip;
    only: typeof vitestIt.only;
  };
  const xit: typeof vitestIt.skip;
  const fit: typeof vitestIt.only;
  const expect: typeof vitestExpect;
  const beforeEach: typeof vitestBeforeEach;
  const afterEach: typeof vitestAfterEach;
  const vi: typeof vitestVi;
  
  // Jasmine spy compatibility - returns JasmineSpy
  function spyOn<T, K extends keyof T>(obj: T, method: K): JasmineSpy;
  
  // Jasmine namespace for matchers and spy creation
  namespace jasmine {
    function createSpyObj<T = any>(baseName: string, methodNames: string[]): SpyObj<T>;
    function any(constructor: any): any;
    function stringMatching(pattern: string | RegExp): any;
    
    // SpyObj type - compatible with any type T for constructor injection
    // Uses intersection with 'any' to bypass strict type checking during migration
    // This allows SpyObj<HttpClient> to be passed where HttpClient is expected
    type SpyObj<T> = {
      [K in keyof T]: T[K] extends (...args: infer A) => infer R 
        ? JasmineSpy & ((...args: A) => R)
        : any;
    } & {
      [key: string]: JasmineSpy | any;
    } & any;
    
    interface Spy extends JasmineSpy {}
  }
}

// Extend Vitest Assertion interface to include Jasmine matchers
declare module 'vitest' {
  interface Assertion<T = any> {
    toBeTrue(): void;
    toBeFalse(): void;
  }
  
  interface AsymmetricMatchersContaining {
    toBeTrue(): void;
    toBeFalse(): void;
  }
}

export {};
