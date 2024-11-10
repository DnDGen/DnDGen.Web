import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavMenuComponent } from './nav-menu.component';
import { TestHelper } from '../testHelper.spec';

describe('Nav-Menu Component', () => {
  describe('integration', () => {
    let fixture: ComponentFixture<NavMenuComponent>;
  
    beforeEach(async () => {
      await TestHelper.configureTestBed([NavMenuComponent]);
  
      fixture = TestBed.createComponent(NavMenuComponent);
    });
  
    it('should create the navigation menu', () => {
      const menu = fixture.componentInstance;
      expect(menu).toBeTruthy();
    });
  
    it('should render the DnDGen brand', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
  
      const navbarBrand = compiled.querySelector('a.navbar-brand');
      expect(navbarBrand).toBeDefined();
      expect(navbarBrand?.textContent).toEqual('DnDGen');
      expect(navbarBrand?.getAttribute('href')).toEqual('/');
    });
  
    it('should render the main page links', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      
      const children = compiled?.querySelectorAll('#collapsibleNavbar > ul.navbar-nav > li');
      expect(children).toBeDefined();
      expect(children?.length).toEqual(5);
      assertLink(children?.item(0).querySelector('a.nav-link'), 'RollGen', '/roll', false);
      assertLink(children?.item(1).querySelector('a.nav-link'), 'TreasureGen', '/treasure', false);
      assertLink(children?.item(2).querySelector('a.nav-link'), 'CharacterGen', '/character', false);
      assertLink(children?.item(3).querySelector('a.nav-link'), 'EncounterGen', '/encounter', false);
      assertLink(children?.item(4).querySelector('a.nav-link'), 'DungeonGen', '/dungeon', false);
    });

    function assertLink(element: Element | null | undefined, text: string, link: string, external: boolean) {
      expect(element).toBeTruthy();
      expect(element!.textContent).toEqual(text);
      expect(element!.getAttribute('href')).toEqual(link);
      
      if (external) {
        expect(element!.getAttribute('target')).toBe('_blank');
      } else {
        expect(element!.hasAttribute('target')).toBeFalse();
      }
    }
  
    it('should render the GitHub project links', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      
      const githubLinksTitle = compiled?.querySelector('#githubLinks > a.dropdown-toggle');
      expect(githubLinksTitle).toBeDefined();
      expect(githubLinksTitle?.textContent).toEqual('GitHub ');
      expect(githubLinksTitle?.querySelector('span.caret')).toBeDefined();

      const children = compiled?.querySelectorAll('#githubLinks > ul.dropdown-menu > li');
      expect(children).toBeDefined();
      expect(children?.length).toEqual(8);
      assertLink(children?.item(0).querySelector('a.dropdown-item'), 'The DnDGen Project', 'https://github.com/DnDGen', true);
      expect(children?.item(1).querySelector('hr.dropdown-divider')).toBeDefined();
      assertLink(children?.item(2).querySelector('a.dropdown-item'), 'RollGen', 'https://github.com/DnDGen/RollGen', true);
      assertLink(children?.item(3).querySelector('a.dropdown-item'), 'TreasureGen', 'https://github.com/DnDGen/TreasureGen', true);
      assertLink(children?.item(4).querySelector('a.dropdown-item'), 'CharacterGen', 'https://github.com/DnDGen/CharacterGen', true);
      assertLink(children?.item(5).querySelector('a.dropdown-item'), 'EncounterGen', 'https://github.com/DnDGen/EncounterGen', true);
      assertLink(children?.item(6).querySelector('a.dropdown-item'), 'DungeonGen', 'https://github.com/DnDGen/DungeonGen', true);
      assertLink(children?.item(7).querySelector('a.dropdown-item'), 'This Site', 'https://github.com/DnDGen/DnDGen.Web', true);
    });
  
    it('should render the API Swagger links', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      
      const apiLinksTitle = compiled?.querySelector('#apiLinks > a.dropdown-toggle');
      expect(apiLinksTitle).toBeDefined();
      expect(apiLinksTitle?.textContent).toEqual('API ');
      expect(apiLinksTitle?.querySelector('span.caret')).toBeDefined();

      const children = compiled?.querySelectorAll('#apiLinks > ul.dropdown-menu > li');
      expect(children).toBeDefined();
      expect(children?.length).toEqual(5);
      assertLink(children?.item(0).querySelector('a.dropdown-item'), 'RollGen', 'https://roll.dndgen.com/api/swagger/ui', true);
      assertLink(children?.item(1).querySelector('a.dropdown-item'), 'TreasureGen', 'https://treasure.dndgen.com/api/swagger/ui', true);
      assertLink(children?.item(2).querySelector('a.dropdown-item'), 'CharacterGen', 'https://character.dndgen.com/api/swagger/ui', true);
      assertLink(children?.item(3).querySelector('a.dropdown-item'), 'EncounterGen', 'https://encounter.dndgen.com/api/swagger/ui', true);
      assertLink(children?.item(4).querySelector('a.dropdown-item'), 'DungeonGen', 'https://dungeon.dndgen.com/api/swagger/ui', true);
    });
  
    it('should render the link to the official Dungeons & Dragons website', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
  
      assertLink(compiled.querySelector('#officialLink > a.nav-link'), 'Official D&D Site', 'http://dnd.wizards.com/', true);
    });
  });
});
