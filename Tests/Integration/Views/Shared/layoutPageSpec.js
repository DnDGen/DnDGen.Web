'use strict'

var CommonTestFunctions = require('./../commonTestFunctions.js');

describe('Layout Page', function () {
    var commonTestFunctions = new CommonTestFunctions();

    var brand = element(by.css('.navbar-brand'));

    var diceLink = element(by.id('diceLink'));
    var treasureLink = element(by.id('treasureLink'));
    var characterLink = element(by.id('characterLink'));
    var encounterLink = element(by.id('encounterLink'));
    var dungeonLink = element(by.id('dungeonLink'));

    var collapsedGeneratorLinks = element(by.id('collapsedGeneratorLinks'));
    var collapsedDiceLink = element(by.id('collapsedDiceLink'));
    var collapsedTreasureLink = element(by.id('collapsedTreasureLink'));
    var collapsedCharacterLink = element(by.id('collapsedCharacterLink'));
    var collapsedEncounterLink = element(by.id('collapsedEncounterLink'));
    var collapsedDungeonLink = element(by.id('collapsedDungeonLink'));

    var collapsedGithubLinks = element(by.id('collapsedGithubLinks'));
    var githubOrganizationLink = element(by.id('githubOrganizationLink'));
    var githubDiceLink = element(by.id('githubDiceLink'));
    var githubEquipmentLink = element(by.id('githubEquipmentLink'));
    var githubCharacterLink = element(by.id('githubCharacterLink'));
    var githubEncounterLink = element(by.id('githubEncounterLink'));
    var githubDungeonLink = element(by.id('githubDungeonLink'));
    var githubSiteLink = element(by.id('githubSiteLink'));

    var officialDndLink = element(by.id('officialDndLink'));
    var collapseButton = element(by.id('collapseButton'));

    var header = element(by.css('h1'));

    beforeAll(function () {
        browser.get(browser.baseUrl);
    });

    it('should have a title', function () {
        expect(browser.driver.getTitle()).toEqual('DnDGen');
    });

    describe('when navigating', function () {
        beforeEach(function () {
            browser.get(browser.baseUrl);
        });

        afterAll(function () {
            browser.get(browser.baseUrl);
        });

        describe('to internal sites', function () {
            afterEach(function () {
                browser.manage().logs().get('browser').then(commonTestFunctions.assertNoErrors);
            });

            it('should navigate to the home page', function () {
                browser.get(browser.baseUrl + '/Dice');
                commonTestFunctions.clickWhenReadyAndWaitForResolution(brand);
                expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/');
            });

            it('should navigate to the dice page', function () {
                commonTestFunctions.clickWhenReadyAndWaitForResolution(diceLink);
                expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/Dice');
            });

            it('should navigate to the treasure page', function () {
                commonTestFunctions.clickWhenReadyAndWaitForResolution(treasureLink);
                expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/Treasure');
            });

            it('should navigate to the character page', function () {
                commonTestFunctions.clickWhenReadyAndWaitForResolution(characterLink);
                expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/Character');
            });

            it('should navigate to the encounter page', function () {
                commonTestFunctions.clickWhenReadyAndWaitForResolution(encounterLink);
                expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/Encounter');
            });

            it('should navigate to the dungeon page', function () {
                commonTestFunctions.clickWhenReadyAndWaitForResolution(dungeonLink);
                expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/Dungeon');
            });

            it('should navigate to home from the empty url', function () {
                expect(header.getText()).toBe('Welcome!');
            });

            it('should have implicit view route for home', function () {
                browser.get(browser.baseUrl + '/Home');
                expect(header.getText()).toBe('Welcome!');
            });

            it('should have implicit view route for dice', function () {
                browser.get(browser.baseUrl + '/Dice');
                expect(header.getText()).toBe('RollGen');
            });

            it('should have implicit view route for treasure', function () {
                browser.get(browser.baseUrl + '/Treasure');
                expect(header.getText()).toBe('TreasureGen');
            });

            it('should have implicit view route for character', function () {
                browser.get(browser.baseUrl + '/Character');
                expect(header.getText()).toBe('CharacterGen');
            });

            it('should have implicit view route for encounter', function () {
                browser.get(browser.baseUrl + '/Encounter');
                expect(header.getText()).toBe('EncounterGen');
            });

            it('should have implicit view route for dungeon', function () {
                browser.get(browser.baseUrl + '/Dungeon');
                expect(header.getText()).toBe('DungeonGen');
            });

            it('should go to error page when route is invalid', function () {
                browser.get(browser.baseUrl + '/NotReal');
                expect(header.getText()).toBe('Critical Miss');
            });

            it('should have implicit view route for error', function () {
                browser.get(browser.baseUrl + '/Error');
                expect(header.getText()).toBe('Critical Miss');
            });

            describe('on a small device', function () {
                beforeAll(function () {
                    browser.driver.manage().window().setSize(800, 800);
                });

                afterAll(function () {
                    browser.driver.manage().window().maximize();
                });

                beforeEach(function () {
                    commonTestFunctions.clickWhenReadyAndWaitForResolution(collapsedGeneratorLinks);
                });

                it('should navigate to the dice page', function () {
                    commonTestFunctions.clickWhenReadyAndWaitForResolution(collapsedDiceLink);
                    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/Dice');
                });

                it('should navigate to the treasure page', function () {
                    commonTestFunctions.clickWhenReadyAndWaitForResolution(collapsedTreasureLink);
                    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/Treasure');
                });

                it('should navigate to the character page', function () {
                    commonTestFunctions.clickWhenReadyAndWaitForResolution(collapsedCharacterLink);
                    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/Character');
                });

                it('should navigate to the encounter page', function () {
                    commonTestFunctions.clickWhenReadyAndWaitForResolution(collapsedEncounterLink);
                    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/Encounter');
                });

                it('should navigate to the dungeon page', function () {
                    commonTestFunctions.clickWhenReadyAndWaitForResolution(collapsedDungeonLink);
                    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/Dungeon');
                });
            });
        });

        describe('to external sites', function () {
            it('should navigate to the github organization for DnDGen', function () {
                commonTestFunctions.clickWhenReadyAndWaitForResolution(collapsedGithubLinks);
                commonTestFunctions.clickWhenReadyAndWaitForResolution(githubOrganizationLink);
                expect(browser.getCurrentUrl()).toEqual('https://github.com/DnDGen');
            });

            it('should navigate to the github repository for the RollGen project', function () {
                commonTestFunctions.clickWhenReadyAndWaitForResolution(collapsedGithubLinks);
                commonTestFunctions.clickWhenReadyAndWaitForResolution(githubDiceLink);
                expect(browser.getCurrentUrl()).toEqual('https://github.com/DnDGen/RollGen');
            });

            it('should navigate to the github repository for the TreasureGen project', function () {
                commonTestFunctions.clickWhenReadyAndWaitForResolution(collapsedGithubLinks);
                commonTestFunctions.clickWhenReadyAndWaitForResolution(githubEquipmentLink);
                expect(browser.getCurrentUrl()).toEqual('https://github.com/DnDGen/TreasureGen');
            });

            it('should navigate to the github repository for the CharacterGen project', function () {
                commonTestFunctions.clickWhenReadyAndWaitForResolution(collapsedGithubLinks);
                commonTestFunctions.clickWhenReadyAndWaitForResolution(githubCharacterLink);
                expect(browser.getCurrentUrl()).toEqual('https://github.com/DnDGen/CharacterGen');
            });

            it('should navigate to the github repository for the EncounterGen project', function () {
                commonTestFunctions.clickWhenReadyAndWaitForResolution(collapsedGithubLinks);
                commonTestFunctions.clickWhenReadyAndWaitForResolution(githubEncounterLink);
                expect(browser.getCurrentUrl()).toEqual('https://github.com/DnDGen/EncounterGen');
            });

            it('should navigate to the github repository for the DungeonGen project', function () {
                commonTestFunctions.clickWhenReadyAndWaitForResolution(collapsedGithubLinks);
                commonTestFunctions.clickWhenReadyAndWaitForResolution(githubDungeonLink);
                expect(browser.getCurrentUrl()).toEqual('https://github.com/DnDGen/DungeonGen');
            });

            it('should navigate to the github repository for the DNDGenSite project', function () {
                commonTestFunctions.clickWhenReadyAndWaitForResolution(collapsedGithubLinks);
                commonTestFunctions.clickWhenReadyAndWaitForResolution(githubSiteLink);
                expect(browser.getCurrentUrl()).toEqual('https://github.com/DnDGen/DNDGenSite');
            });

            it('should navigate to the official D&D website', function () {
                commonTestFunctions.clickWhenReadyAndWaitForResolution(officialDndLink);
                expect(browser.getCurrentUrl()).toEqual('http://dnd.wizards.com/');
            });
        });
    });

    describe('on large devices', function () {
        beforeAll(function () {
            browser.driver.manage().window().setSize(1200, 1200);
        });

        afterAll(function () {
            browser.driver.manage().window().maximize();
        });

        afterEach(function () {
            browser.manage().logs().get('browser').then(commonTestFunctions.assertNoErrors);
        });

        it('shows the brand', function () {
            expect(brand.isDisplayed()).toBeTruthy();
        });

        it('shows the dice link', function () {
            expect(diceLink.isDisplayed()).toBeTruthy();
        });

        it('shows the treasure link', function () {
            expect(treasureLink.isDisplayed()).toBeTruthy();
        });

        it('shows the character link', function () {
            expect(characterLink.isDisplayed()).toBeTruthy();
        });

        it('shows the encounter link', function () {
            expect(encounterLink.isDisplayed()).toBeTruthy();
        });

        it('shows the dungeon link', function () {
            expect(dungeonLink.isDisplayed()).toBeTruthy();
        });

        it('does not show the collapsed generator links', function () {
            expect(collapsedGeneratorLinks.isDisplayed()).toBeFalsy();
        });

        it('does not show the small dice link', function () {
            expect(collapsedDiceLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the small treasure link', function () {
            expect(collapsedTreasureLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the small character link', function () {
            expect(collapsedCharacterLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the small encounter link', function () {
            expect(collapsedEncounterLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the small dungeon link', function () {
            expect(collapsedDungeonLink.isDisplayed()).toBeFalsy();
        });

        it('shows the collapsed github links', function () {
            expect(collapsedGithubLinks.isDisplayed()).toBeTruthy();
        });

        it('does not show the github user link', function () {
            expect(githubOrganizationLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the github dice link', function () {
            expect(githubDiceLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the github equipment link', function () {
            expect(githubEquipmentLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the github character link', function () {
            expect(githubCharacterLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the github dungeon link', function () {
            expect(githubDungeonLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the github site link', function () {
            expect(githubSiteLink.isDisplayed()).toBeFalsy();
        });

        it('shows the official D&D link', function () {
            expect(officialDndLink.isDisplayed()).toBeTruthy();
        });

        it('does not show the collapsed menu button', function () {
            expect(collapseButton.isDisplayed()).toBeFalsy();
        });

        describe('after clicking the collapsed github links', function () {
            beforeAll(function () {
                commonTestFunctions.clickWhenReadyAndWaitForResolution(collapsedGithubLinks);
            });

            afterAll(function () {
                commonTestFunctions.clickWhenReadyAndWaitForResolution(collapsedGithubLinks);
            });

            it('shows the github user link', function () {
                expect(githubOrganizationLink.isDisplayed()).toBeTruthy();
            });

            it('shows the github dice link', function () {
                expect(githubDiceLink.isDisplayed()).toBeTruthy();
            });

            it('shows the github equipment link', function () {
                expect(githubEquipmentLink.isDisplayed()).toBeTruthy();
            });

            it('shows the github character link', function () {
                expect(githubCharacterLink.isDisplayed()).toBeTruthy();
            });

            it('shows the github dungeon link', function () {
                expect(githubDungeonLink.isDisplayed()).toBeTruthy();
            });

            it('shows the github site link', function () {
                expect(githubSiteLink.isDisplayed()).toBeTruthy();
            });

            it('does not show the collapsed generator links', function () {
                expect(collapsedGeneratorLinks.isDisplayed()).toBeFalsy();
            });

            it('does not show the small dice link', function () {
                expect(collapsedDiceLink.isDisplayed()).toBeFalsy();
            });

            it('does not show the small treasure link', function () {
                expect(collapsedTreasureLink.isDisplayed()).toBeFalsy();
            });

            it('does not show the small character link', function () {
                expect(collapsedCharacterLink.isDisplayed()).toBeFalsy();
            });

            it('does not show the small encounter link', function () {
                expect(collapsedEncounterLink.isDisplayed()).toBeFalsy();
            });

            it('does not show the small dungeon link', function () {
                expect(collapsedDungeonLink.isDisplayed()).toBeFalsy();
            });

            it('does not show the collapsed menu button', function () {
                expect(collapseButton.isDisplayed()).toBeFalsy();
            });
        });
    });

    describe('on medium devices', function () {
        beforeAll(function () {
            browser.driver.manage().window().setSize(1100, 1100);
        });

        afterEach(function () {
            browser.manage().logs().get('browser').then(commonTestFunctions.assertNoErrors);
        });

        afterAll(function () {
            browser.driver.manage().window().maximize();
        });

        it('shows the brand', function () {
            expect(brand.isDisplayed()).toBeTruthy();
        });

        it('shows the dice link', function () {
            expect(diceLink.isDisplayed()).toBeTruthy();
        });

        it('shows the treasure link', function () {
            expect(treasureLink.isDisplayed()).toBeTruthy();
        });

        it('shows the character link', function () {
            expect(characterLink.isDisplayed()).toBeTruthy();
        });

        it('shows the encounter link', function () {
            expect(encounterLink.isDisplayed()).toBeTruthy();
        });

        it('shows the dungeon link', function () {
            expect(dungeonLink.isDisplayed()).toBeTruthy();
        });

        it('does not show the collapsed generator links', function () {
            expect(collapsedGeneratorLinks.isDisplayed()).toBeFalsy();
        });

        it('does not show the small dice link', function () {
            expect(collapsedDiceLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the small treasure link', function () {
            expect(collapsedTreasureLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the small character link', function () {
            expect(collapsedCharacterLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the small encounter link', function () {
            expect(collapsedEncounterLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the small dungeon link', function () {
            expect(collapsedDungeonLink.isDisplayed()).toBeFalsy();
        });

        it('shows the collapsed github links', function () {
            expect(collapsedGithubLinks.isDisplayed()).toBeTruthy();
        });

        it('does not show the github user link', function () {
            expect(githubOrganizationLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the github dice link', function () {
            expect(githubDiceLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the github equipment link', function () {
            expect(githubEquipmentLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the github character link', function () {
            expect(githubCharacterLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the github dungeon link', function () {
            expect(githubDungeonLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the github site link', function () {
            expect(githubSiteLink.isDisplayed()).toBeFalsy();
        });

        it('shows the official D&D link', function () {
            expect(officialDndLink.isDisplayed()).toBeTruthy();
        });

        it('does not show the collapsed menu button', function () {
            expect(collapseButton.isDisplayed()).toBeFalsy();
        });

        describe('after clicking the collapsed github links', function () {
            beforeAll(function () {
                commonTestFunctions.clickWhenReadyAndWaitForResolution(collapsedGithubLinks);
            });

            afterAll(function () {
                commonTestFunctions.clickWhenReadyAndWaitForResolution(collapsedGithubLinks);
            });

            it('shows the github user link', function () {
                expect(githubOrganizationLink.isDisplayed()).toBeTruthy();
            });

            it('shows the github dice link', function () {
                expect(githubDiceLink.isDisplayed()).toBeTruthy();
            });

            it('shows the github equipment link', function () {
                expect(githubEquipmentLink.isDisplayed()).toBeTruthy();
            });

            it('shows the github character link', function () {
                expect(githubCharacterLink.isDisplayed()).toBeTruthy();
            });

            it('shows the github dungeon link', function () {
                expect(githubDungeonLink.isDisplayed()).toBeTruthy();
            });

            it('shows the github site link', function () {
                expect(githubSiteLink.isDisplayed()).toBeTruthy();
            });

            it('does not show the collapsed generator links', function () {
                expect(collapsedGeneratorLinks.isDisplayed()).toBeFalsy();
            });

            it('does not show the small dice link', function () {
                expect(collapsedDiceLink.isDisplayed()).toBeFalsy();
            });

            it('does not show the small treasure link', function () {
                expect(collapsedTreasureLink.isDisplayed()).toBeFalsy();
            });

            it('does not show the small character link', function () {
                expect(collapsedCharacterLink.isDisplayed()).toBeFalsy();
            });

            it('does not show the small encounter link', function () {
                expect(collapsedEncounterLink.isDisplayed()).toBeFalsy();
            });

            it('does not show the small dungeon link', function () {
                expect(collapsedDungeonLink.isDisplayed()).toBeFalsy();
            });

            it('does not show the collapsed menu button', function () {
                expect(collapseButton.isDisplayed()).toBeFalsy();
            });
        });
    });

    describe('on small devices', function () {
        beforeAll(function () {
            browser.driver.manage().window().setSize(800, 800);
        });

        afterEach(function () {
            browser.manage().logs().get('browser').then(commonTestFunctions.assertNoErrors);
        });

        afterAll(function () {
            browser.driver.manage().window().maximize();
        });

        it('shows the brand', function () {
            expect(brand.isDisplayed()).toBeTruthy();
        });

        it('does not show the dice link', function () {
            expect(diceLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the treasure link', function () {
            expect(treasureLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the character link', function () {
            expect(characterLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the encounter link', function () {
            expect(encounterLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the dungeon link', function () {
            expect(dungeonLink.isDisplayed()).toBeFalsy();
        });

        it('shows the collapsed generator links', function () {
            expect(collapsedGeneratorLinks.isDisplayed()).toBeTruthy();
        });

        it('does not show the small dice link', function () {
            expect(collapsedDiceLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the small treasure link', function () {
            expect(collapsedTreasureLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the small character link', function () {
            expect(collapsedCharacterLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the small encounter link', function () {
            expect(collapsedEncounterLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the small dungeon link', function () {
            expect(collapsedDungeonLink.isDisplayed()).toBeFalsy();
        });

        it('shows the collapsed github links', function () {
            expect(collapsedGithubLinks.isDisplayed()).toBeTruthy();
        });

        it('does not show the github user link', function () {
            expect(githubOrganizationLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the github dice link', function () {
            expect(githubDiceLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the github equipment link', function () {
            expect(githubEquipmentLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the github character link', function () {
            expect(githubCharacterLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the github dungeon link', function () {
            expect(githubDungeonLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the github site link', function () {
            expect(githubSiteLink.isDisplayed()).toBeFalsy();
        });

        it('shows the official D&D link', function () {
            expect(officialDndLink.isDisplayed()).toBeTruthy();
        });

        it('does not show the collapsed menu button', function () {
            expect(collapseButton.isDisplayed()).toBeFalsy();
        });

        describe('after clicking the collapsed generator links', function () {
            beforeAll(function () {
                commonTestFunctions.clickWhenReadyAndWaitForResolution(collapsedGeneratorLinks);
            });

            afterAll(function () {
                commonTestFunctions.clickWhenReadyAndWaitForResolution(collapsedGeneratorLinks);
            });

            it('does not show the github user link', function () {
                expect(githubOrganizationLink.isDisplayed()).toBeFalsy();
            });

            it('does not show the github dice link', function () {
                expect(githubDiceLink.isDisplayed()).toBeFalsy();
            });

            it('does not show the github equipment link', function () {
                expect(githubEquipmentLink.isDisplayed()).toBeFalsy();
            });

            it('does not show the github character link', function () {
                expect(githubCharacterLink.isDisplayed()).toBeFalsy();
            });

            it('does not show the github dungeon link', function () {
                expect(githubDungeonLink.isDisplayed()).toBeFalsy();
            });

            it('does not show the github site link', function () {
                expect(githubSiteLink.isDisplayed()).toBeFalsy();
            });

            it('shows the small dice link', function () {
                expect(collapsedDiceLink.isDisplayed()).toBeTruthy();
            });

            it('shows the small treasure link', function () {
                expect(collapsedTreasureLink.isDisplayed()).toBeTruthy();
            });

            it('shows the small character link', function () {
                expect(collapsedCharacterLink.isDisplayed()).toBeTruthy();
            });

            it('shows the small encounter link', function () {
                expect(collapsedEncounterLink.isDisplayed()).toBeTruthy();
            });

            it('shows the small dungeon link', function () {
                expect(collapsedDungeonLink.isDisplayed()).toBeTruthy();
            });

            it('does not show the collapsed menu button', function () {
                expect(collapseButton.isDisplayed()).toBeFalsy();
            });
        });

        describe('after clicking the collapsed github links', function () {
            beforeAll(function () {
                commonTestFunctions.clickWhenReadyAndWaitForResolution(collapsedGithubLinks);
            });

            afterAll(function () {
                commonTestFunctions.clickWhenReadyAndWaitForResolution(collapsedGithubLinks);
            });

            it('shows the github user link', function () {
                expect(githubOrganizationLink.isDisplayed()).toBeTruthy();
            });

            it('shows the github dice link', function () {
                expect(githubDiceLink.isDisplayed()).toBeTruthy();
            });

            it('shows the github equipment link', function () {
                expect(githubEquipmentLink.isDisplayed()).toBeTruthy();
            });

            it('shows the github character link', function () {
                expect(githubCharacterLink.isDisplayed()).toBeTruthy();
            });

            it('shows the github dungeon link', function () {
                expect(githubDungeonLink.isDisplayed()).toBeTruthy();
            });

            it('shows the github site link', function () {
                expect(githubSiteLink.isDisplayed()).toBeTruthy();
            });

            it('does not show the small dice link', function () {
                expect(collapsedDiceLink.isDisplayed()).toBeFalsy();
            });

            it('does not show the small treasure link', function () {
                expect(collapsedTreasureLink.isDisplayed()).toBeFalsy();
            });

            it('does not show the small character link', function () {
                expect(collapsedCharacterLink.isDisplayed()).toBeFalsy();
            });

            it('does not show the small encounter link', function () {
                expect(collapsedEncounterLink.isDisplayed()).toBeFalsy();
            });

            it('does not show the small dungeon link', function () {
                expect(collapsedDungeonLink.isDisplayed()).toBeFalsy();
            });

            it('does not show the collapsed menu button', function () {
                expect(collapseButton.isDisplayed()).toBeFalsy();
            });
        });
    });

    describe('on extra-small devices', function () {
        beforeAll(function () {
            browser.driver.manage().window().setSize(750, 750);
        });

        afterEach(function () {
            browser.manage().logs().get('browser').then(commonTestFunctions.assertNoErrors);
        });

        afterAll(function () {
            browser.driver.manage().window().maximize();
        });

        it('shows the brand', function () {
            expect(brand.isDisplayed()).toBeTruthy();
        });

        it('does not show the dice link', function () {
            expect(diceLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the treasure link', function () {
            expect(treasureLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the character link', function () {
            expect(characterLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the encounter link', function () {
            expect(encounterLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the dungeon link', function () {
            expect(dungeonLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the collapsed generator links', function () {
            expect(collapsedGeneratorLinks.isDisplayed()).toBeFalsy();
        });

        it('does not show the small dice link', function () {
            expect(collapsedDiceLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the small treasure link', function () {
            expect(collapsedTreasureLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the small character link', function () {
            expect(collapsedCharacterLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the small encounter link', function () {
            expect(collapsedEncounterLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the small dungeon link', function () {
            expect(collapsedDungeonLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the collapsed github links', function () {
            expect(collapsedGithubLinks.isDisplayed()).toBeFalsy();
        });

        it('does not show the github user link', function () {
            expect(githubOrganizationLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the github dice link', function () {
            expect(githubDiceLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the github equipment link', function () {
            expect(githubEquipmentLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the github character link', function () {
            expect(githubCharacterLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the github dungeon link', function () {
            expect(githubDungeonLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the github site link', function () {
            expect(githubSiteLink.isDisplayed()).toBeFalsy();
        });

        it('does not show the official D&D link', function () {
            expect(officialDndLink.isDisplayed()).toBeFalsy();
        });

        it('shows the collapsed menu button', function () {
            expect(collapseButton.isDisplayed()).toBeTruthy();
        });

        describe('after clicking the collapse button', function () {
            beforeAll(function () {
                commonTestFunctions.clickWhenReadyAndWaitForResolution(collapseButton);
            });

            afterAll(function () {
                commonTestFunctions.clickWhenReadyAndWaitForResolution(collapseButton);
            });

            it('does not show the dice link', function () {
                expect(diceLink.isDisplayed()).toBeFalsy();
            });

            it('does not show the treasure link', function () {
                expect(treasureLink.isDisplayed()).toBeFalsy();
            });

            it('does not show the character link', function () {
                expect(characterLink.isDisplayed()).toBeFalsy();
            });

            it('does not show the encounter link', function () {
                expect(encounterLink.isDisplayed()).toBeFalsy();
            });

            it('does not show the dungeon link', function () {
                expect(dungeonLink.isDisplayed()).toBeFalsy();
            });

            it('shows the collapsed generator links', function () {
                expect(collapsedGeneratorLinks.isDisplayed()).toBeTruthy();
            });

            it('does not show the small dice link', function () {
                expect(collapsedDiceLink.isDisplayed()).toBeFalsy();
            });

            it('does not show the small treasure link', function () {
                expect(collapsedTreasureLink.isDisplayed()).toBeFalsy();
            });

            it('does not show the small character link', function () {
                expect(collapsedCharacterLink.isDisplayed()).toBeFalsy();
            });

            it('does not show the small encounter link', function () {
                expect(collapsedEncounterLink.isDisplayed()).toBeFalsy();
            });

            it('does not show the small dungeon link', function () {
                expect(collapsedDungeonLink.isDisplayed()).toBeFalsy();
            });

            it('shows the collapsed github links', function () {
                expect(collapsedGithubLinks.isDisplayed()).toBeTruthy();
            });

            it('does not show the github user link', function () {
                expect(githubOrganizationLink.isDisplayed()).toBeFalsy();
            });

            it('does not show the github dice link', function () {
                expect(githubDiceLink.isDisplayed()).toBeFalsy();
            });

            it('does not show the github equipment link', function () {
                expect(githubEquipmentLink.isDisplayed()).toBeFalsy();
            });

            it('does not show the github character link', function () {
                expect(githubCharacterLink.isDisplayed()).toBeFalsy();
            });

            it('does not show the github dungeon link', function () {
                expect(githubDungeonLink.isDisplayed()).toBeFalsy();
            });

            it('does not show the github site link', function () {
                expect(githubSiteLink.isDisplayed()).toBeFalsy();
            });

            it('shows the official D&D link', function () {
                expect(officialDndLink.isDisplayed()).toBeTruthy();
            });

            describe('after clicking the collapsed generator links', function () {
                beforeAll(function () {
                    commonTestFunctions.clickWhenReadyAndWaitForResolution(collapsedGeneratorLinks);
                });

                afterAll(function () {
                    commonTestFunctions.clickWhenReadyAndWaitForResolution(collapsedGeneratorLinks);
                });

                it('does not show the github user link', function () {
                    expect(githubOrganizationLink.isDisplayed()).toBeFalsy();
                });

                it('does not show the github dice link', function () {
                    expect(githubDiceLink.isDisplayed()).toBeFalsy();
                });

                it('does not show the github equipment link', function () {
                    expect(githubEquipmentLink.isDisplayed()).toBeFalsy();
                });

                it('does not show the github character link', function () {
                    expect(githubCharacterLink.isDisplayed()).toBeFalsy();
                });

                it('does not show the github dungeon link', function () {
                    expect(githubDungeonLink.isDisplayed()).toBeFalsy();
                });

                it('does not show the github site link', function () {
                    expect(githubSiteLink.isDisplayed()).toBeFalsy();
                });

                it('shows the small dice link', function () {
                    expect(collapsedDiceLink.isDisplayed()).toBeTruthy();
                });

                it('shows the small treasure link', function () {
                    expect(collapsedTreasureLink.isDisplayed()).toBeTruthy();
                });

                it('shows the small character link', function () {
                    expect(collapsedCharacterLink.isDisplayed()).toBeTruthy();
                });

                it('shows the small encounter link', function () {
                    expect(collapsedEncounterLink.isDisplayed()).toBeTruthy();
                });

                it('shows the small dungeon link', function () {
                    expect(collapsedDungeonLink.isDisplayed()).toBeTruthy();
                });
            });

            describe('after clicking the collapsed github links', function () {
                beforeAll(function () {
                    commonTestFunctions.clickWhenReadyAndWaitForResolution(collapsedGithubLinks);
                });

                afterAll(function () {
                    commonTestFunctions.clickWhenReadyAndWaitForResolution(collapsedGithubLinks);
                });

                it('shows the github user link', function () {
                    expect(githubOrganizationLink.isDisplayed()).toBeTruthy();
                });

                it('shows the github dice link', function () {
                    expect(githubDiceLink.isDisplayed()).toBeTruthy();
                });

                it('shows the github equipment link', function () {
                    expect(githubEquipmentLink.isDisplayed()).toBeTruthy();
                });

                it('shows the github character link', function () {
                    expect(githubCharacterLink.isDisplayed()).toBeTruthy();
                });

                it('shows the github dungeon link', function () {
                    expect(githubDungeonLink.isDisplayed()).toBeTruthy();
                });

                it('shows the github site link', function () {
                    expect(githubSiteLink.isDisplayed()).toBeTruthy();
                });

                it('does not show the small dice link', function () {
                    expect(collapsedDiceLink.isDisplayed()).toBeFalsy();
                });

                it('does not show the small treasure link', function () {
                    expect(collapsedTreasureLink.isDisplayed()).toBeFalsy();
                });

                it('does not show the small character link', function () {
                    expect(collapsedCharacterLink.isDisplayed()).toBeFalsy();
                });

                it('does not show the small encounter link', function () {
                    expect(collapsedEncounterLink.isDisplayed()).toBeFalsy();
                });

                it('does not show the small dungeon link', function () {
                    expect(collapsedDungeonLink.isDisplayed()).toBeFalsy();
                });
            });
        });
    });
});