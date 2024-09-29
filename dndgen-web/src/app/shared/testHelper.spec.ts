import { ComponentFixture } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { LoadingComponent } from "./components/loading.component";
import { Size } from "./components/size.enum";

export class TestHelper<T> {
  constructor(
    private fixture: ComponentFixture<T>
  ) { }
  
  public expectLoading(selector: string, loading: boolean, size: Size) {
    const element = this.fixture.debugElement.query(By.css(selector));
    expect(element).toBeTruthy();
    expect(element.componentInstance).toBeTruthy();
    expect(element.componentInstance).toBeInstanceOf(LoadingComponent);

    const loadingComponent = element.componentInstance as LoadingComponent;
    expect(loadingComponent.isLoading).toBe(loading);
    expect(loadingComponent.size).toBe(size);
  }

  public expectValidating(buttonSelector: string, validatingSelector: string) {
    this.expectHasAttribute(buttonSelector, 'disabled', true);
    this.expectLoading(validatingSelector, true, Size.Small);
  }

  public expectGenerating(buttonSelector: string, validatingSelector: string, resultSelector: string, generatingSelector: string) {
    this.expectHasAttribute(buttonSelector, 'disabled', true);
    this.expectLoading(validatingSelector, false, Size.Small);
    this.expectHasAttribute(resultSelector, 'hidden', true);
    this.expectLoading(generatingSelector, true, Size.Medium);
  }

  public expectHasAttribute(selector: string, attribute: string, hasAttribute: boolean) {
    const compiled = this.fixture.nativeElement as HTMLElement;

    const element = compiled!.querySelector(selector);
    expect(element).toBeTruthy();
    expect(element!.hasAttribute(attribute)).toBe(hasAttribute);
  }

  public expectGenerated(buttonSelector: string, validatingSelector: string, resultSelector: string, generatingSelector: string) {
    this.expectHasAttribute(buttonSelector, 'disabled', false);
    this.expectLoading(validatingSelector, false, Size.Small);
    this.expectHasAttribute(resultSelector, 'hidden', false);
    this.expectLoading(generatingSelector, false, Size.Medium);
  }

  public expectInvalid(buttonSelector: string, validatingSelector: string) {
    this.expectHasAttribute(buttonSelector, 'disabled', true);
    this.expectLoading(validatingSelector, false, Size.Small);
  }

  public expectValid(buttonSelector: string, validatingSelector: string) {
    this.expectHasAttribute(buttonSelector, 'disabled', false);
    this.expectLoading(validatingSelector, false, Size.Small);
  }

  public setInput(selector: string, value: string) {
    const compiled = this.fixture.nativeElement as HTMLElement;
    const input = compiled!.querySelector(selector) as HTMLInputElement;
    input.value = value;

    input.dispatchEvent(new Event('input'));
  }

  public setSelectByValue(selector: string, value: string) {
    const compiled = this.fixture.nativeElement as HTMLElement;
    const select = compiled!.querySelector(selector) as HTMLSelectElement;
    select.value = value;

    select.dispatchEvent(new Event('change'));
  }

  public setSelectByIndex(selector: string, index: number) {
    const compiled = this.fixture.nativeElement as HTMLElement;
    const select = compiled!.querySelector(selector) as HTMLSelectElement;
    select.value = select.options[index].value;

    select.dispatchEvent(new Event('change'));
  }

  public clickButton(selector: string) {
    this.expectHasAttribute(selector, 'disabled', false);

    const compiled = this.fixture.nativeElement as HTMLElement;
    const button = compiled!.querySelector(selector) as HTMLButtonElement;

    button.click();
  }
}