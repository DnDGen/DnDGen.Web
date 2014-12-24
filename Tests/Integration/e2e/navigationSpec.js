'use strict';

describe('Navigation', function () {
    browser.ignoreSynchronization = true;

    beforeEach(function () {
        browser.get(browser.baseUrl);
    });

    it('should navigate to the home page', function () {
        browser.get(browser.baseUrl + '/Dice');
        element(by.css('.navbar-brand')).click();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/');
    });

    it('should navigate to the dice page', function () {
        element(by.id('diceLink')).click();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/Dice');
    });

    it('should navigate to the equipment page', function () {
        element(by.id('equipmentLink')).click();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/Equipment');
    });

    it('should navigate to the character page', function () {
        element(by.id('characterLink')).click();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/Character');
    });

    it('should navigate to the dungeon page', function () {
        element(by.id('dungeonLink')).click();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/Dungeon');
    });

    it('should navigate to the github profile for cid the coatrack', function () {
        element(by.id('githubDropdownMenuLink')).click();
        element(by.id('githubUserLink')).click();
        expect(browser.getCurrentUrl()).toEqual('https://github.com/cidthecoatrack');
    });

    it('should navigate to the github repository for the D20-Dice project', function () {
        element(by.id('githubDropdownMenuLink')).click();
        element(by.id('githubDiceLink')).click();
        expect(browser.getCurrentUrl()).toEqual('https://github.com/cidthecoatrack/D20-Dice');
    });

    it('should navigate to the github repository for the EquipmentGen project', function () {
        element(by.id('githubDropdownMenuLink')).click();
        element(by.id('githubEquipmentLink')).click();
        expect(browser.getCurrentUrl()).toEqual('https://github.com/cidthecoatrack/EquipmentGen');
    });

    it('should navigate to the github repository for the NPCGen project', function () {
        element(by.id('githubDropdownMenuLink')).click();
        element(by.id('githubCharacterLink')).click();
        expect(browser.getCurrentUrl()).toEqual('https://github.com/cidthecoatrack/NPCGen');
    });

    it('should navigate to the github repository for the DungeonGen project', function () {
        element(by.id('githubDropdownMenuLink')).click();
        element(by.id('githubDungeonLink')).click();
        expect(browser.getCurrentUrl()).toEqual('https://github.com/cidthecoatrack/DungeonMaker');
    });

    it('should navigate to the github repository for the DNDGenSite project', function () {
        element(by.id('githubDropdownMenuLink')).click();
        element(by.id('githubSiteLink')).click();
        expect(browser.getCurrentUrl()).toEqual('https://github.com/cidthecoatrack/DNDGenSite');
    });

    it('should navigate to the official D&D website', function () {
        element(by.id('officialDndLink')).click();
        expect(browser.getCurrentUrl()).toEqual('http://dnd.wizards.com/');
    });

    it('should navigate to home from the empty url', function () {
        expect(element(by.css('h1')).getText()).toBe('Welcome!');
    });

    it('should have implicit view route for home', function () {
        browser.get(browser.baseUrl + '/Home');
        expect(element(by.css('h1')).getText()).toBe('Welcome!');
    });

    it('should have implicit view route for dice', function () {
        browser.get(browser.baseUrl + '/Dice');
        expect(element(by.css('h1')).getText()).toBe('D20 Dice');
    });

    it('should have implicit view route for equipment', function () {
        browser.get(browser.baseUrl + '/Equipment');
        expect(element(by.css('h1')).getText()).toBe('EquipmentGen');
    });

    it('should have implicit view route for character', function () {
        browser.get(browser.baseUrl + '/Character');
        expect(element(by.css('h1')).getText()).toBe('CharacterGen');
    });

    it('should have implicit view route for dungeon', function () {
        browser.get(browser.baseUrl + '/Dungeon');
        expect(element(by.css('h1')).getText()).toBe('DungeonGen');
    });

    it('should have explicit view route for home', function () {
        browser.get(browser.baseUrl + '/View/Home');
        expect(element(by.css('h1')).getText()).toBe('Welcome!');
    });

    it('should have explicit view route for dice', function () {
        browser.get(browser.baseUrl + '/View/Dice');
        expect(element(by.css('h1')).getText()).toBe('D20 Dice');
    });

    it('should have explicit view route for equipment', function () {
        browser.get(browser.baseUrl + '/View/Equipment');
        expect(element(by.css('h1')).getText()).toBe('EquipmentGen');
    });

    it('should have explicit view route for character', function () {
        browser.get(browser.baseUrl + '/View/Character');
        expect(element(by.css('h1')).getText()).toBe('CharacterGen');
    });

    it('should have explicit view route for dungeon', function () {
        browser.get(browser.baseUrl + '/View/Dungeon');
        expect(element(by.css('h1')).getText()).toBe('DungeonGen');
    });
});