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

### Generator Component Pattern (Option B: Zoneless with Signals) - ACTUAL IMPLEMENTATION

Based on the completed RollGen migration, here is the actual pattern we use:

```typescript
class GeneratorComponent {
  // Signals for reactive state
  public loading = signal(false);
  public rolling = signal(false);
  public validating = signal(false);
  public rollIsValid = signal(true);
  public roll = signal(0);
  public rollModel = signal<RollGenViewModel | undefined>(undefined);
  
  // Regular properties for non-reactive data
  public sizes = Size;
  @Input() standardQuantity = 1;
  @Input() customQuantity = 1;
  @Input() customDie = 5;
  @Input() expression = '4d6k3+2';
  
  // RxJS subjects for debounced operations
  private expressionText$ = new Subject<string>();
  
  constructor(
    private service: Service,
    private sweetAlertService: SweetAlertService,
    private logger: LoggerService
  ) {}
  
  ngOnInit(): void {
    this.loading.set(true);

    this.service.getViewModel()
      .subscribe({
        next: data => this.setViewModel(data),
        error: error => this.handleError(error)
      });
    
    // Set up debounced validation with RxJS
    this.expressionText$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(expression => this.service.validateExpression(expression)
          .pipe(catchError(() => of(false)))),
        tap(data => this.setRollValidity(data))
      )
      .subscribe();
  }
  
  private setViewModel(data: RollGenViewModel): void {
    this.rollModel.set(data);
    this.loading.set(false);
  }
  
  public rollStandard() {
    this.rolling.set(true);

    this.service.getRoll(this.standardQuantity, this.standardDie.die)
      .subscribe({
        next: data => this.setRoll(data),
        error: error => this.handleError(error)
      });
  }
  
  private setRoll(rollResult: number) {
    this.roll.set(rollResult);
    this.rolling.set(false);
  }
  
  private handleError(error: any) {
    this.logger.logError(error.message);

    this.roll.set(0);
    this.rolling.set(false);
    this.validating.set(false);
    this.loading.set(false);

    this.sweetAlertService.showError();
  }
  
  public validateRoll(quantity: number, die: number) {
    this.validating.set(true);

    if (!quantity || !die) {
      this.rollIsValid.set(false);
      this.validating.set(false);
      return;
    }

    this.service.validateRoll(quantity, die)
      .subscribe({
        next: data => this.setRollValidity(data),
        error: error => this.handleValidationError(error)
      });
  }
  
  private setRollValidity(data: boolean) {
    this.rollIsValid.set(data);
    this.validating.set(false);
  }
  
  public validateExpression(expression: string) {
    this.validating.set(true);

    if (!expression || expression === '') {
      this.rollIsValid.set(false);
      this.validating.set(false);
      return;
    }

    this.expressionText$.next(expression);
  }
}
```

**Key Implementation Patterns:**
1. **Signals for UI State**: All properties that control UI visibility/state are signals
2. **Regular Properties for Inputs**: `@Input()` properties remain regular properties
3. **Regular Properties for Constants**: Enums, configuration remain regular properties
4. **Private Helper Methods**: Use `.set()` to update signals in dedicated methods
5. **Error Handling**: Always reset all loading signals in error handlers
6. **RxJS Integration**: Signals work seamlessly with RxJS observables
7. **Debouncing**: Use RxJS operators (debounceTime, distinctUntilChanged) with Subject pattern

Template changes for Option B (ACTUAL from RollGen):
```html
<!-- Before (Zone.js) -->
<dndgen-loading [isLoading]="loading" [size]="sizes.Large">
  <button [disabled]="!rollIsValid || validating || rolling" 
          (click)="rollStandard()">
    Roll
  </button>
  @if (!rolling) {
    <span id="rollSection">{{roll | number}}</span>
  }
  <dndgen-loading id="rollingSection" [isLoading]="rolling" [size]="sizes.Medium"></dndgen-loading>
</dndgen-loading>

<!-- After (Zoneless with Signals) -->
<dndgen-loading [isLoading]="loading()" [size]="sizes.Large">
  <button [disabled]="!rollIsValid() || validating() || rolling()" 
          (click)="rollStandard()">
    Roll
  </button>
  @if (!rolling()) {
    <span id="rollSection">{{roll() | number}}</span>
  }
  <dndgen-loading id="rollingSection" [isLoading]="rolling()" [size]="sizes.Medium"></dndgen-loading>
</dndgen-loading>
```

**Template Migration Checklist (Based on Actual RollGen):**
- [x] Add `()` to all signal references in interpolations `{{ roll() }}`
- [x] Add `()` to all signal references in property bindings `[isLoading]="loading()"`
- [x] Add `()` to all signal references in structural directives `@if (loading())`, `*ngIf="loading()"`
- [x] Add `()` to all signal references in boolean expressions `!rolling()`, `validating() || rolling()`
- [x] Event handlers `(click)` do NOT need changes
- [x] Template reference variables `#ref` do NOT need changes
- [x] Pipes work the same: `{{ roll() | number }}` instead of `{{ roll | number }}`
- [x] Non-signal properties (like `sizes`, `standardDice`) do NOT get `()`

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

**Zoneless Tests (with Signals) - ACTUAL IMPLEMENTATION from RollGen:**

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
  
    it(`should initialize the public properties`, () => {
      expect(component.rolling()).toEqual(false);
      expect(component.loading()).toEqual(false);
      expect(component.validating()).toEqual(false);
      expect(component.rollIsValid()).toEqual(true);
      expect(component.roll()).toEqual(0);
      expect(component.standardDice.length).toEqual(9);
      // ... more assertions
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

    it('should validate a roll - invalid if no quantity', () => {
      component.validateRoll(0, 90210);
      expect(component.validating()).toBeFalse();
      expect(component.rollIsValid()).toBeFalse();
    });

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

    const standardDieIndicesTestCases = Array.from(Array(9).keys());

    standardDieIndicesTestCases.forEach(test => {
      it(`should roll a non-default standard roll - standard die index ${test}`, fakeAsync(() => {
        rollServiceSpy.getRoll.and.callFake(() => getFakeDelay(90210));
  
        component.standardQuantity = 9266;
        component.standardDie = component.standardDice[test];
  
        component.rollStandard();
  
        expect(rollServiceSpy.getRoll).toHaveBeenCalledWith(9266, component.standardDice[test].die);
        expect(component.rolling()).toBeTrue();
  
        tick(delay);
  
        expect(component.roll()).toBe(90210);
        expect(component.rolling()).toBeFalse();
      }));
    });

    it('should display error from rolling a standard roll', fakeAsync(() => {
      rollServiceSpy.getRoll.and.callFake(() => getFakeError('I failed'));

      component.rollStandard();
      tick(delay);

      expect(component.roll()).toEqual(0);
      expect(component.rolling()).toBeFalse();
      expect(component.loading()).toBeFalse();
      expect(component.validating()).toBeFalse();
      
      expect(rollServiceSpy.getRoll).toHaveBeenCalledWith(1, 20);
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
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

    it(`should roll the default standard roll`, async () => {
      helper.clickButton('#standardRollButton');

      fixture.detectChanges();
      
      helper.expectGenerating(
        fixture.componentInstance.rolling(), 
        '#standardRollButton', 
        '#rollSection', 
        '#rollingSection',
        '#standardValidating', 
      );

      //run roll
      await helper.waitForService();

      helper.expectGenerated(fixture.componentInstance.rolling(), '#standardRollButton', '#rollSection', '#rollingSection', '#standardValidating');

      const compiled = fixture.nativeElement as HTMLElement;
      const rollSection = compiled.querySelector('#rollSection');
      const rolledNumber = new Number(rollSection?.textContent);
      expect(rolledNumber).toBeGreaterThanOrEqual(1);
      expect(rolledNumber).toBeLessThanOrEqual(20);
    });

    it(`should show that a standard roll is valid - standard quantity 100`, async () => {
      helper.setInput('#standardQuantity', '100');

      fixture.detectChanges();

      expect(fixture.componentInstance.standardQuantity).toEqual(100);
      helper.expectValidating(fixture.componentInstance.validating(), '#standardRollButton', '#standardValidating');

      //run roll validation
      await helper.waitForService();

      helper.expectValid(fixture.componentInstance.validating(), fixture.componentInstance.rollIsValid(), '#standardRollButton', '#standardValidating');
    });
  });
});
```

##### Key Testing Differences - ACTUAL from RollGen

**What Stays the Same:**
- Test structure and organization (unit tests, integration tests)
- Use of `fakeAsync`, `tick()`, `flush()` for async testing
- Mocking services with Jasmine spies (`jasmine.createSpyObj`)
- DOM queries and assertions with TestHelper
- `fixture.detectChanges()` is still used in integration tests
- Test logic and expectations remain identical
- Service method calls and verification unchanged
- Error handling tests unchanged

**What Changes:**
1. **Property Access in Unit Tests**: `component.loading` → `component.loading()`
2. **Property Setting in Integration Tests**: `component.loading = true` → `component.loading.set(true)`
3. **All Assertions**: `expect(component.rolling).toBe(true)` → `expect(component.rolling()).toBe(true)`
4. **Input Properties**: Regular properties like `component.standardQuantity` remain unchanged (no `()`)
5. **Constants**: Properties like `component.standardDice` remain unchanged (no `()`)

**Test Migration Pattern:**
```typescript
// BEFORE (Zone.js)
expect(component.loading).toBe(true);
component.loading = false;
expect(component.roll).toBe(42);

// AFTER (Signals)
expect(component.loading()).toBe(true);
component.loading.set(false);
expect(component.roll()).toBe(42);

// UNCHANGED (Regular properties)
expect(component.standardQuantity).toBe(1);
component.standardQuantity = 42;
expect(component.standardDice.length).toBe(9);
```

**Helper Method Usage (Unchanged):**
```typescript
// These work the same way, just pass signal values
helper.expectLoading('dndgen-loading', component.loading(), Size.Large);
helper.expectValidating(component.validating(), '#button', '#indicator');
helper.expectGenerated(component.rolling(), '#button', '#section', '#loading', '#validating');
```bilities**: Can test signal subscriptions with `effect()`
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

##### Test Migration Effort - ACTUAL from RollGen

**Mechanical Changes (Find/Replace):**
- Update signal property access: `component.property` → `component.property()`
- Update signal property setting: `component.property = value` → `component.property.set(value)`
- These changes are mechanical and straightforward

**No Changes Required:**
- Service mocking remains identical
- Test helper methods remain identical (just pass signal values)
- Async testing patterns remain identical (`fakeAsync`, `tick`, `flush`)
- DOM assertions remain identical
- Regular properties (inputs, constants) remain unchanged
- Test structure and organization unchanged

**Overall Impact from RollGen Migration:**
- Unit tests: Changed signal access syntax in ~50 assertions
- Integration tests: Changed signal access syntax in ~30 assertions
- Test helper calls: No changes (helpers accept values, not properties)
- New tests: None required (signals work transparently)
- Test failures: None (all tests passed after syntax updates)
- Migration time: ~30 minutes for RollGen (1375 lines of tests)

**Example Migration:**
```typescript
// BEFORE - 3 lines to change
expect(component.loading).toBe(true);
component.loading = false;
expect(component.roll).toBe(42);

// AFTER - mechanical find/replace
expect(component.loading()).toBe(true);
component.loading.set(false);
expect(component.roll()).toBe(42);
```

##### Disabled Change Detection Tests (xdescribe)

**Important Note**: RollGen includes disabled tests (`xdescribe`) that document expected production behavior but cannot run in the current test environment:

```typescript
xdescribe('change detection', () => {
  // These tests are currently disabled because they test zoneless change detection behavior
  // in production, but our test environment uses zone.js (for fakeAsync/tick support).
  // 
  // IMPORTANT: The loading indicator bug was ONLY reproducible in production, not in tests.
  // This is because:
  // - Tests explicitly call fixture.detectChanges() 
  // - Production relied on zone.js to automatically trigger change detection
  // - Zone.js was broken/not working properly in production with Angular 21
  //
  // The fix (zoneless + signals) has been manually verified in production to resolve the bug.
  // These tests document the expected production behavior.
  //
  // These tests should be re-enabled after migrating to Vitest (Angular v21 migration)
  // which has better support for testing zoneless applications.
  
  it('should update DOM automatically after loading completes', async () => {
    // Verifies signals trigger automatic DOM updates in production
  });

  it('should update DOM automatically after rolling completes', async () => {
    // Verifies signals trigger automatic DOM updates in production
  });

  it('should update DOM automatically after validation completes', async () => {
    // Verifies signals trigger automatic DOM updates in production
  });
});
```

**Why These Tests Are Disabled:**
1. The loading indicator bug only occurred in production, not in tests
2. Tests explicitly call `fixture.detectChanges()` which masks the issue
3. Production relied on Zone.js automatic change detection, which was broken
4. Current test environment uses Zone.js (needed for `fakeAsync`/`tick`)
5. Zoneless behavior cannot be fully tested with Zone.js present

**Verification Strategy:**
- Manual testing in production confirmed the fix works
- Disabled tests document expected production behavior
- Tests can be re-enabled after migrating to Vitest (better zoneless support)
- All other tests (unit and integration) pass and verify component logic

**Action for Other Generators:**
- Copy the `xdescribe` block to other generator test files
- Update component-specific selectors and method names
- Keep tests disabled until Vitest migration
- Use as documentation of expected production behavior

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


## Gold Standard Enforcement for All Generators

**CRITICAL**: The RollGen implementation serves as the definitive gold standard for migrating all remaining generators (TreasureGen, CharacterGen, EncounterGen, DungeonGen). This section ensures strict adherence to the established patterns.

### Component Implementation - Non-Negotiable Patterns

**1. Signal Declaration Pattern (MUST FOLLOW EXACTLY)**
```typescript
// ✅ CORRECT - Signals for reactive UI state
public loading = signal(false);
public generating = signal(false);  // or rolling, validating, etc.
public validating = signal(false);
public isValid = signal(true);
public result = signal<ResultType | undefined>(undefined);
public model = signal<ViewModelType | undefined>(undefined);

// ✅ CORRECT - Regular properties for inputs
@Input() quantity = 1;
@Input() itemType = 'weapon';

// ✅ CORRECT - Regular properties for constants
public sizes = Size;
public itemTypes: ItemType[] = [...];

// ✅ CORRECT - Private subjects for debouncing
private validationText$ = new Subject<string>();
```

**2. Private Helper Methods Pattern (MUST FOLLOW EXACTLY)**
```typescript
// ✅ CORRECT - Dedicated setter methods
private setResult(data: ResultType): void {
  this.result.set(data);
  this.generating.set(false);
}

private setModel(data: ViewModelType): void {
  this.model.set(data);
  this.loading.set(false);
}

// ✅ CORRECT - Comprehensive error handler
private handleError(error: any): void {
  this.logger.logError(error.message);
  
  // Reset ALL loading signals
  this.result.set(undefined);
  this.generating.set(false);
  this.validating.set(false);
  this.loading.set(false);
  
  this.sweetAlertService.showError();
}
```

**3. RxJS Integration Pattern (MUST FOLLOW EXACTLY)**
```typescript
// ✅ CORRECT - Observable subscription with signal setters
ngOnInit(): void {
  this.loading.set(true);
  
  this.service.getViewModel()
    .subscribe({
      next: data => this.setModel(data),
      error: error => this.handleError(error)
    });
  
  // ✅ CORRECT - Debounced validation with Subject
  this.validationText$
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(text => this.service.validate(text)
        .pipe(catchError(() => of(false)))),
      tap(data => this.setValidity(data))
    )
    .subscribe();
}
```

### Template Migration - Non-Negotiable Patterns

**1. Signal Syntax (MUST APPLY TO ALL SIGNALS)**
```html
<!-- ✅ CORRECT - Signals always use () -->
<dndgen-loading [isLoading]="loading()" [size]="sizes.Large">
  <button [disabled]="!isValid() || validating() || generating()" 
          (click)="generate()">
    Generate
  </button>
  @if (!generating()) {
    <span id="resultSection">{{result() | json}}</span>
  }
  <dndgen-loading [isLoading]="generating()" [size]="sizes.Medium"></dndgen-loading>
</dndgen-loading>

<!-- ✅ CORRECT - Regular properties do NOT use () -->
<select [(ngModel)]="itemType">
  @for (type of itemTypes; track $index) {
    <option [ngValue]="type">{{type.name}}</option>
  }
</select>

<!-- ❌ WRONG - Missing () on signals -->
<button [disabled]="!isValid || validating">Generate</button>

<!-- ❌ WRONG - Adding () to regular properties -->
<option [ngValue]="type()">{{type().name}}</option>
```

### Test Migration - Non-Negotiable Patterns

**1. Unit Test Signal Access (MUST FOLLOW EXACTLY)**
```typescript
// ✅ CORRECT - Signal access with ()
it('should be loading while fetching data', fakeAsync(() => {
  service.getData.and.callFake(() => getFakeDelay(data));
  
  component.ngOnInit();
  
  expect(component.loading()).toBeTrue();  // ✅ Signal with ()
  expect(component.model()).not.toBeDefined();  // ✅ Signal with ()
  
  tick(delay);
  
  expect(component.loading()).toBeFalse();  // ✅ Signal with ()
  expect(component.model()).toEqual(data);  // ✅ Signal with ()
}));

// ✅ CORRECT - Regular property access without ()
it('should initialize input values', () => {
  expect(component.quantity).toEqual(1);  // ✅ Regular property, no ()
  expect(component.itemType).toEqual('weapon');  // ✅ Regular property, no ()
});

// ❌ WRONG - Missing () on signals
expect(component.loading).toBeTrue();  // ❌ Signal needs ()

// ❌ WRONG - Adding () to regular properties
expect(component.quantity()).toEqual(1);  // ❌ Regular property, no ()
```

**2. Integration Test Signal Setters (MUST FOLLOW EXACTLY)**
```typescript
// ✅ CORRECT - Signal setters with .set()
it('should show loading when loading', () => {
  component.loading.set(true);  // ✅ Signal setter
  fixture.detectChanges();
  
  helper.expectLoading('dndgen-loading', true, Size.Large);
});

// ✅ CORRECT - Regular property assignment
it('should update quantity', () => {
  component.quantity = 42;  // ✅ Regular property assignment
  expect(component.quantity).toEqual(42);
});

// ❌ WRONG - Using assignment on signals
component.loading = true;  // ❌ Signal needs .set()

// ❌ WRONG - Using .set() on regular properties
component.quantity.set(42);  // ❌ Regular property, use assignment
```

**3. Test Helper Usage (MUST FOLLOW EXACTLY)**
```typescript
// ✅ CORRECT - Pass signal VALUES to helpers
helper.expectLoading('dndgen-loading', component.loading(), Size.Large);
helper.expectValidating(component.validating(), '#button', '#indicator');
helper.expectGenerating(
  component.generating(),  // ✅ Pass signal value
  '#generateButton',
  '#resultSection',
  '#loadingSection',
  '#validatingSection'
);

// ❌ WRONG - Passing signal references
helper.expectLoading('dndgen-loading', component.loading, Size.Large);  // ❌ Missing ()
```

**4. Disabled Change Detection Tests (MUST INCLUDE)**
```typescript
// ✅ REQUIRED - Copy this xdescribe block to ALL generator tests
xdescribe('change detection', () => {
  // These tests are currently disabled because they test zoneless change detection behavior
  // in production, but our test environment uses zone.js (for fakeAsync/tick support).
  // 
  // IMPORTANT: The loading indicator bug was ONLY reproducible in production, not in tests.
  // This is because:
  // - Tests explicitly call fixture.detectChanges() 
  // - Production relied on zone.js to automatically trigger change detection
  // - Zone.js was broken/not working properly in production with Angular 21
  //
  // The fix (zoneless + signals) has been manually verified in production to resolve the bug.
  // These tests document the expected production behavior.
  //
  // These tests should be re-enabled after migrating to Vitest (Angular v21 migration)
  // which has better support for testing zoneless applications.
  
  it('should update DOM automatically after loading completes', async () => {
    // Update selectors for this generator
  });

  it('should update DOM automatically after generating completes', async () => {
    // Update selectors for this generator
  });

  it('should update DOM automatically after validation completes', async () => {
    // Update selectors for this generator
  });
});
```

### Generator-Specific Adaptations (ALLOWED VARIATIONS)

While the core patterns are non-negotiable, each generator will have specific differences:

**TreasureGen Specifics:**
- Signal names: `generating` instead of `rolling`
- Model type: `TreasureGenViewModel`
- Service methods: `getTreasure()`, `validateTreasure()`
- Result type: Treasure data structures

**CharacterGen Specifics:**
- Signal names: `generating` instead of `rolling`
- Model type: `CharacterGenViewModel`
- Service methods: `getCharacter()`, `validateCharacter()`
- Result type: Character data structures
- May have additional signals for character-specific state

**EncounterGen Specifics:**
- Signal names: `generating` instead of `rolling`
- Model type: `EncounterGenViewModel`
- Service methods: `getEncounter()`, `validateEncounter()`
- Result type: Encounter data structures

**DungeonGen Specifics:**
- Signal names: `generating` instead of `rolling`
- Model type: `DungeonGenViewModel`
- Service methods: `getDungeon()`, `validateDungeon()`
- Result type: Dungeon data structures

### Verification Checklist for Each Generator

Before marking a generator migration as complete, verify:

**Component TypeScript:**
- [ ] All reactive UI state uses signals with `signal()`
- [ ] All `@Input()` properties remain regular properties
- [ ] All constants/enums remain regular properties
- [ ] Private helper methods use `.set()` for signal updates
- [ ] Error handler resets ALL loading signals
- [ ] RxJS observables integrate with signal setters
- [ ] Debounced operations use Subject pattern

**Component Template:**
- [ ] All signal references include `()`
- [ ] All regular property references do NOT include `()`
- [ ] Property bindings use signal syntax: `[prop]="signal()"`
- [ ] Structural directives use signal syntax: `@if (signal())`
- [ ] Boolean expressions use signal syntax: `!signal() || signal()`
- [ ] Event handlers remain unchanged: `(click)="method()"`

**Component Tests:**
- [ ] Unit tests use `component.signal()` for signal access
- [ ] Unit tests use `component.signal.set(value)` for signal setters
- [ ] Unit tests use `component.property` for regular properties
- [ ] Integration tests use `.set()` for signal state changes
- [ ] Test helpers receive signal VALUES: `helper.method(component.signal())`
- [ ] All existing tests pass with signal syntax
- [ ] `xdescribe` block copied and adapted for this generator

**Automated Testing:**
- [ ] Run `npm test` for the generator
- [ ] All tests pass
- [ ] No test failures or errors

**Manual Browser Testing (USER ONLY - CRITICAL):**
- [ ] ⚠️ **This can ONLY be checked by the user**
- [ ] Open generator in browser
- [ ] Test generation with various inputs
- [ ] Verify loading indicators appear and disappear WITHOUT tab switching
- [ ] Test error scenarios (invalid inputs, API failures)
- [ ] Verify validation indicators work correctly
- [ ] Confirm no loading indicator freeze issues

**Why Manual Testing Cannot Be Skipped:**
- The loading indicator bug ONLY occurs in production
- Automated tests pass even when the bug exists
- Tests explicitly call `fixture.detectChanges()` which masks the issue
- Only manual browser testing can verify the fix actually works
- This is the PRIMARY validation that the migration succeeded

**Manual Testing Workflow:**
1. Agent completes component, template, and test migrations
2. Agent runs automated tests and verifies they pass
3. Agent informs user that manual testing is required
4. Agent provides specific testing instructions for the generator
5. User performs manual testing in browser
6. User confirms loading indicators work correctly
7. User manually checks off the manual testing task
8. Only then can the migration be considered complete

**Common Mistakes to Avoid:**
- ❌ Forgetting `()` on signal references in templates
- ❌ Adding `()` to regular properties in templates
- ❌ Using assignment instead of `.set()` for signals in tests
- ❌ Using `.set()` on regular properties
- ❌ Passing signal references instead of values to test helpers
- ❌ Not resetting all loading signals in error handlers
- ❌ Mixing signal and regular property patterns

### Future Agent Instructions

**When implementing any generator migration:**

1. **Read RollGen files first**: Always review rollgen.component.ts, rollgen.component.html, and rollgen.component.spec.ts before starting
2. **Copy patterns exactly**: Use RollGen as a template, adapting only generator-specific names and types
3. **Test syntax is critical**: Signal test syntax must match RollGen exactly - this is where most errors occur
4. **No creative variations**: Stick to the established patterns even if you think there's a "better" way
5. **Verify against checklist**: Use the verification checklist above before marking any task complete
6. **When in doubt, reference RollGen**: If unsure about any pattern, check how RollGen does it

This gold standard is based on a working, tested implementation. Deviating from these patterns will introduce bugs and inconsistencies.
