import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavMenuComponent } from './nav-menu.component';
import { TestHelper } from '../testHelper.spec';

describe('Nav-Menu Component', () => {
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
      helper.expectElements('#collapsibleNavbar > ul.navbar-nav > li.nav-item > a.nav-link', [
        'RollGen',
        'TreasureGen',
        'CharacterGen',
        'EncounterGen',
        'DungeonGen',
      ]);
      helper.expectLink('#collapsibleNavbar #rollgenLink.nav-link', 'RollGen', '/roll', false);
      helper.expectLink('#collapsibleNavbar #treasuregenLink.nav-link', 'TreasureGen', '/treasure', false);
      helper.expectLink('#collapsibleNavbar #charactergenLink.nav-link', 'CharacterGen', '/character', false);
      helper.expectLink('#collapsibleNavbar #encountergenLink.nav-link', 'EncounterGen', '/encounter', false);
      helper.expectLink('#collapsibleNavbar #dungeongenLink.nav-link', 'DungeonGen', '/dungeon', false);
    });
  
    it('should render the GitHub project links', () => {
      helper.expectLink('#githubLinks > a.dropdown-toggle', 'GitHub ', '#', false);
      helper.expectElements('#githubLinks > ul.dropdown-menu > li a.dropdown-item', [
        'The DnDGen Project',
        'RollGen',
        'TreasureGen',
        'CharacterGen',
        'EncounterGen',
        'DungeonGen',
        'This Site',
      ]);
      helper.expectLink('#githubLinks > ul.dropdown-menu > li #dndgenCodeLink.dropdown-item', 'The DnDGen Project', 'https://github.com/DnDGen', true);
      helper.expectExists('#githubLinks > ul.dropdown-menu > li hr.dropdown-divider');
      helper.expectLink('#githubLinks > ul.dropdown-menu > li #rollgenCodeLink.dropdown-item', 'RollGen', 'https://github.com/DnDGen/RollGen', true);
      helper.expectLink('#githubLinks > ul.dropdown-menu > li #treasuregenCodeLink.dropdown-item', 'TreasureGen', 'https://github.com/DnDGen/TreasureGen', true);
      helper.expectLink('#githubLinks > ul.dropdown-menu > li #charactergenCodeLink.dropdown-item', 'CharacterGen', 'https://github.com/DnDGen/CharacterGen', true);
      helper.expectLink('#githubLinks > ul.dropdown-menu > li #encountergenCodeLink.dropdown-item', 'EncounterGen', 'https://github.com/DnDGen/EncounterGen', true);
      helper.expectLink('#githubLinks > ul.dropdown-menu > li #dungeongenCodeLink.dropdown-item', 'DungeonGen', 'https://github.com/DnDGen/DungeonGen', true);
      helper.expectLink('#githubLinks > ul.dropdown-menu > li #websiteCodeLink.dropdown-item', 'This Site', 'https://github.com/DnDGen/DnDGen.Web', true);
    });
  
    it('should render the API Swagger links', () => {
      helper.expectLink('#apiLinks > a.dropdown-toggle', 'API ', '#', false);
      helper.expectElements('#apiLinks > ul.dropdown-menu > li a.dropdown-item', [
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

    it('should test the navbar collapse functionality', () => {
      // Test that collapsed on load
      // Test clicking toggles collapse to false, then true again
      // Test clicking home link toggles collapse from false to true
      // Test clicking rollgen link toggles collapse from false to true
      // Test clicking treasuregen link toggles collapse from false to true
      // Test clicking charactergen link toggles collapse from false to true
      // Test clicking encountergen link toggles collapse from false to true
      // Test clicking dungeongen link toggles collapse from false to true
      expect('not yet written').toBe('');
    });
  });
});
