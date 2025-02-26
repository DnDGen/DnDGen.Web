import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserModule, By } from "@angular/platform-browser";
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
import { DebugElement, importProvidersFrom } from "@angular/core";
import { EncounterComponent } from "./encounter/components/encounter.component";
import { Encounter } from "./encounter/models/encounter.model";
import { FormsModule } from "@angular/forms";
import { provideRouter, RouterOutlet } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { routes } from "./app.routes";
import { BonusPipe } from "./shared/pipes/bonus.pipe";
import { BonusesPipe } from "./shared/pipes/bonuses.pipe";
import { DungeonTreasure } from "./dungeon/models/dungeonTreasure.model";
import { DungeonTreasureComponent } from "./dungeon/components/dungeonTreasure.component";
import { AreaComponent } from "./dungeon/components/area.component";
import { Area } from "./dungeon/models/area.model";
import { provideLocationMocks } from "@angular/common/testing";
import { RouterTestingModule } from "@angular/router/testing";

export class TestHelper<T> {
  constructor(
    private fixture: ComponentFixture<T>
  ) { }

  public static async configureTestBed(imports: any[] = []) {
    await TestBed.configureTestingModule({
      imports: imports,
      providers: [
          importProvidersFrom(BrowserModule, FormsModule, RouterOutlet, NgbModule),
          provideHttpClient(withInterceptorsFromDi()),
          { provide: 'APP_ID', useValue: 'dndgen-web' },
          provideRouter(routes),
          provideLocationMocks(),
          BonusPipe, BonusesPipe
      ]
    }).compileComponents();
  }
  
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
    this.expectDetailsInElement(element, heading, hasDetails);
  }

  private expectDetailsInElement(element: DebugElement, heading: string, hasDetails: boolean) {
    expect(element).toBeTruthy();
    expect(element.componentInstance).toBeTruthy();
    expect(element.componentInstance).toBeInstanceOf(DetailsComponent);

    const details = element.componentInstance as DetailsComponent;
    expect(details.heading).toEqual(heading);
    expect(details.hasDetails).toBe(hasDetails);
  }

  public expectMultipleDetails(selector: string, details: {heading: string, hasDetails: boolean}[]) {
    const elements = this.fixture.debugElement.queryAll(By.css(selector));
    expect(elements).toBeTruthy();
    expect(elements?.length).toEqual(details.length);

    for(let i = 0; i < details.length; i++) {
      this.expectDetailsInElement(elements?.at(i)!, details[i].heading, details[i].hasDetails);
    }
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
    this.expectTreasureInElement(element, treasure);
  }

  public expectTreasures(selector: string, treasures: Treasure[]) {
    const elements = this.fixture.debugElement.queryAll(By.css(selector));
    expect(elements).toBeTruthy();
    expect(elements?.length).toEqual(treasures.length);

    for(var i = 0; i < elements.length; i++) {
      this.expectTreasureInElement(elements?.at(i)!, treasures[i]);
    }
  }

  private expectTreasureInElement(element: DebugElement, treasure: Treasure) {
    expect(element).toBeTruthy();
    expect(element.componentInstance).toBeTruthy();
    expect(element.componentInstance).toBeInstanceOf(TreasureComponent);

    const component = element.componentInstance as TreasureComponent;
    expect(component.treasure).toBe(treasure);
  }

  public expectCharacter(selector: string, hasCharacter: boolean, character?: Character) {
    const element = this.fixture.debugElement.query(By.css(selector));
    this.expectCharacterInElement(element, hasCharacter, character);
  }

  private expectCharacterInElement(element: DebugElement, hasCharacter: boolean, character?: Character) {
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

  public expectCharacters(selector: string, characters: Character[]) {
    const elements = this.fixture.debugElement.queryAll(By.css(selector));
    expect(elements).toBeTruthy();
    expect(elements?.length).toEqual(characters.length);

    for(var i = 0; i < elements.length; i++) {
      this.expectCharacterInElement(elements?.at(i)!, true, characters[i]);
    }
  }

  public expectEncounter(selector: string, hasEncounter: boolean, encounter?: Encounter) {
    const element = this.fixture.debugElement.query(By.css(selector));
    this.expectEncounterInElement(element, hasEncounter, encounter);
  }

  private expectEncounterInElement(element: DebugElement, hasEncounter: boolean, encounter?: Encounter) {
    expect(element).toBeTruthy();
    expect(element.componentInstance).toBeTruthy();
    expect(element.componentInstance).toBeInstanceOf(EncounterComponent);

    const component = element.componentInstance as EncounterComponent;

    if (hasEncounter) {
      expect(component.encounter).toBeTruthy();

      if (encounter)
        expect(component.encounter).toBe(encounter);
    }
  }

  public expectEncounters(selector: string, encounters: Encounter[]) {
    const elements = this.fixture.debugElement.queryAll(By.css(selector));
    expect(elements).toBeTruthy();
    expect(elements?.length).toEqual(encounters.length);

    for(var i = 0; i < elements.length; i++) {
      this.expectEncounterInElement(elements?.at(i)!, true, encounters[i]);
    }
  }

  public expectDungeonTreasure(selector: string, treasure: DungeonTreasure) {
    const element = this.fixture.debugElement.query(By.css(selector));
    this.expectDungeonTreasureInElement(element, treasure);
  }

  private expectDungeonTreasureInElement(element: DebugElement, treasure: DungeonTreasure) {
    expect(element).toBeTruthy();
    expect(element.componentInstance).toBeTruthy();
    expect(element.componentInstance).toBeInstanceOf(DungeonTreasureComponent);

    const component = element.componentInstance as DungeonTreasureComponent;
    expect(component.dungeonTreasure).toBeTruthy();
    expect(component.dungeonTreasure).toBe(treasure);
  }

  public expectDungeonTreasures(selector: string, treasures: DungeonTreasure[]) {
    const elements = this.fixture.debugElement.queryAll(By.css(selector));
    expect(elements).toBeTruthy();
    expect(elements?.length).toEqual(treasures.length);

    for(var i = 0; i < elements.length; i++) {
      this.expectDungeonTreasureInElement(elements?.at(i)!, treasures[i]);
    }
  }

  public expectArea(selector: string, hasArea: boolean, area?: Area) {
    const element = this.fixture.debugElement.query(By.css(selector));
    this.expectAreaInElement(element, hasArea, area);
  }

  private expectAreaInElement(element: DebugElement, hasArea: boolean, area?: Area) {
    expect(element).toBeTruthy();
    expect(element.componentInstance).toBeTruthy();
    expect(element.componentInstance).toBeInstanceOf(AreaComponent);

    const component = element.componentInstance as AreaComponent;

    if (hasArea) {
      expect(component.area).toBeTruthy();

      if (area)
        expect(component.area).toBe(area);
    }
  }

  public expectAreas(selector: string, hasAreas: boolean, areas?: Area[]) {
    const elements = this.fixture.debugElement.queryAll(By.css(selector));
    expect(elements).toBeTruthy();

    if (hasAreas) {
      expect(elements.length).toBeTruthy();
    } else {
      expect(elements.length).toBeFalsy();
    }

    if (areas) {
      expect(elements.length).toBe(areas.length);
    }

    for(var i = 0; i < elements.length; i++) {
      if (areas) {
        this.expectAreaInElement(elements?.at(i)!, true, areas[i]);
      } else {
        this.expectAreaInElement(elements?.at(i)!, true);
      }
    }
  }

  public expectTextContent(selector: string, text: string) {
    const element = this.expectExists(selector);
    expect(element!.textContent).toEqual(text);
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

  public expectGenerating(generating: boolean, buttonSelector: string, resultSelector: string, generatingSelector: string, validatingSelector?: string | null, downloadSelector?: string) {
    expect(generating).toBeTrue();
    this.expectHasAttribute(buttonSelector, 'disabled', true);
    
    if (validatingSelector)
      this.expectLoading(validatingSelector, false, Size.Small);

    this.expectExists(resultSelector, false);
    this.expectLoading(generatingSelector, true, Size.Medium);

    if (downloadSelector)
      this.expectExists(downloadSelector, false);
  }

  public expectExists(selector: string, exists: boolean = true): Element | null {
    const element = this.compiled.querySelector(selector);

    if (exists) {
      expect(element).toBeTruthy();
    } else {
      expect(element).toBeFalsy();
    }

    return element;
  }

  private get compiled(): HTMLElement {
    return this.fixture.nativeElement as HTMLElement;
  }

  public expectHasAttribute(selector: string, attribute: string, hasAttribute: boolean) {
    const element = this.expectExists(selector);
    expect(element!.hasAttribute(attribute)).toBe(hasAttribute);
  }

  public expectAttribute(selector: string, attribute: string, value: string) {
    const element = this.expectExists(selector);
    expect(element!.getAttribute(attribute)).toEqual(value);
  }

  public expectAttributeContains(selector: string, attribute: string, value: string) {
    const element = this.expectExists(selector);
    expect(element!.getAttribute(attribute)).toContain(value);
  }

  public expectElement(selector: string, text: string) {
    const element = this.expectExists(selector);
    expect(element!.textContent).toEqual(text);
  }

  public expectElements(selector: string, text: string[]) {
    const elements = this.compiled.querySelectorAll(selector);
    expect(elements).toBeTruthy();
    expect(elements!.length).toEqual(text.length);

    for(var i = 0; i < elements.length; i++) {
      expect(elements.item(i).textContent).toEqual(text[i]);
    }
  }

  public expectCount(selector: string, count: number): NodeListOf<Element> {
    const elements = this.compiled.querySelectorAll(selector);
    expect(elements).toBeTruthy();
    expect(elements!.length).toEqual(count);

    return elements;
  }

  public expectGenerated(
    generating: boolean, 
    buttonSelector: string, 
    resultSelector: string, 
    generatingSelector: string, 
    validatingSelector?: string | null, 
    downloadSelector?: string | null,
    generatingExists: boolean = true) {

    expect(generating).toBeFalse();
    this.expectHasAttribute(buttonSelector, 'disabled', false);
    
    if (validatingSelector)
      this.expectLoading(validatingSelector, false, Size.Small);

    this.expectExists(resultSelector, true);

    if (generatingExists) {
      this.expectLoading(generatingSelector, false, Size.Medium);
    } else {
      this.expectExists(generatingSelector, false);
    }
    
    if (downloadSelector)
      this.expectExists(downloadSelector, true);
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

  public expectInput(selector: string, required: boolean, value: string) {
    const input = this.compiled.querySelector(selector) as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input!.value).toEqual(value);
    expect(input.getAttribute('type')).toEqual('text');
    this.expectHasAttribute(selector, 'required', required);
  }

  public expectSelect(selector: string, required: boolean, selectedValue: string, optionCount: number, optionValues?: string[]) {   
    this.expectExists(selector);
    this.expectHasAttribute(selector, 'required', required);
    this.expectElement(`${selector} > option:checked`, selectedValue);

    const options = this.compiled.querySelectorAll(`${selector} > option`);
    expect(options).toBeTruthy();
    expect(options!.length).toEqual(optionCount);

    if (optionValues) {
      this.expectElements(`${selector} > option`, optionValues!);
    }
  }

  public expectCheckboxInput(selector: string, required: boolean, value: boolean) {
    const input = this.compiled.querySelector(selector) as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input!.checked).toEqual(value);
    expect(input.getAttribute('type')).toEqual('checkbox');
    this.expectHasAttribute(selector, 'required', required);
  }

  public expectNumberInput(selector: string, required: boolean, value: number, min?: number | null, max?: number | null, negative: boolean = false) {
    const input = this.compiled.querySelector(selector) as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input!.value).toEqual(`${value}`);
    expect(input.getAttribute('type')).toEqual('number');

    if (min)
      expect(input.getAttribute('min')).toEqual(`${min}`);

    if (max)
      expect(input.getAttribute('max')).toEqual(`${max}`);
    
    if (negative)
      expect(input.getAttribute('pattern')).toEqual('^-?[0-9]+$');
    else
      expect(input.getAttribute('pattern')).toEqual('^[0-9]+$');

    this.expectHasAttribute(selector, 'required', required);
  }

  public setInput(selector: string, value: string, extraEvent?: string) {
    this.expectHasAttribute(selector, 'disabled', false);

    const input = this.compiled.querySelector(selector) as HTMLInputElement;
    input.value = value;

    input.dispatchEvent(new Event('input'));

    if (extraEvent)
      input.dispatchEvent(new Event(extraEvent));
  }

  public setCheckbox(selector: string, value: boolean) {
    this.expectHasAttribute(selector, 'disabled', false);

    const checkbox = this.compiled!.querySelector(selector) as HTMLInputElement;
    checkbox.checked = value;

    checkbox.dispatchEvent(new Event('change'));
  }

  public setSelectByValue(selector: string, value: string) {
    this.expectHasAttribute(selector, 'disabled', false);

    const select = this.compiled.querySelector(selector) as HTMLSelectElement;
    select.value = value;

    select.dispatchEvent(new Event('change'));
  }

  public setSelectByIndex(selector: string, index: number) {
    this.expectHasAttribute(selector, 'disabled', false);
    expect(index).toBeGreaterThanOrEqual(0);

    const select = this.compiled.querySelector(selector) as HTMLSelectElement;
    expect(index).toBeLessThan(select.options.length);

    select.value = select.options[index].value;
    select.dispatchEvent(new Event('change'));
  }

  public clickButton(selector: string) {
    this.expectHasAttribute(selector, 'disabled', false);

    const button = this.compiled.querySelector(selector) as HTMLButtonElement;

    button.click();
  }

  public clickCheckbox(selector: string) {
    this.expectHasAttribute(selector, 'disabled', false);

    const checkbox = this.compiled.querySelector(selector) as HTMLInputElement;

    checkbox.click();
  }

  public expectLink(selector: string, text: string, link: string, external: boolean) {
    this.expectTextContent(selector, text);
    this.expectAttribute(selector, 'href', link);
    
    if (external) {
      this.expectAttribute(selector, 'target', '_blank');
    } else {
      this.expectHasAttribute(selector, 'target', false);
    }
  }

  public clickLink(selector: string) {
    this.expectExists(selector);

    const link = this.compiled.querySelector(selector) as HTMLAnchorElement;

    link.click();
  }

  public async waitForService() {
    this.fixture.detectChanges();
    await this.fixture.whenStable();

    //update view
    this.fixture.detectChanges();
  }

  public waitForDebounce(sleep: number = 500) {
    this.fixture.detectChanges();
    setTimeout(() => { }, sleep);
  }

  public static expectLines(actual: string[], expected: string[]) {
      let badIndex = -1;
      for (var i = 0; i < actual.length && i < expected.length; i++) {
          if (actual[i] != expected[i]) {
              badIndex = i;
              break;
          }
      }

      if (badIndex >= 0) {
          expect(actual[badIndex].trim()).toEqual(expected[badIndex].trim());
          expect(actual[badIndex].match(/\\t/g) || []).toEqual(expected[badIndex].match(/\\t/g) || []);
          expect(actual[badIndex]).toEqual(expected[badIndex]);
      }
      
      expect(badIndex).toBe(-1);
      expect(actual.length).toBe(expected.length);
  }

  public static runFlakyTest(test: () => void, iterations: number = 10) {
    for(let i = 0; i < iterations; i++) {
      describe(`FLAKY (run ${i})`, () => {
        test();
      });
    }
  }
}
