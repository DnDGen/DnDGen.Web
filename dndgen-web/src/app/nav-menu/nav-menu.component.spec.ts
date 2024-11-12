import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavMenuComponent } from './nav-menu.component';
import { TestHelper } from '../testHelper.spec';

fdescribe('Nav-Menu Component', () => {
  describe('integration', () => {
    let fixture: ComponentFixture<NavMenuComponent>;
    let helper: TestHelper<NavMenuComponent>;
  
    beforeEach(async () => {
      await TestHelper.configureTestBed([NavMenuComponent]);
  
      fixture = TestBed.createComponent(NavMenuComponent);
      helper = new TestHelper(fixture);
    });
  
    it('should create the navigation menu', () => {
      const menu = fixture.componentInstance;
      expect(menu).toBeTruthy();
    });
  
    it('should render the DnDGen brand', () => {
      fixture.detectChanges();

      helper.expectTextContent('a.navbar-brand', 'DnDGen');
      helper.expectAttribute('a.navbar-brand', 'href', '/');
    });
  
    it('should render the main page links', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      
      const children = compiled?.querySelectorAll('#collapsibleNavbar > ul.navbar-nav > li');
      expect(children).toBeTruthy();
      expect(children?.length).toEqual(5);
      helper.expectLinkOLD(children?.item(0).querySelector('a.nav-link'), 'RollGen', '/roll', false);
      helper.expectLinkOLD(children?.item(1).querySelector('a.nav-link'), 'TreasureGen', '/treasure', false);
      helper.expectLinkOLD(children?.item(2).querySelector('a.nav-link'), 'CharacterGen', '/character', false);
      helper.expectLinkOLD(children?.item(3).querySelector('a.nav-link'), 'EncounterGen', '/encounter', false);
      helper.expectLinkOLD(children?.item(4).querySelector('a.nav-link'), 'DungeonGen', '/dungeon', false);
    });
  
    it('should render the GitHub project links', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      
      helper.expectTextContent('#githubLinks > a.dropdown-toggle', 'GitHub ');

      const children = compiled?.querySelectorAll('#githubLinks > ul.dropdown-menu > li');
      expect(children).toBeTruthy();
      expect(children?.length).toEqual(8);
      helper.expectLinkOLD(children?.item(0).querySelector('a.dropdown-item'), 'The DnDGen Project', 'https://github.com/DnDGen', true);
      expect(children?.item(1).querySelector('hr.dropdown-divider')).toBeTruthy();
      helper.expectLinkOLD(children?.item(2).querySelector('a.dropdown-item'), 'RollGen', 'https://github.com/DnDGen/RollGen', true);
      helper.expectLinkOLD(children?.item(3).querySelector('a.dropdown-item'), 'TreasureGen', 'https://github.com/DnDGen/TreasureGen', true);
      helper.expectLinkOLD(children?.item(4).querySelector('a.dropdown-item'), 'CharacterGen', 'https://github.com/DnDGen/CharacterGen', true);
      helper.expectLinkOLD(children?.item(5).querySelector('a.dropdown-item'), 'EncounterGen', 'https://github.com/DnDGen/EncounterGen', true);
      helper.expectLinkOLD(children?.item(6).querySelector('a.dropdown-item'), 'DungeonGen', 'https://github.com/DnDGen/DungeonGen', true);
      helper.expectLinkOLD(children?.item(7).querySelector('a.dropdown-item'), 'This Site', 'https://github.com/DnDGen/DnDGen.Web', true);
    });
  
    it('should render the API Swagger links', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      
      helper.expectTextContent('#apiLinks > a.dropdown-toggle', 'API ');

      const children = compiled?.querySelectorAll('#apiLinks > ul.dropdown-menu > li');
      expect(children).toBeTruthy();
      expect(children?.length).toEqual(5);
      helper.expectLinkOLD(children?.item(0).querySelector('a.dropdown-item'), 'RollGen', 'https://roll.dndgen.com/api/swagger/ui', true);
      helper.expectLinkOLD(children?.item(1).querySelector('a.dropdown-item'), 'TreasureGen', 'https://treasure.dndgen.com/api/swagger/ui', true);
      helper.expectLinkOLD(children?.item(2).querySelector('a.dropdown-item'), 'CharacterGen', 'https://character.dndgen.com/api/swagger/ui', true);
      helper.expectLinkOLD(children?.item(3).querySelector('a.dropdown-item'), 'EncounterGen', 'https://encounter.dndgen.com/api/swagger/ui', true);
      helper.expectLinkOLD(children?.item(4).querySelector('a.dropdown-item'), 'DungeonGen', 'https://dungeon.dndgen.com/api/swagger/ui', true);
    });
  
    it('should render the link to the official Dungeons & Dragons website', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
  
      helper.expectLinkOLD(compiled.querySelector('#officialLink > a.nav-link'), 'Official D&D Site', 'http://dnd.wizards.com/', true);
    });
  });
});
