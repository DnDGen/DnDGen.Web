# Design Document

## Overview

This design addresses the loading indicator freeze issue in the DnDGen web application. The problem manifests as loading spinners that remain visible after API calls complete, only resolving when users switch tabs and return. This document outlines a diagnostic-first approach to identify the root cause, followed by targeted fixes that may involve either Zone.js configuration adjustments or migration to Angular's zoneless change detection using signals.

The design prioritizes incremental implementation starting with RollGen (the simplest generator) to validate the solution before scaling to the remaining four generators.

### Background: Zone.js vs Zoneless Change Detection

#### What is Zone.js?

Zone.js is a library that Angular has used since its inception (Angular 2+) to automatically detect when to update the UI. It works by "monkey-patching" browser APIs (setTimeout, Promise, XMLHttpRequest, etc.) to intercept async operations. When an async operation completes inside Angular's zone, Zone.js automatically triggers change detection, updating the DOM to reflect component state changes.

**How Zone.js Works:**
```typescript
// Developer writes this:
this.loading = true;
this.http.get('/api/data').subscribe(data => {
  this.loading = false; // Zone.js detects this and triggers change detection
});

// Zone.js intercepts the HTTP call and subscription
// When the subscription callback runs, Zone.js automatically calls detectChanges()
```

#### Why Angular is Moving to Zoneless

Angular is transitioning away from Zone.js for several reasons:

1. **Performance**: Zone.js adds overhead by intercepting every async operation, even those that don't affect Angular components. This can cause unnecessary change detection cycles.

2. **Bundle Size**: Zone.js adds ~30KB to the application bundle, which impacts initial load time.

3. **Predictability**: Zone.js's automatic behavior can be "magical" and hard to debug. Developers don't always know when change detection will run.

4. **Modern JavaScript**: With signals (introduced in Angular 16, stable in Angular 17), Angular has a more efficient way to track state changes without needing to intercept browser APIs.

5. **Framework Independence**: Zoneless makes Angular more compatible with other frameworks and web components that don't use Zone.js.

6. **Fine-grained Reactivity**: Signals provide fine-grained reactivity - only components that depend on changed signals update, rather than checking the entire component tree.

#### Current Best Practices (2026)

As of Angular 21 (current version in this project):

**For New Projects:**
- Use zoneless change detection with signals (recommended by Angular team)
- Configure with `provideExperimentalZonelessChangeDetection()`
- Use signals for all reactive state
- Use `effect()` for side effects instead of lifecycle hooks with subscriptions

**For Existing Projects:**
- Zone.js is still fully supported and will be for the foreseeable future
- Migration to zoneless is optional but recommended for long-term maintainability
- Hybrid approach is possible: use Zone.js while gradually introducing signals

**Migration Strategy:**
- Angular provides a gradual migration path
- Components can use signals even with Zone.js enabled
- Once all components use signals, Zone.js can be removed
- No "big bang" rewrite required

#### Signals vs Traditional Properties

**Traditional (Zone.js):**
```typescript
export class Component {
  count = 0; // Plain property
  
  increment() {
    this.count++; // Zone.js detects this and triggers change detection
  }
}
```

**Modern (Signals):**
```typescript
export class Component {
  count = signal(0); // Signal
  
  increment() {
    this.count.update(c => c + 1); // Signal automatically notifies subscribers
  }
}

// Template: {{ count() }} instead of {{ count }}
```

#### Why This Matters for Our Issue

The loading indicator freeze suggests that Zone.js may not be triggering change detection after async operations complete. This could be due to:

1. **Zone.js Compatibility Issue**: Angular 21 may have changes that affect Zone.js behavior
2. **Async Operation Outside Zone**: The HTTP call might be running outside Angular's zone
3. **Zone.js Not Loaded**: Configuration issue preventing Zone.js from loading
4. **Change Detection Strategy**: Component might be using OnPush without proper change detection triggers

Our diagnostic approach will identify which of these is the root cause, then implement the appropriate fix:
- If Zone.js is working but needs help: Add explicit change detection triggers
- If Zone.js is broken or incompatible: Migrate to zoneless with signals

#### Future-Proofing

Regardless of the immediate fix, migrating to signals is the future direction for Angular applications. The Angular team has indicated that while Zone.js will remain supported, new features and optimizations will focus on zoneless applications. By 2027-2028, zoneless is expected to be the default for new Angular projects.

## Architecture

### Current Architecture

The application uses Angular 21.1.5 with Zone.js 0.16.1 for automatic change detection. Generator components follow a consistent pattern:

```
Component (TypeScript)
  ├─ Service injection (HTTP calls)
  ├─ Loading state properties (boolean flags)
  ├─ Observable subscriptions
  └─ Property assignments in callbacks

Template (HTML)
  └─ *ngIf directives bound to loading properties
```

### Diagnostic Architecture

We will implement a fully automated three-tier diagnostic approach that runs as part of the test suite:

1. **Zone.js Health Check**: Automated test that verifies Zone.js is loaded and intercepting async operations
2. **Change Detection Monitoring**: Automated test that tracks when Angular's change detection runs after async operations
3. **Manual Trigger Testing**: Automated test that confirms explicit `ChangeDetectorRef.detectChanges()` resolves the issue

All diagnostics will be implemented as Jasmine tests that can run via `npm test` or in CI/CD pipelines. The tests will output clear pass/fail results and diagnostic information to the console.

### Solution Architecture Options

#### Option A: Zone.js Fix (if Zone.js is working)
- Add explicit change detection triggers after async operations
- Ensure observables complete properly
- Verify NgZone is running operations inside Angular's zone

#### Option B: Zoneless Migration (if Zone.js is broken)
- Convert component properties to signals
- Update templates to use signal syntax `{{ signal() }}`
- Configure application for zoneless mode
- Use `effect()` for side effects

## Components and Interfaces

### Diagnostic Components

#### Automated Diagnostic Test Suite

All diagnostics will be implemented as Jasmine test specs that can run via:
- `npm test` (local development)
- `npm run test:ci` (CI/CD pipeline)
- Individual test files for targeted diagnostics

#### ChangeDetectionTestHelper (Test Utility)
```typescript
class ChangeDetectionTestHelper {
  static simulateApiCall(delay: number): Observable<any>;
  static waitForChangeDetection(fixture: ComponentFixture<any>): Promise<void>;
  static verifyLoadingState(fixture: ComponentFixture<any>, expectedState: boolean): boolean;
  static captureChangeDetectionCycles(fixture: ComponentFixture<any>): number;
}
```

Purpose: Reusable test utilities for reproducing and verifying the loading state issue across all generator components.

#### Diagnostic Test Structure

```typescript
describe('Zone.js Diagnostics', () => {
  it('should detect if Zone.js is active', () => {
    // Test implementation
  });
  
  it('should trigger change detection after async operations', () => {
    // Test implementation
  });
  
  it('should update loading state without manual intervention', () => {
    // Test implementation
  });
});
```

These tests will output diagnostic information to the console and fail if Zone.js is not working correctly, making the root cause immediately visible in CI/CD logs.

### Generator Component Pattern (Current)

```typescript
class GeneratorComponent {
  loading: boolean = false;
  rolling: boolean = false;
  
  makeApiCall() {
    this.loading = true;
    this.service.getData()
      .subscribe({
        next: data => {
          this.processData(data);
          this.loading = false; // Should trigger change detection
        },
        error: error => {
          this.handleError(error);
          this.loading = false;
        }
      });
  }
}
```

### Generator Component Pattern (Option A: Zone.js Fix)

```typescript
class GeneratorComponent {
  loading: boolean = false;
  
  constructor(
    private service: Service,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}
  
  makeApiCall() {
    this.loading = true;
    this.ngZone.run(() => {
      this.service.getData()
        .subscribe({
          next: data => {
            this.processData(data);
            this.loading = false;
            this.cdr.detectChanges(); // Explicit trigger
          },
          error: error => {
            this.handleError(error);
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
    });
  }
}
```

### Generator Component Pattern (Option B: Zoneless with Signals)

```typescript
class GeneratorComponent {
  loading = signal(false);
  data = signal<DataType | null>(null);
  
  constructor(private service: Service) {}
  
  makeApiCall() {
    this.loading.set(true);
    this.service.getData()
      .subscribe({
        next: data => {
          this.data.set(data);
          this.loading.set(false); // Signal automatically triggers update
        },
        error: error => {
          this.handleError(error);
          this.loading.set(false);
        }
      });
  }
}
```

Template changes for Option B:
```html
<!-- Before (Zone.js) -->
<app-loading *ngIf="loading"></app-loading>
<div *ngIf="!loading">
  <p>Data: {{ data }}</p>
  <button [disabled]="rolling">Roll</button>
</div>

<!-- After (Zoneless with Signals) -->
<app-loading *ngIf="loading()"></app-loading>
<div *ngIf="!loading()">
  <p>Data: {{ data() }}</p>
  <button [disabled]="rolling()">Roll</button>
</div>
```

**Key Template Changes:**
- All signal references must include `()` to read the value
- Property bindings: `[disabled]="rolling"` → `[disabled]="rolling()"`
- Interpolations: `{{ roll }}` → `{{ roll() }}`
- Structural directives: `*ngIf="loading"` → `*ngIf="loading()"`
- Event handlers remain the same: `(click)="rollStandard()"` (no change)

**Example from RollGen Template:**

Before:
```html
<dndgen-loading *ngIf="loading" [size]="sizes.Large"></dndgen-loading>
<div *ngIf="!loading">
  <button [disabled]="!rollIsValid || validating || rolling" 
          (click)="rollStandard()">
    Roll
  </button>
  <dndgen-loading *ngIf="validating" [size]="sizes.Small"></dndgen-loading>
  <div id="rollSection">{{ roll | number }}</div>
  <dndgen-loading *ngIf="rolling" [size]="sizes.Medium"></dndgen-loading>
</div>
```

After:
```html
<dndgen-loading *ngIf="loading()" [size]="sizes.Large"></dndgen-loading>
<div *ngIf="!loading()">
  <button [disabled]="!rollIsValid() || validating() || rolling()" 
          (click)="rollStandard()">
    Roll
  </button>
  <dndgen-loading *ngIf="validating()" [size]="sizes.Small"></dndgen-loading>
  <div id="rollSection">{{ roll() | number }}</div>
  <dndgen-loading *ngIf="rolling()" [size]="sizes.Medium"></dndgen-loading>
</div>
```

**Template Migration Checklist:**
- [ ] Add `()` to all signal references in interpolations `{{ }}`
- [ ] Add `()` to all signal references in property bindings `[prop]=""`
- [ ] Add `()` to all signal references in structural directives `*ngIf`, `*ngFor`
- [ ] Add `()` to all signal references in attribute bindings
- [ ] Event handlers `(click)` do NOT need changes
- [ ] Template reference variables `#ref` do NOT need changes
- [ ] Pipes work the same: `{{ signal() | pipe }}` instead of `{{ property | pipe }}`

## Data Models

### ChangeDetectionEvent
```typescript
interface ChangeDetectionEvent {
  timestamp: number;
  component: string;
  trigger: 'zone' | 'manual' | 'signal';
  propertyChanged: string;
}
```

### DiagnosticResult
```typescript
interface DiagnosticResult {
  zoneJsActive: boolean;
  changeDetectionWorking: boolean;
  manualTriggerRequired: boolean;
  recommendedSolution: 'zone-fix' | 'zoneless-migration' | 'other';
  evidence: string[];
}
```

### LoadingState (for testing)
```typescript
interface LoadingState {
  loading: boolean;
  rolling: boolean;
  validating: boolean;
  timestamp: number;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Loading indicator visibility matches loading state

*For any* generator component and any API call, when the API call starts, the loading indicator SHALL be visible, and when the API call completes (success or error), the loading indicator SHALL be hidden without requiring user interaction.

**Validates: Requirements 1.2, 2.2, 2.3**

### Property 2: Change detection triggers on state changes

*For any* component property change that affects the UI, Angular's change detection SHALL run and update the DOM within a reasonable time frame (< 100ms) without requiring tab switching or manual intervention.

**Validates: Requirements 1.2, 2.2**

### Property 3: Error handling resets loading states

*For any* API call that fails, all loading-related state properties (loading, rolling, validating) SHALL be set to false and the UI SHALL reflect this state immediately.

**Validates: Requirements 2.3, 4.3**

### Property 4: Validation state updates in real-time

*For any* validation operation (roll validation, expression validation), the validating indicator SHALL update to true when validation starts and false when validation completes, with UI updates occurring immediately.

**Validates: Requirements 2.4, 4.4**

### Property 5: Solution consistency across generators

*For any* generator component (RollGen, TreasureGen, CharacterGen, EncounterGen, DungeonGen), the change detection fix SHALL follow the same pattern and produce the same reliable behavior.

**Validates: Requirements 4.1, 4.2**

### Property 6: Diagnostic accuracy

*For any* diagnostic test run, if Zone.js is active and functioning, the diagnostic SHALL correctly identify it, and if Zone.js is broken or missing, the diagnostic SHALL correctly identify that condition.

**Validates: Requirements 1.1, 1.5**

## Error Handling

### Diagnostic Phase Errors

1. **Zone.js Detection Failure**: If diagnostics cannot determine Zone.js status, default to implementing both solutions in parallel on a test component
2. **Test Environment Differences**: If behavior differs between test and production, implement logging to capture production behavior
3. **Inconclusive Results**: If diagnostics show mixed results, prioritize the zoneless migration as it's the future direction for Angular

### Implementation Phase Errors

1. **Change Detection Still Fails**: If explicit `detectChanges()` doesn't resolve the issue, escalate to zoneless migration
2. **Signal Conversion Breaks Functionality**: Implement rollback mechanism and investigate specific breaking changes
3. **Performance Degradation**: Monitor and optimize change detection frequency, consider using `OnPush` strategy
4. **Test Failures**: Ensure tests properly simulate async behavior and change detection cycles

### Migration Errors

1. **Template Syntax Errors**: Automated search for property bindings that need signal syntax `()`
2. **Subscription Leaks**: Ensure proper cleanup with `takeUntilDestroyed()` or `DestroyRef`
3. **Computed Signal Issues**: Verify dependencies are properly tracked in computed signals

## Testing Strategy

### Diagnostic Tests (Automated)

#### Zone.js Detection Test
```typescript
describe('Zone.js Health Check', () => {
  it('should confirm Zone.js is loaded and active', () => {
    expect(Zone).toBeDefined();
    expect(Zone.current.name).toBe('angular');
  });
  
  it('should intercept setTimeout operations', (done) => {
    let intercepted = false;
    const originalSetTimeout = Zone.current.scheduleMacroTask;
    
    spyOn(Zone.current, 'scheduleMacroTask').and.callFake((...args) => {
      intercepted = true;
      return originalSetTimeout.apply(Zone.current, args);
    });
    
    setTimeout(() => {
      expect(intercepted).toBe(true);
      done();
    }, 0);
  });
});
```

#### Change Detection Trigger Test
```typescript
describe('RollGen Change Detection', () => {
  let component: RollGenComponent;
  let fixture: ComponentFixture<RollGenComponent>;
  let service: RollService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RollGenComponent],
      providers: [
        { provide: RollService, useValue: mockRollService }
      ]
    });
    
    fixture = TestBed.createComponent(RollGenComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(RollService);
  });
  
  it('should update loading state after API call without manual detection', fakeAsync(() => {
    // Arrange
    spyOn(service, 'getRoll').and.returnValue(of(15).pipe(delay(100)));
    
    // Act
    component.rollStandard();
    expect(component.rolling).toBe(true);
    
    tick(100);
    // DO NOT call fixture.detectChanges() - this tests automatic detection
    
    // Assert
    expect(component.rolling).toBe(false);
    
    // Verify DOM updated automatically
    const compiled = fixture.nativeElement;
    const loadingElement = compiled.querySelector('app-loading');
    expect(loadingElement).toBeNull(); // Should be hidden
  }));
  
  it('should update DOM when loading state changes', fakeAsync(() => {
    spyOn(service, 'getRoll').and.returnValue(of(15).pipe(delay(100)));
    
    fixture.detectChanges(); // Initial render
    
    component.rollStandard();
    fixture.detectChanges(); // Render loading state
    
    let compiled = fixture.nativeElement;
    let loadingElement = compiled.querySelector('app-loading');
    expect(loadingElement).not.toBeNull(); // Should be visible
    
    tick(100);
    // This is the critical test: does DOM update without manual detectChanges?
    
    compiled = fixture.nativeElement;
    loadingElement = compiled.querySelector('app-loading');
    
    if (loadingElement !== null) {
      console.error('DIAGNOSTIC: Loading element still visible after async operation');
      console.error('DIAGNOSTIC: Zone.js may not be triggering change detection');
      console.error('DIAGNOSTIC: Recommended solution: Add explicit ChangeDetectorRef.detectChanges()');
    }
    
    expect(loadingElement).toBeNull(); // Should be hidden
  }));
});
```

These tests will fail if Zone.js is not triggering change detection, providing clear diagnostic output in CI/CD logs.

### Solution Validation Tests

#### Property-Based Tests

We will use Jasmine (the existing test framework) for property-based testing patterns. While Jasmine doesn't have built-in property-based testing like QuickCheck, we can implement property-based testing patterns using Jasmine's parameterized tests and random data generation.

Each property-based test will run a minimum of 100 iterations with varied inputs to ensure the properties hold across different scenarios.

#### Unit Tests for Fixed Components
- Test loading state transitions
- Test error handling resets states
- Test validation state updates
- Test that change detection triggers are called
- Mock `ChangeDetectorRef` to verify `detectChanges()` calls (Option A)
- Test signal updates trigger UI changes (Option B)

##### Testing Comparison: Zone.js vs Zoneless

**Current Tests (with Zone.js) - Based on Actual rollgen.component.spec.ts:**

```typescript
describe('RollGen Component', () => {
  describe('unit', () => {
    let component: RollGenComponent;
    let rollServiceSpy: jasmine.SpyObj<RollService>;
    let sweetAlertServiceSpy: jasmine.SpyObj<SweetAlertService>;
    let loggerServiceSpy: jasmine.SpyObj<LoggerService>;

    const delay = 10;
  
    beforeEach(() => {
      rollServiceSpy = jasmine.createSpyObj('RollService', ['getViewModel', 'getRoll', 'validateRoll', 'getExpressionRoll', 'validateExpression']);
      sweetAlertServiceSpy = jasmine.createSpyObj('SweetAlertService', ['showError']);
      loggerServiceSpy = jasmine.createSpyObj('LoggerService', ['logError']);

      component = new RollGenComponent(rollServiceSpy, sweetAlertServiceSpy, loggerServiceSpy);
    });
  
    it('should be loading while fetching the roll model', fakeAsync(() => {
      const model = new RollGenViewModel(9266, 90210, 42, 600);
      rollServiceSpy.getViewModel.and.callFake(() => getFakeDelay(model));

      component.ngOnInit();

      expect(component.rollModel).not.toBeDefined();
      expect(component.loading).toBeTrue(); // Direct property access
      
      tick(delay - 1);

      expect(component.rollModel).not.toBeDefined();
      expect(component.loading).toBeTrue(); // Still loading
      
      flush();
    }));

    function getFakeDelay<T>(response: T): Observable<T> {
      return new Observable((observer) => {
        setTimeout(() => {
          observer.next(response);
          observer.complete();
        }, delay);
      });
    }

    it('should set the roll model on init', fakeAsync(() => {
      const model = new RollGenViewModel(9266, 90210, 42, 600);
      rollServiceSpy.getViewModel.and.callFake(() => getFakeDelay(model));

      component.ngOnInit();

      expect(component.rollModel).not.toBeDefined();
      expect(component.loading).toBeTrue();

      tick(delay);

      expect(component.rollModel).toEqual(model);
      expect(component.loading).toBeFalse(); // Loading complete
    }));

    it('should be rolling while rolling a standard roll', fakeAsync(() => {
      rollServiceSpy.getRoll.and.callFake(() => getFakeDelay(90210));

      component.rollStandard();

      expect(rollServiceSpy.getRoll).toHaveBeenCalledWith(1, 20);
      expect(component.rolling).toBeTrue(); // Direct property access
      
      tick(delay / 2);

      expect(component.rolling).toBeTrue(); // Still rolling

      flush();
    }));

    it('should roll the default standard roll', fakeAsync(() => {
      rollServiceSpy.getRoll.and.callFake(() => getFakeDelay(90210));

      component.rollStandard();

      expect(rollServiceSpy.getRoll).toHaveBeenCalledWith(1, 20);
      expect(component.rolling).toBeTrue();

      tick(delay);

      expect(component.roll).toBe(90210);
      expect(component.rolling).toBeFalse(); // Rolling complete
    }));
  });

  describe('integration', () => {
    let fixture: ComponentFixture<RollGenComponent>;
    let helper: TestHelper<RollGenComponent>;
  
    beforeEach(async () => {
      await TestHelper.configureTestBed([RollGenComponent]);
  
      fixture = TestBed.createComponent(RollGenComponent);
      helper = new TestHelper(fixture);
      
      //run ngOnInit
      await helper.waitForService();
    });
  
    it('should show the loading component when loading', () => {
      const component = fixture.componentInstance;
      component.loading = true;

      fixture.detectChanges(); // Manually trigger change detection

      helper.expectLoading('dndgen-loading', true, Size.Large);
    });
  
    it('should hide the loading component when not loading', () => {
      const component = fixture.componentInstance;
      component.loading = false;

      fixture.detectChanges(); // Manually trigger change detection

      helper.expectLoading('dndgen-loading', false, Size.Large);
    });
  });
});
```

**Zoneless Tests (with Signals) - How Tests Would Change:**

```typescript
describe('RollGen Component (Zoneless)', () => {
  describe('unit', () => {
    let component: RollGenComponent;
    let rollServiceSpy: jasmine.SpyObj<RollService>;
    let sweetAlertServiceSpy: jasmine.SpyObj<SweetAlertService>;
    let loggerServiceSpy: jasmine.SpyObj<LoggerService>;

    const delay = 10;
  
    beforeEach(() => {
      rollServiceSpy = jasmine.createSpyObj('RollService', ['getViewModel', 'getRoll', 'validateRoll', 'getExpressionRoll', 'validateExpression']);
      sweetAlertServiceSpy = jasmine.createSpyObj('SweetAlertService', ['showError']);
      loggerServiceSpy = jasmine.createSpyObj('LoggerService', ['logError']);

      component = new RollGenComponent(rollServiceSpy, sweetAlertServiceSpy, loggerServiceSpy);
    });
  
    it('should be loading while fetching the roll model', fakeAsync(() => {
      const model = new RollGenViewModel(9266, 90210, 42, 600);
      rollServiceSpy.getViewModel.and.callFake(() => getFakeDelay(model));

      component.ngOnInit();

      expect(component.rollModel()).not.toBeDefined(); // Signal access with ()
      expect(component.loading()).toBeTrue(); // Signal access with ()
      
      tick(delay - 1);

      expect(component.rollModel()).not.toBeDefined();
      expect(component.loading()).toBeTrue(); // Still loading
      
      flush();
    }));

    function getFakeDelay<T>(response: T): Observable<T> {
      return new Observable((observer) => {
        setTimeout(() => {
          observer.next(response);
          observer.complete();
        }, delay);
      });
    }

    it('should set the roll model on init', fakeAsync(() => {
      const model = new RollGenViewModel(9266, 90210, 42, 600);
      rollServiceSpy.getViewModel.and.callFake(() => getFakeDelay(model));

      component.ngOnInit();

      expect(component.rollModel()).not.toBeDefined();
      expect(component.loading()).toBeTrue();

      tick(delay);

      expect(component.rollModel()).toEqual(model);
      expect(component.loading()).toBeFalse(); // Loading complete
    }));

    it('should be rolling while rolling a standard roll', fakeAsync(() => {
      rollServiceSpy.getRoll.and.callFake(() => getFakeDelay(90210));

      component.rollStandard();

      expect(rollServiceSpy.getRoll).toHaveBeenCalledWith(1, 20);
      expect(component.rolling()).toBeTrue(); // Signal access with ()
      
      tick(delay / 2);

      expect(component.rolling()).toBeTrue(); // Still rolling

      flush();
    }));

    it('should roll the default standard roll', fakeAsync(() => {
      rollServiceSpy.getRoll.and.callFake(() => getFakeDelay(90210));

      component.rollStandard();

      expect(rollServiceSpy.getRoll).toHaveBeenCalledWith(1, 20);
      expect(component.rolling()).toBeTrue();

      tick(delay);

      expect(component.roll()).toBe(90210);
      expect(component.rolling()).toBeFalse(); // Rolling complete
    }));
    
    // NEW: Test signal-specific behavior
    it('should track loading state changes with effect', () => {
      const loadingStates: boolean[] = [];
      
      // Signals can be tracked with effect()
      TestBed.runInInjectionContext(() => {
        effect(() => {
          loadingStates.push(component.loading());
        });
      });
      
      const model = new RollGenViewModel(9266, 90210, 42, 600);
      rollServiceSpy.getViewModel.and.returnValue(of(model));
      
      component.ngOnInit();
      
      expect(loadingStates).toEqual([false, true, false]); // Initial, started, completed
    });
  });

  describe('integration', () => {
    let fixture: ComponentFixture<RollGenComponent>;
    let helper: TestHelper<RollGenComponent>;
  
    beforeEach(async () => {
      await TestHelper.configureTestBed([RollGenComponent]);
  
      fixture = TestBed.createComponent(RollGenComponent);
      helper = new TestHelper(fixture);
      
      //run ngOnInit
      await helper.waitForService();
    });
  
    it('should show the loading component when loading', () => {
      const component = fixture.componentInstance;
      component.loading.set(true); // Signal setter

      fixture.detectChanges(); // Still needed for DOM update in tests

      helper.expectLoading('dndgen-loading', true, Size.Large);
    });
  
    it('should hide the loading component when not loading', () => {
      const component = fixture.componentInstance;
      component.loading.set(false); // Signal setter

      fixture.detectChanges(); // Still needed for DOM update in tests

      helper.expectLoading('dndgen-loading', false, Size.Large);
    });
  });
});
```

##### Key Testing Differences

**What Stays the Same:**
- Test structure and organization (unit tests, integration tests)
- Use of `fakeAsync`, `tick()`, `flush()` for async testing
- Mocking services with Jasmine spies (`jasmine.createSpyObj`)
- DOM queries and assertions with TestHelper
- `fixture.detectChanges()` is still used in integration tests
- Test logic and expectations remain identical

**What Changes:**
1. **Property Access**: `component.loading` → `component.loading()`
2. **Property Setting**: `component.loading = true` → `component.loading.set(true)`
3. **New Capabilities**: Can test signal subscriptions with `effect()`
4. **Computed Values**: Can test computed signals that derive from other signals

**Additional Tests for Zoneless:**
1. **Signal Subscription Tests**: Verify that signal changes propagate correctly using `effect()`
2. **Computed Signal Tests**: Test that computed values update when dependencies change (if used)
3. **Signal Equality Tests**: Verify that signals use proper equality checks (don't trigger updates for same values)

**Example: Testing Computed Signals (if implemented)**
```typescript
it('should compute hasActiveOperation from multiple signals', () => {
  // Component would have: hasActiveOperation = computed(() => 
  //   this.loading() || this.rolling() || this.validating()
  // )
  
  expect(component.hasActiveOperation()).toBe(false);
  
  component.loading.set(true);
  expect(component.hasActiveOperation()).toBe(true);
  
  component.loading.set(false);
  component.rolling.set(true);
  expect(component.hasActiveOperation()).toBe(true);
  
  component.rolling.set(false);
  expect(component.hasActiveOperation()).toBe(false);
});
```

##### Test Migration Effort

**Low Effort Changes (Find/Replace):**
- Update property access: `component.property` → `component.property()`
- Update property setting: `component.property = value` → `component.property.set(value)`
- These changes are mechanical and can be automated

**No Changes Required:**
- Service mocking remains identical
- Test helper methods remain identical
- Async testing patterns remain identical
- DOM assertions remain identical

**Optional New Tests (~10% additional):**
- Tests for signal-specific features (effect tracking, computed signals)
- Only needed if using advanced signal features

**Overall Impact:**
- Existing tests: ~95% work with syntax changes only
- New tests: ~5% additional for signal-specific features
- Test structure: No fundamental changes required
- Migration time: Minimal (mostly find/replace operations)

#### Integration Tests for Each Generator
- Test complete user flow: click button → API call → result display
- Test error scenarios: API failure → error message → state reset
- Test rapid successive calls
- Test concurrent operations (e.g., validation while rolling)

### Regression Tests
- Ensure existing functionality remains intact
- Verify all generator features work after migration
- Test edge cases (empty inputs, invalid data, network errors)
- Performance benchmarks to ensure no degradation

### Test Execution Strategy

1. **Diagnostic Phase**: Run diagnostic tests first to determine root cause
2. **RollGen Phase**: Implement and test fix on RollGen only
3. **Validation Phase**: Run full test suite on RollGen to ensure no regressions
4. **Replication Phase**: Apply fix to remaining generators one at a time
5. **Final Validation**: Run complete test suite across all generators

## Implementation Notes

### Automated Diagnostic Workflow

The diagnostic tests will run automatically as part of the test suite:

```bash
# Run all tests including diagnostics
npm test

# Run only diagnostic tests (once created)
npm test -- --include='**/zone-diagnostics.spec.ts'

# Run in CI/CD
npm run test:ci
```

The tests will output clear diagnostic information:
- ✓ Pass: Zone.js is working, change detection triggers automatically
- ✗ Fail: Zone.js not triggering change detection → Implement Option A (explicit triggers)
- ✗ Fail: Zone.js not loaded → Implement Option B (zoneless migration)

### Incremental Rollout Strategy

1. **Phase 1: Diagnostics** (RollGen only)
   - Add diagnostic logging
   - Create reproduction test
   - Determine root cause

2. **Phase 2: RollGen Fix**
   - Implement chosen solution
   - Verify with tests
   - Manual testing in browser

3. **Phase 3: Replication**
   - TreasureGen
   - CharacterGen
   - EncounterGen
   - DungeonGen

### Rollback Plan

If the fix causes issues:
1. Revert component changes
2. Keep diagnostic code for further investigation
3. Consider alternative approaches (e.g., if Zone.js fix fails, try zoneless)

### Configuration Changes

If implementing zoneless migration:

**angular.json** - Remove zone.js from polyfills:
```json
"polyfills": [
  "@angular/localize/init"
]
```

**main.ts** - Add zoneless provider:
```typescript
bootstrapApplication(AppComponent, {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    // ... other providers
  ]
})
```

### Migration Checklist (if zoneless)

For each component:
- [ ] Convert properties to signals in TypeScript
- [ ] Update template bindings to use `()` for signal access
- [ ] Replace `ngOnInit` subscriptions with `effect()` where appropriate
- [ ] Update tests to work with signals (property access syntax)
- [ ] Verify change detection works correctly
- [ ] Test all user interactions

**Template Migration Pattern:**

Use find/replace with regex to update templates systematically:

1. Interpolations: `{{ (loading|rolling|validating) }}` → `{{ $1() }}`
2. Property bindings: `\[(disabled|hidden|class)\]="([^"]*)"` → Check each for signal references
3. Structural directives: `\*ngIf="([^"]*)"` → Check each for signal references

**Important:** Not all properties will become signals. Only reactive state that triggers UI updates should be signals. Constants, configuration, and non-reactive data can remain as regular properties.

### Performance Considerations

- **Zone.js Fix**: Minimal performance impact, may add slight overhead from explicit `detectChanges()` calls
- **Zoneless Migration**: Potential performance improvement as signals are more efficient than Zone.js, but requires careful implementation to avoid over-triggering updates

### Browser Compatibility

Both solutions maintain compatibility with all browsers supported by Angular 21. The tab-switching behavior should work consistently across Chrome, Firefox, Safari, and Edge.
