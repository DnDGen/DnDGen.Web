import { ComponentFixture } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { LoadingComponent } from "./shared/components/loading.component";
import { Size } from "./shared/components/size.enum";
import { DetailsComponent } from "./shared/components/details.component";
import { Item } from "./treasure/models/item.model";
import { Treasure } from "./treasure/models/treasure.model";
import { Armor } from "./treasure/models/armor.model";
import { Weapon } from "./treasure/models/weapon.model";
import { ItemComponent } from "./treasure/components/item.component";
import { TreasureComponent } from "./treasure/components/treasure.component";
import { CharacterComponent } from "./character/components/character.component";
import { Character } from "./character/models/character.model";

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

  public expectDetails(selector: string, heading: string, hasDetails: boolean) {
    const element = this.fixture.debugElement.query(By.css(selector));
    expect(element).toBeTruthy();
    expect(element.componentInstance).toBeTruthy();
    expect(element.componentInstance).toBeInstanceOf(DetailsComponent);

    const details = element.componentInstance as DetailsComponent;
    expect(details.heading).toEqual(heading);
    expect(details.hasDetails).toBe(hasDetails);
  }

  public expectItem(selector: string, item: Item | Armor | Weapon) {
    const element = this.fixture.debugElement.query(By.css(selector));
    expect(element).toBeTruthy();
    expect(element.componentInstance).toBeTruthy();
    expect(element.componentInstance).toBeInstanceOf(ItemComponent);

    const component = element.componentInstance as ItemComponent;
    expect(component.item).toBe(item);
  }

  public expectTreasure(selector: string, treasure: Treasure) {
    const element = this.fixture.debugElement.query(By.css(selector));
    expect(element).toBeTruthy();
    expect(element.componentInstance).toBeTruthy();
    expect(element.componentInstance).toBeInstanceOf(TreasureComponent);

    const component = element.componentInstance as TreasureComponent;
    expect(component.treasure).toBe(treasure);
  }

  public expectCharacter(selector: string, hasCharacter: boolean, character?: Character) {
    const element = this.fixture.debugElement.query(By.css(selector));
    expect(element).toBeTruthy();
    expect(element.componentInstance).toBeTruthy();
    expect(element.componentInstance).toBeInstanceOf(CharacterComponent);

    const component = element.componentInstance as CharacterComponent;

    if (hasCharacter) {
      expect(component.character).toBeTruthy();

      if (character)
        expect(component.character).toBe(character);
    }
  }

  public expectTextContent(selector: string, text: string) {
    const element = this.compiled.querySelector(selector);
    expect(element).toBeTruthy();
    expect(element?.textContent).toEqual(text);
  }

  public expectTextContents(selector: string, text: string[]) {
    const listItems = this.compiled.querySelectorAll(selector);
    expect(listItems).toBeTruthy();
    expect(listItems.length).toEqual(text.length);

    for(var i = 0; i < listItems.length; i++) {
      expect(listItems.item(i).textContent).toEqual(text[i]);
    }
  }

  public expectValidating(validating: boolean, buttonSelector: string, validatingSelector: string) {
    expect(validating).toBeTrue();
    this.expectHasAttribute(buttonSelector, 'disabled', true);
    this.expectLoading(validatingSelector, true, Size.Small);
  }

  public expectGenerating(generating: boolean, buttonSelector: string, resultSelector: string, generatingSelector: string, validatingSelector?: string, downloadSelector?: string) {
    expect(generating).toBeTrue();
    this.expectHasAttribute(buttonSelector, 'disabled', true);
    
    if (validatingSelector)
      this.expectLoading(validatingSelector, false, Size.Small);

    this.expectHasAttribute(resultSelector, 'hidden', true);
    this.expectLoading(generatingSelector, true, Size.Medium);

    if (downloadSelector)
      this.expectHasAttribute(downloadSelector, 'hidden', true);
  }

  public expectExists(selector: string, exists: boolean) {
    const element = this.compiled.querySelector(selector);

    if (exists) {
      expect(element).toBeTruthy();
    } else {
      expect(element).toBeFalsy();
    }
  }

  private get compiled(): HTMLElement {
    return this.fixture.nativeElement as HTMLElement;
  }

  public expectHasAttribute(selector: string, attribute: string, hasAttribute: boolean) {
    const element = this.compiled.querySelector(selector);
    expect(element).toBeTruthy();
    expect(element!.hasAttribute(attribute)).toBe(hasAttribute);
  }

  public expectGenerated(buttonSelector: string, validatingSelector: string, resultSelector: string, generatingSelector: string, downloadSelector?: string) {
    this.expectHasAttribute(buttonSelector, 'disabled', false);
    this.expectLoading(validatingSelector, false, Size.Small);
    this.expectHasAttribute(resultSelector, 'hidden', false);
    this.expectLoading(generatingSelector, false, Size.Medium);
    
    if (downloadSelector)
      this.expectHasAttribute(downloadSelector, 'hidden', false);
  }

  public expectInvalid(validating: boolean, validProperty: boolean, buttonSelector: string, validatingSelector: string) {
    expect(validating).toBeFalse();
    expect(validProperty).toBeFalse();
    this.expectHasAttribute(buttonSelector, 'disabled', true);
    this.expectLoading(validatingSelector, false, Size.Small);
  }

  public expectValid(validating: boolean, validProperty: boolean, buttonSelector: string, validatingSelector: string) {
    expect(validating).toBeFalse();
    expect(validProperty).toBeTrue();
    this.expectHasAttribute(buttonSelector, 'disabled', false);
    this.expectLoading(validatingSelector, false, Size.Small);
  }

  public setInput(selector: string, value: string) {
    const input = this.compiled.querySelector(selector) as HTMLInputElement;
    input.value = value;

    input.dispatchEvent(new Event('input'));
  }

  public setSelectByValue(selector: string, value: string) {
    const select = this.compiled.querySelector(selector) as HTMLSelectElement;
    select.value = value;

    select.dispatchEvent(new Event('change'));
  }

  public setSelectByIndex(selector: string, index: number) {
    const select = this.compiled.querySelector(selector) as HTMLSelectElement;
    select.value = select.options[index].value;

    select.dispatchEvent(new Event('change'));
  }

  public clickButton(selector: string) {
    this.expectHasAttribute(selector, 'disabled', false);

    const button = this.compiled.querySelector(selector) as HTMLButtonElement;

    button.click();
  }
}