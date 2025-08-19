import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavMenuComponent } from './nav-menu.component';
import { TestHelper } from '../testHelper.spec';

describe('Nav-Menu Component', () => {
  describe('unit', () => {
      let component: NavMenuComponent;
      
      beforeEach(() => {
        component = new NavMenuComponent();
      });
  
      it('initializes as collapsed', () => {
        expect(component.isMenuCollapsed).toBeTrue();
      });
  });

  describe('integration', () => {
    let fixture: ComponentFixture<NavMenuComponent>;
    let helper: TestHelper<NavMenuComponent>;
  
    beforeEach(async () => {
      await TestHelper.configureTestBed([NavMenuComponent]);
  
      fixture = TestBed.createComponent(NavMenuComponent);
      helper = new TestHelper(fixture);
      
      fixture.detectChanges();
    });
  
    it('should create the navigation menu', () => {
      const menu = fixture.componentInstance;
      expect(menu).toBeTruthy();
    });
  
    it('should render the DnDGen brand', () => {
      helper.expectLink('#rootLink.navbar-brand', 'DnDGen', '/', false);
    });
  
    it('should render the main page links', () => {
      helper.expectTextContents('#mainLinks a', [
        'RollGen',
        'TreasureGen',
        'CharacterGen',
        'EncounterGen',
        'DungeonGen',
      ]);
      
      helper.expectLink('#mainLinks li:nth-of-type(1) a', 'RollGen', '/roll', false);
      helper.expectLink('#mainLinks li:nth-of-type(2) a', 'TreasureGen', '/treasure', false);
      helper.expectLink('#mainLinks li:nth-of-type(3) a', 'CharacterGen', '/character', false);
      helper.expectLink('#mainLinks li:nth-of-type(4) a', 'EncounterGen', '/encounter', false);
      helper.expectLink('#mainLinks li:nth-of-type(5) a', 'DungeonGen', '/dungeon', false);
    });
  
    it('should render the GitHub project links', () => {
      helper.expectLink('#githubLinks a.dropdown-toggle', 'GitHub', '', false);
      helper.expectTextContents('#githubLinks div.dropdown-menu a.dropdown-item', [
        'The DnDGen Project',
        'RollGen',
        'TreasureGen',
        'CharacterGen',
        'EncounterGen',
        'DungeonGen',
        'This Site',
      ]);
      helper.expectLink('#githubLinks #dndgenCodeLink.dropdown-item', 'The DnDGen Project', 'https://github.com/DnDGen', true);
      helper.expectExists('#githubLinks div.dropdown-menu:nth-child(2) hr.dropdown-divider');
      helper.expectLink('#githubLinks #rollgenCodeLink.dropdown-item', 'RollGen', 'https://github.com/DnDGen/RollGen', true);
      helper.expectLink('#githubLinks #treasuregenCodeLink.dropdown-item', 'TreasureGen', 'https://github.com/DnDGen/TreasureGen', true);
      helper.expectLink('#githubLinks #charactergenCodeLink.dropdown-item', 'CharacterGen', 'https://github.com/DnDGen/CharacterGen', true);
      helper.expectLink('#githubLinks #encountergenCodeLink.dropdown-item', 'EncounterGen', 'https://github.com/DnDGen/EncounterGen', true);
      helper.expectLink('#githubLinks #dungeongenCodeLink.dropdown-item', 'DungeonGen', 'https://github.com/DnDGen/DungeonGen', true);
      helper.expectLink('#githubLinks #websiteCodeLink.dropdown-item', 'This Site', 'https://github.com/DnDGen/DnDGen.Web', true);
    });
  
    it('should render the API Swagger links', () => {
      helper.expectLink('#apiLinks a.dropdown-toggle', 'API', '', false);
      helper.expectTextContents('#apiLinks div.dropdown-menu a.dropdown-item', [
        'RollGen',
        'TreasureGen',
        'CharacterGen',
        'EncounterGen',
        'DungeonGen',
      ]);
      helper.expectLink('#apiLinks #rollgenApiLink.dropdown-item', 'RollGen', 'https://roll.dndgen.com/api/swagger/ui', true);
      helper.expectLink('#apiLinks #treasuregenApiLink.dropdown-item', 'TreasureGen', 'https://treasure.dndgen.com/api/swagger/ui', true);
      helper.expectLink('#apiLinks #charactergenApiLink.dropdown-item', 'CharacterGen', 'https://character.dndgen.com/api/swagger/ui', true);
      helper.expectLink('#apiLinks #encountergenApiLink.dropdown-item', 'EncounterGen', 'https://encounter.dndgen.com/api/swagger/ui', true);
      helper.expectLink('#apiLinks #dungeongenApiLink.dropdown-item', 'DungeonGen', 'https://dungeon.dndgen.com/api/swagger/ui', true);
    });
  
    it('should render the link to the official Dungeons & Dragons website', () => {
      helper.expectLink('#officialLink #dndOfficialLink.nav-link', 'Official D&D Site', 'http://dnd.wizards.com/', true);
    });

    it('should toggle whether the navbar is collapsed', () => {
      expect(fixture.componentInstance.isMenuCollapsed).toBeTrue();

      helper.clickButton('button.navbar-toggler');
      fixture.detectChanges();

      expect(fixture.componentInstance.isMenuCollapsed).toBeFalse();

      helper.clickButton('button.navbar-toggler');
      fixture.detectChanges();

      expect(fixture.componentInstance.isMenuCollapsed).toBeTrue();
    });

    it('should collapse the menu when the home link is clicked', () => {
      expect(fixture.componentInstance.isMenuCollapsed).toBeTrue();

      helper.clickLink('#rootLink');
      fixture.detectChanges();

      expect(fixture.componentInstance.isMenuCollapsed).toBeTrue();

      helper.clickButton('button.navbar-toggler');
      fixture.detectChanges();

      expect(fixture.componentInstance.isMenuCollapsed).toBeFalse();

      helper.clickLink('#rootLink');
      fixture.detectChanges();

      expect(fixture.componentInstance.isMenuCollapsed).toBeTrue();
    });

    it('should collapse the menu when the rollgen link is clicked', () => {
      expect(fixture.componentInstance.isMenuCollapsed).toBeTrue();
      helper.expectLink('#mainLinks li:nth-of-type(1) a', 'RollGen', '/roll', false);

      helper.clickLink('#mainLinks li:nth-of-type(1) a');
      fixture.detectChanges();

      expect(fixture.componentInstance.isMenuCollapsed).toBeTrue();

      helper.clickButton('button.navbar-toggler');
      fixture.detectChanges();

      expect(fixture.componentInstance.isMenuCollapsed).toBeFalse();

      helper.clickLink('#mainLinks li:nth-of-type(1) a');
      fixture.detectChanges();

      expect(fixture.componentInstance.isMenuCollapsed).toBeTrue();
    });

    it('should collapse the menu when the treasuregen link is clicked', () => {
      expect(fixture.componentInstance.isMenuCollapsed).toBeTrue();
      helper.expectLink('#mainLinks li:nth-of-type(2) a', 'TreasureGen', '/treasure', false);

      helper.clickLink('#mainLinks li:nth-of-type(2) a');
      fixture.detectChanges();

      expect(fixture.componentInstance.isMenuCollapsed).toBeTrue();

      helper.clickButton('button.navbar-toggler');
      fixture.detectChanges();

      expect(fixture.componentInstance.isMenuCollapsed).toBeFalse();

      helper.clickLink('#mainLinks li:nth-of-type(2) a');
      fixture.detectChanges();

      expect(fixture.componentInstance.isMenuCollapsed).toBeTrue();
    });

    it('should collapse the menu when the charactergen link is clicked', () => {
      expect(fixture.componentInstance.isMenuCollapsed).toBeTrue();
      helper.expectLink('#mainLinks li:nth-of-type(3) a', 'CharacterGen', '/character', false);

      helper.clickLink('#mainLinks li:nth-of-type(3) a');
      fixture.detectChanges();

      expect(fixture.componentInstance.isMenuCollapsed).toBeTrue();

      helper.clickButton('button.navbar-toggler');
      fixture.detectChanges();

      expect(fixture.componentInstance.isMenuCollapsed).toBeFalse();

      helper.clickLink('#mainLinks li:nth-of-type(3) a');
      fixture.detectChanges();

      expect(fixture.componentInstance.isMenuCollapsed).toBeTrue();
    });

    it('should collapse the menu when the encountergen link is clicked', () => {
      expect(fixture.componentInstance.isMenuCollapsed).toBeTrue();
      helper.expectLink('#mainLinks li:nth-of-type(4) a', 'EncounterGen', '/encounter', false);

      helper.clickLink('#mainLinks li:nth-of-type(4) a');
      fixture.detectChanges();

      expect(fixture.componentInstance.isMenuCollapsed).toBeTrue();

      helper.clickButton('button.navbar-toggler');
      fixture.detectChanges();

      expect(fixture.componentInstance.isMenuCollapsed).toBeFalse();

      helper.clickLink('#mainLinks li:nth-of-type(4) a');
      fixture.detectChanges();

      expect(fixture.componentInstance.isMenuCollapsed).toBeTrue();
    });

    it('should collapse the menu when the dungeongen link is clicked', () => {
      expect(fixture.componentInstance.isMenuCollapsed).toBeTrue();
      helper.expectLink('#mainLinks li:nth-of-type(5) a', 'DungeonGen', '/dungeon', false);

      helper.clickLink('#mainLinks li:nth-of-type(5) a');
      fixture.detectChanges();

      expect(fixture.componentInstance.isMenuCollapsed).toBeTrue();

      helper.clickButton('button.navbar-toggler');
      fixture.detectChanges();

      expect(fixture.componentInstance.isMenuCollapsed).toBeFalse();

      helper.clickLink('#mainLinks li:nth-of-type(5) a');
      fixture.detectChanges();

      expect(fixture.componentInstance.isMenuCollapsed).toBeTrue();
    });
  });
});
