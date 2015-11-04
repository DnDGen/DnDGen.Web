'use strict'

var CommonTestFunctions = require('./../commonTestFunctions.js');

describe('Character Page', function () {
    var commonTestFunctions = new CommonTestFunctions();

    var alignmentRandomizerTypes = element(by.model('vm.alignmentRandomizerType'));
    var alignmentRandomizerType = alignmentRandomizerTypes.$('option:checked');
    var setAlignments = element(by.model('vm.setAlignment'));
    var setAlignment = setAlignments.$('option:checked');

    var classNameRandomizerTypes = element(by.model('vm.classNameRandomizerType'));
    var classNameRandomizerType = classNameRandomizerTypes.$('option:checked');
    var setClassNames = element(by.model('vm.setClassName'));
    var setClassName = setClassNames.$('option:checked');

    var levelRandomizerTypes = element(by.model('vm.levelRandomizerType'));
    var levelRandomizerType = levelRandomizerTypes.$('option:checked');
    var setLevel = element(by.model('vm.setLevel'));

    var baseRaceRandomizerTypes = element(by.model('vm.baseRaceRandomizerType'));
    var baseRaceRandomizerType = baseRaceRandomizerTypes.$('option:checked');
    var setBaseRaces = element(by.model('vm.setBaseRace'));
    var setBaseRace = setBaseRaces.$('option:checked');

    var metaraceRandomizerTypes = element(by.model('vm.metaraceRandomizerType'));
    var metaraceRandomizerType = metaraceRandomizerTypes.$('option:checked');
    var forceMetarace = element(by.model('vm.forceMetarace'));
    var setMetaraces = element(by.model('vm.setMetarace'));
    var setMetarace = setMetaraces.$('option:checked');

    var statsRandomizerTypes = element(by.model('vm.statsRandomizerType'));
    var statsRandomizerType = statsRandomizerTypes.$('option:checked');
    var setStrength = element(by.model('vm.setStrength'));
    var setConstitution = element(by.model('vm.setConstitution'));
    var setDexterity = element(by.model('vm.setDexterity'));
    var setIntelligence = element(by.model('vm.setIntelligence'));
    var setWisdom = element(by.model('vm.setWisdom'));
    var setCharisma = element(by.model('vm.setCharisma'));

    var generateButton = element(by.id('generateButton'));
    var emptyCharacter = element(by.id('noCharacter'));

    var generatingSection = element(by.id('generatingSection'));
    var character = {
        alignment: element(by.binding('character.Alignment.Full')),
        characterClassWrapper: element(by.id('characterClassWrapper')),
        characterClass: {
            name: element(by.binding('character.Class.Name')),
            level: element(by.binding('character.Class.Level')),
            specialistFields: element.all(by.repeater('field in character.Class.SpecialistFields')),
            prohibitedFields: element.all(by.repeater('field in character.Class.ProhibitedFields'))
        },
        raceWrapper: element(by.id('raceWrapper')),
        race: {
            wholeRace: element(by.binding('character.Race.BaseRace')),
            gender: element(by.binding('character.Race.Male')),
            metaraceSpecies: element(by.binding('character.Race.MetaraceSpecies')),
            landSpeed: element(by.binding('character.Race.LandSpeed')),
            size: element(by.binding('character.Race.Size')),
            hasWings: element(by.binding('character.Race.HasWings')),
            aerialSpeed: element(by.binding('character.Race.AerialSpeed'))
        },
        statsWrapper: element(by.id('statsWrapper')),
        languagesWrapper: element(by.id('languagesWrapper')),
        skillsWrapper: element(by.id('skillsWrapper')),
        featsWrapper: element(by.id('featsWrapper')),
        equipmentWrapper: element(by.id('equipmentWrapper')),
        combatWrapper: element(by.id('combatWrapper')),
        magicWrapper: element(by.id('magicWrapper')),
        animal: element(by.binding('character.Magic.Animal')),
        leadershipWrapper: element(by.id('leadershipWrapper')),
        interestingTrait: element(by.binding('character.InterestingTrait'))
    };

    beforeEach(function () {
        browser.get(browser.baseUrl + '/Character');
    });

    afterEach(function () {
        browser.manage().logs().get('browser').then(commonTestFunctions.assertNoErrors);
    });

    it('should have a header', function () {
        expect(element(by.css('h1')).getText()).toBe('CharacterGen');
    });

    it('loads initial values', function () {
        expect(alignmentRandomizerType.getText()).toBe('Any');
        expect(classNameRandomizerType.getText()).toBe('Any');
        expect(levelRandomizerType.getText()).toBe('Any');
        expect(baseRaceRandomizerType.getText()).toBe('Any Base');
        expect(metaraceRandomizerType.getText()).toBe('Any Meta');
        expect(forceMetarace.isSelected()).toBeFalsy();
        expect(statsRandomizerType.getText()).toBe('Raw');

        expect(emptyCharacter.getText()).toBe('No character has been generated.');
        expect(character.alignment.isDisplayed()).toBeFalsy();
        expect(character.characterClassWrapper.isDisplayed()).toBeFalsy();
        expect(character.raceWrapper.isDisplayed()).toBeFalsy();
        expect(character.abilityWrapper.isDisplayed()).toBeFalsy();
        expect(character.equipmentWrapper.isDisplayed()).toBeFalsy();
        expect(character.combatWrapper.isDisplayed()).toBeFalsy();
        expect(character.magicWrapper.isDisplayed()).toBeFalsy();
        expect(character.leadershipWrapper.isDisplayed()).toBeFalsy();
        expect(character.interestingTrait.isDisplayed()).toBeFalsy();
    });

    it('does not show set values initially', function () {
        expect(setAlignment.isDisplayed()).toBeFalsy();
        expect(setClassName.isDisplayed()).toBeFalsy();
        expect(setLevel.isDisplayed()).toBeFalsy();
        expect(setBaseRace.isDisplayed()).toBeFalsy();
        expect(setMetarace.isDisplayed()).toBeFalsy();
        expect(setStrength.isDisplayed()).toBeFalsy();
        expect(setConstitution.isDisplayed()).toBeFalsy();
        expect(setDexterity.isDisplayed()).toBeFalsy();
        expect(setIntelligence.isDisplayed()).toBeFalsy();
        expect(setWisdom.isDisplayed()).toBeFalsy();
        expect(setCharisma.isDisplayed()).toBeFalsy();
    });

    it('allows generation if randomizers are compatible', function () {
        expect(generateButton.isEnabled()).toBeTruthy();
    });

    it('does not allow generation if randomizers are not compatible', function () {
        commonTestFunctions.selectItemInDropdown(alignmentRandomizerTypes, 'Good');
        commonTestFunctions.selectItemInDropdown(metaraceRandomizerTypes, 'Non-Good');
        commonTestFunctions.clickWhenReadyAndWaitForResolution(forceMetarace);

        expect(generateButton.isEnabled()).toBeFalsy();
    });

    it('generates a character', function () {
        commonTestFunctions.clickWhenReadyAndWaitForResolution(generateButton, generatingSection);
        expect(character.alignment.isDisplayed()).toBeTruthy();
    });

    describe('alignment randomizer type input', function () {
        describe('any alignment randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(alignmentRandomizerTypes, 'Any');
            });

            it('does not show set alignment', function () {
                expect(setAlignment.isDisplayed()).toBeFalsy();
            });
        });

        describe('good alignment randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(alignmentRandomizerTypes, 'Good');
            });

            it('does not show set alignment', function () {
                expect(setAlignment.isDisplayed()).toBeFalsy();
            });
        });

        describe('evil alignment randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(alignmentRandomizerTypes, 'Evil');
            });

            it('does not show set alignment', function () {
                expect(setAlignment.isDisplayed()).toBeFalsy();
            });
        });

        describe('lawful alignment randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(alignmentRandomizerTypes, 'Lawful');
            });

            it('does not show set alignment', function () {
                expect(setAlignment.isDisplayed()).toBeFalsy();
            });
        });

        describe('chaotic alignment randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(alignmentRandomizerTypes, 'Chaotic');
            });

            it('does not show set alignment', function () {
                expect(setAlignment.isDisplayed()).toBeFalsy();
            });
        });

        describe('neutral alignment randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(alignmentRandomizerTypes, 'Neutral');
            });

            it('does not show set alignment', function () {
                expect(setAlignment.isDisplayed()).toBeFalsy();
            });
        });

        describe('non-good alignment randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(alignmentRandomizerTypes, 'Non-Good');
            });

            it('does not show set alignment', function () {
                expect(setAlignment.isDisplayed()).toBeFalsy();
            });
        });

        describe('non-evil alignment randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(alignmentRandomizerTypes, 'Non-Evil');
            });

            it('does not show set alignment', function () {
                expect(setAlignment.isDisplayed()).toBeFalsy();
            });
        });

        describe('non-lawful alignment randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(alignmentRandomizerTypes, 'Non-Lawful');
            });

            it('does not show set alignment', function () {
                expect(setAlignment.isDisplayed()).toBeFalsy();
            });
        });

        describe('non-chaotic alignment randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(alignmentRandomizerTypes, 'Non-Chaotic');
            });

            it('does not show set alignment', function () {
                expect(setAlignment.isDisplayed()).toBeFalsy();
            });
        });

        describe('non-neutral alignment randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(alignmentRandomizerTypes, 'Non-Neutral');
            });

            it('does not show set alignment', function () {
                expect(setAlignment.isDisplayed()).toBeFalsy();
            });
        });

        describe('set alignment randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(alignmentRandomizerTypes, 'Set');
            });

            it('shows set alignment', function () {
                expect(setAlignment.isDisplayed()).toBeTruthy();
            });

            describe('set alignment', function () {
                it('can generates a lawful good character', function () {
                    commonTestFunctions.selectItemInDropdown(setAlignments, 'Lawful Good');
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('generates a neutral good character', function () {
                    commonTestFunctions.selectItemInDropdown(setAlignments, 'Neutral Good');
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('generates a chaotic good character', function () {
                    commonTestFunctions.selectItemInDropdown(setAlignments, 'Chaotic Good');
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('generates a lawful neutral character', function () {
                    commonTestFunctions.selectItemInDropdown(setAlignments, 'Lawful Neutral');
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('generates a true neutral character', function () {
                    commonTestFunctions.selectItemInDropdown(setAlignments, 'True Neutral');
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('generates a chaotic neutral character', function () {
                    commonTestFunctions.selectItemInDropdown(setAlignments, 'Chaotic Neutral');
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('generates a lawful evil character', function () {
                    commonTestFunctions.selectItemInDropdown(setAlignments, 'Lawful Evil');
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('generates a neutral evil character', function () {
                    commonTestFunctions.selectItemInDropdown(setAlignments, 'Neutral Evil');
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('generates a chaotic evil character', function () {
                    commonTestFunctions.selectItemInDropdown(setAlignments, 'Chaotic Evil');
                    expect(generateButton.isEnabled()).toBeTruthy();
                });
            });
        });
    });

    describe('class name randomizer type input', function () {
        describe('any class name randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(classNameRandomizerTypes, 'Any');
            });

            it('does not show set class name', function () {
                expect(setClassName.isDisplayed()).toBeFalsy();
            });
        });

        describe('healer class name randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(classNameRandomizerTypes, 'Healer');
            });

            it('does not show set class name', function () {
                expect(setClassName.isDisplayed()).toBeFalsy();
            });
        });

        describe('warrior class name randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(classNameRandomizerTypes, 'Warrior');
            });

            it('does not show set class name', function () {
                expect(setClassName.isDisplayed()).toBeFalsy();
            });
        });

        describe('spellcaster class name randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(classNameRandomizerTypes, 'Spellcaster');
            });

            it('does not show set class name', function () {
                expect(setClassName.isDisplayed()).toBeFalsy();
            });
        });

        describe('non-spellcaster class name randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(classNameRandomizerTypes, 'Non-Spellcaster');
            });

            it('does not show set class name', function () {
                expect(setClassName.isDisplayed()).toBeFalsy();
            });
        });

        describe('stealthy class name randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(classNameRandomizerTypes, 'Stealthy');
            });

            it('does not show set class name', function () {
                expect(setClassName.isDisplayed()).toBeFalsy();
            });
        });

        describe('set class name randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(classNameRandomizerTypes, 'Set');
            });

            it('shows set class name', function () {
                expect(setClassName.isDisplayed()).toBeTruthy();
            });

            describe('set class name', function () {
                it('generates a barbarian', function () {
                    commonTestFunctions.selectItemInDropdown(setClassNames, 'Barbarian');
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('generates a bard', function () {
                    commonTestFunctions.selectItemInDropdown(setClassNames, 'Bard');
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('generates a cleric', function () {
                    commonTestFunctions.selectItemInDropdown(setClassNames, 'Cleric');
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('generates a druid', function () {
                    commonTestFunctions.selectItemInDropdown(setClassNames, 'Druid');
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('generates a fighter', function () {
                    commonTestFunctions.selectItemInDropdown(setClassNames, 'Fighter');
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('generates a monk', function () {
                    commonTestFunctions.selectItemInDropdown(setClassNames, 'Monk');
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('generates a paladin', function () {
                    commonTestFunctions.selectItemInDropdown(setClassNames, 'Paladin');
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('generates a ranger', function () {
                    commonTestFunctions.selectItemInDropdown(setClassNames, 'Ranger');
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('generates a rogue', function () {
                    commonTestFunctions.selectItemInDropdown(setClassNames, 'Rogue');
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('generates a sorcerer', function () {
                    commonTestFunctions.selectItemInDropdown(setClassNames, 'Sorcerer');
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('generates a wizard', function () {
                    commonTestFunctions.selectItemInDropdown(setClassNames, 'Wizard');
                    expect(generateButton.isEnabled()).toBeTruthy();
                });
            });
        });
    });

    describe('level randomizer type input', function () {
        describe('any level randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(levelRandomizerTypes, 'Any');
            });

            it('does not show set level', function () {
                expect(setLevel.isDisplayed()).toBeFalsy();
            });
        });

        describe('low level randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(levelRandomizerTypes, 'Low');
            });

            it('does not show set level', function () {
                expect(setLevel.isDisplayed()).toBeFalsy();
            });
        });

        describe('medium level randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(levelRandomizerTypes, 'Medium');
            });

            it('does not show set level', function () {
                expect(setLevel.isDisplayed()).toBeFalsy();
            });
        });

        describe('high level randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(levelRandomizerTypes, 'High');
            });

            it('does not show set level', function () {
                expect(setLevel.isDisplayed()).toBeFalsy();
            });
        });

        describe('very high level randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(levelRandomizerTypes, 'Very High');
            });

            it('does not show set level', function () {
                expect(setLevel.isDisplayed()).toBeFalsy();
            });
        });

        describe('set level randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(levelRandomizerTypes, 'Set');
            });

            it('shows set level', function () {
                expect(setLevel.isDisplayed()).toBeTruthy();
            });

            describe('set level', function () {
                it('allows level 20', function () {
                    commonTestFunctions.sendInput(setLevel, 20);
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('allows level 19', function () {
                    commonTestFunctions.sendInput(setLevel, 19);
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('allows level 18', function () {
                    commonTestFunctions.sendInput(setLevel, 18);
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('allows level 17', function () {
                    commonTestFunctions.sendInput(setLevel, 17);
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('allows level 16', function () {
                    commonTestFunctions.sendInput(setLevel, 16);
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('allows level 15', function () {
                    commonTestFunctions.sendInput(setLevel, 15);
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('allows level 14', function () {
                    commonTestFunctions.sendInput(setLevel, 14);
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('allows level 13', function () {
                    commonTestFunctions.sendInput(setLevel, 13);
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('allows level 12', function () {
                    commonTestFunctions.sendInput(setLevel, 12);
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('allows level 11', function () {
                    commonTestFunctions.sendInput(setLevel, 11);
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('allows level 10', function () {
                    commonTestFunctions.sendInput(setLevel, 10);
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('allows level 9', function () {
                    commonTestFunctions.sendInput(setLevel, 9);
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('allows level 8', function () {
                    commonTestFunctions.sendInput(setLevel, 8);
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('allows level 7', function () {
                    commonTestFunctions.sendInput(setLevel, 7);
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('allows level 6', function () {
                    commonTestFunctions.sendInput(setLevel, 6);
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('allows level 5', function () {
                    commonTestFunctions.sendInput(setLevel, 5);
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('allows level 4', function () {
                    commonTestFunctions.sendInput(setLevel, 4);
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('allows level 3', function () {
                    commonTestFunctions.sendInput(setLevel, 3);
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('allows level 2', function () {
                    commonTestFunctions.sendInput(setLevel, 2);
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('allows level 1', function () {
                    commonTestFunctions.sendInput(setLevel, 1);
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('does not allow decimal levels', function () {
                    commonTestFunctions.sendInput(setLevel, 1.5);
                    expect(generateButton.isEnabled()).toBeFalsy();
                });

                it('does not allow level of 0', function () {
                    commonTestFunctions.sendInput(setLevel, 0);
                    expect(generateButton.isEnabled()).toBeFalsy();
                });

                it('does not allow level less than 0', function () {
                    commonTestFunctions.sendInput(setLevel, -1);
                    expect(generateButton.isEnabled()).toBeFalsy();
                });

                it('does not allow non-numeric level', function () {
                    commonTestFunctions.sendInput(setLevel, 'two');
                    expect(generateButton.isEnabled()).toBeFalsy();
                });

                it('does not allow level greater than 20', function () {
                    commonTestFunctions.sendInput(setLevel, 21);
                    expect(generateButton.isEnabled()).toBeFalsy();
                });

                it('does not allow empty level', function () {
                    commonTestFunctions.sendInput(setLevel, '');
                    expect(generateButton.isEnabled()).toBeFalsy();
                });
            });
        });
    });

    describe('base race randomizer type input', function () {
        describe('any base race randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(baseRaceRandomizerTypes, 'Any Base');
            });

            it('does not show set base race', function () {
                expect(setBaseRace.isDisplayed()).toBeFalsy();
            });
        });

        describe('good base race randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(baseRaceRandomizerTypes, 'Good Base');
            });

            it('does not show set base race', function () {
                expect(setBaseRace.isDisplayed()).toBeFalsy();
            });
        });

        describe('evil base race randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(baseRaceRandomizerTypes, 'Evil Base');
            });

            it('does not show set base race', function () {
                expect(setBaseRace.isDisplayed()).toBeFalsy();
            });
        });

        describe('standard base race randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(baseRaceRandomizerTypes, 'Standard');
            });

            it('does not show set base race', function () {
                expect(setBaseRace.isDisplayed()).toBeFalsy();
            });
        });

        describe('non-standard base race randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(baseRaceRandomizerTypes, 'Non-Standard');
            });

            it('does not show set base race', function () {
                expect(setBaseRace.isDisplayed()).toBeFalsy();
            });
        });

        describe('neutral base race randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(baseRaceRandomizerTypes, 'Neutral Base');
            });

            it('does not show set base race', function () {
                expect(setBaseRace.isDisplayed()).toBeFalsy();
            });
        });

        describe('non-good base race randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(baseRaceRandomizerTypes, 'Non-Good Base');
            });

            it('does not show set base race', function () {
                expect(setBaseRace.isDisplayed()).toBeFalsy();
            });
        });

        describe('non-evil base race randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(baseRaceRandomizerTypes, 'Non-Evil Base');
            });

            it('does not show set base race', function () {
                expect(setBaseRace.isDisplayed()).toBeFalsy();
            });
        });

        describe('non-neutral base race randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(baseRaceRandomizerTypes, 'Non-Neutral Base');
            });

            it('does not show set base race', function () {
                expect(setBaseRace.isDisplayed()).toBeFalsy();
            });
        });

        describe('set base race randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(baseRaceRandomizerTypes, 'Set');
            });

            it('shows set base race', function () {
                expect(setBaseRace.isDisplayed()).toBeTruthy();
            });

            it('can generates a set base race', function () {
                commonTestFunctions.selectItemInDropdown(setBaseRaces, 'Human');
                expect(generateButton.isEnabled()).toBeTruthy();
            });
        });
    });

    describe('metarace randomizer type input', function () {
        describe('any metarace randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(metaraceRandomizerTypes, 'Any Meta');
            });

            it('shows force option', function () {
                expect(forceMetarace.isDisplayed()).toBeTruthy();
            });

            it('does not show set metarace', function () {
                expect(setMetarace.isDisplayed()).toBeFalsy();
            });
        });

        describe('good metarace randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(metaraceRandomizerTypes, 'Good Meta');
            });

            it('shows force option', function () {
                expect(forceMetarace.isDisplayed()).toBeTruthy();
            });

            it('does not show set metarace', function () {
                expect(setMetarace.isDisplayed()).toBeFalsy();
            });
        });

        describe('evil metarace randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(metaraceRandomizerTypes, 'Evil Meta');
            });

            it('shows force option', function () {
                expect(forceMetarace.isDisplayed()).toBeTruthy();
            });

            it('does not show set metarace', function () {
                expect(setMetarace.isDisplayed()).toBeFalsy();
            });
        });

        describe('genetic metarace randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(metaraceRandomizerTypes, 'Genetic');
            });

            it('shows force option', function () {
                expect(forceMetarace.isDisplayed()).toBeTruthy();
            });

            it('does not show set metarace', function () {
                expect(setMetarace.isDisplayed()).toBeFalsy();
            });
        });

        describe('no metarace randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(metaraceRandomizerTypes, 'No Meta');
            });

            it('does not show force option', function () {
                expect(forceMetarace.isDisplayed()).toBeFalsy();
            });

            it('does not show set metarace', function () {
                expect(setMetarace.isDisplayed()).toBeFalsy();
            });
        });

        describe('lycanthrope metarace randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(metaraceRandomizerTypes, 'Lycanthrope');
            });

            it('shows force option', function () {
                expect(forceMetarace.isDisplayed()).toBeTruthy();
            });

            it('does not show set metarace', function () {
                expect(setMetarace.isDisplayed()).toBeFalsy();
            });
        });

        describe('neutral metarace randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(metaraceRandomizerTypes, 'Neutral Meta');
            });

            it('shows force option', function () {
                expect(forceMetarace.isDisplayed()).toBeTruthy();
            });

            it('does not show set metarace', function () {
                expect(setMetarace.isDisplayed()).toBeFalsy();
            });
        });

        describe('non-good metarace randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(metaraceRandomizerTypes, 'Non-Good Meta');
            });

            it('shows force option', function () {
                expect(forceMetarace.isDisplayed()).toBeTruthy();
            });

            it('does not show set metarace', function () {
                expect(setMetarace.isDisplayed()).toBeFalsy();
            });
        });

        describe('non-evil metarace randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(metaraceRandomizerTypes, 'Non-Evil Meta');
            });

            it('shows force option', function () {
                expect(forceMetarace.isDisplayed()).toBeTruthy();
            });

            it('does not show set metarace', function () {
                expect(setMetarace.isDisplayed()).toBeFalsy();
            });
        });

        describe('non-neutral metarace randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(metaraceRandomizerTypes, 'Non-Neutral Meta');
            });

            it('shows force option', function () {
                expect(forceMetarace.isDisplayed()).toBeTruthy();
            });

            it('does not show set metarace', function () {
                expect(setMetarace.isDisplayed()).toBeFalsy();
            });
        });

        describe('set metarace randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(metaraceRandomizerTypes, 'Set');
            });

            it('does not show force option', function () {
                expect(forceMetarace.isDisplayed()).toBeFalsy();
            });

            it('shows set metarace', function () {
                expect(setMetarace.isDisplayed()).toBeTruthy();
            });

            it('can generate a set metarace', function () {
                commonTestFunctions.selectItemInDropdown(setMetaraces, 'Werewolf');
                expect(generateButton.isEnabled()).toBeTruthy();
            });
        });
    });

    describe('stats randomizer type input', function () {
        describe('raw stats randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(statsRandomizerTypes, 'Raw');
            });

            it('does not show set stats', function () {
                expect(setStrength.isDisplayed()).toBeFalsy();
                expect(setConstitution.isDisplayed()).toBeFalsy();
                expect(setDexterity.isDisplayed()).toBeFalsy();
                expect(setIntelligence.isDisplayed()).toBeFalsy();
                expect(setWisdom.isDisplayed()).toBeFalsy();
                expect(setCharisma.isDisplayed()).toBeFalsy();
            });
        });

        describe('best of four stats randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(statsRandomizerTypes, 'Best of Four');
            });

            it('does not show set stats', function () {
                expect(setStrength.isDisplayed()).toBeFalsy();
                expect(setConstitution.isDisplayed()).toBeFalsy();
                expect(setDexterity.isDisplayed()).toBeFalsy();
                expect(setIntelligence.isDisplayed()).toBeFalsy();
                expect(setWisdom.isDisplayed()).toBeFalsy();
                expect(setCharisma.isDisplayed()).toBeFalsy();
            });
        });

        describe('1s as 6s stats randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(statsRandomizerTypes, '1s as 6s');
            });

            it('does not show set stats', function () {
                expect(setStrength.isDisplayed()).toBeFalsy();
                expect(setConstitution.isDisplayed()).toBeFalsy();
                expect(setDexterity.isDisplayed()).toBeFalsy();
                expect(setIntelligence.isDisplayed()).toBeFalsy();
                expect(setWisdom.isDisplayed()).toBeFalsy();
                expect(setCharisma.isDisplayed()).toBeFalsy();
            });
        });

        describe('2d10 stats randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(statsRandomizerTypes, '2d10');
            });

            it('does not show set stats', function () {
                expect(setStrength.isDisplayed()).toBeFalsy();
                expect(setConstitution.isDisplayed()).toBeFalsy();
                expect(setDexterity.isDisplayed()).toBeFalsy();
                expect(setIntelligence.isDisplayed()).toBeFalsy();
                expect(setWisdom.isDisplayed()).toBeFalsy();
                expect(setCharisma.isDisplayed()).toBeFalsy();
            });
        });

        describe('low stats randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(statsRandomizerTypes, 'Low');
            });

            it('does not show set stats', function () {
                expect(setStrength.isDisplayed()).toBeFalsy();
                expect(setConstitution.isDisplayed()).toBeFalsy();
                expect(setDexterity.isDisplayed()).toBeFalsy();
                expect(setIntelligence.isDisplayed()).toBeFalsy();
                expect(setWisdom.isDisplayed()).toBeFalsy();
                expect(setCharisma.isDisplayed()).toBeFalsy();
            });
        });

        describe('average stats randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(statsRandomizerTypes, 'Average');
            });

            it('does not show set stats', function () {
                expect(setStrength.isDisplayed()).toBeFalsy();
                expect(setConstitution.isDisplayed()).toBeFalsy();
                expect(setDexterity.isDisplayed()).toBeFalsy();
                expect(setIntelligence.isDisplayed()).toBeFalsy();
                expect(setWisdom.isDisplayed()).toBeFalsy();
                expect(setCharisma.isDisplayed()).toBeFalsy();
            });
        });

        describe('good stats randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(statsRandomizerTypes, 'Good');
            });

            it('does not show set stats', function () {
                expect(setStrength.isDisplayed()).toBeFalsy();
                expect(setConstitution.isDisplayed()).toBeFalsy();
                expect(setDexterity.isDisplayed()).toBeFalsy();
                expect(setIntelligence.isDisplayed()).toBeFalsy();
                expect(setWisdom.isDisplayed()).toBeFalsy();
                expect(setCharisma.isDisplayed()).toBeFalsy();
            });
        });

        describe('heroic stats randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(statsRandomizerTypes, 'Heroic');
            });

            it('does not show set stats', function () {
                expect(setStrength.isDisplayed()).toBeFalsy();
                expect(setConstitution.isDisplayed()).toBeFalsy();
                expect(setDexterity.isDisplayed()).toBeFalsy();
                expect(setIntelligence.isDisplayed()).toBeFalsy();
                expect(setWisdom.isDisplayed()).toBeFalsy();
                expect(setCharisma.isDisplayed()).toBeFalsy();
            });
        });

        describe('set stats randomizer', function () {
            beforeEach(function () {
                commonTestFunctions.selectItemInDropdown(statsRandomizerTypes, 'Set');
            });

            it('shows set stats', function () {
                expect(setStrength.isDisplayed()).toBeTruthy();
                expect(setConstitution.isDisplayed()).toBeTruthy();
                expect(setDexterity.isDisplayed()).toBeTruthy();
                expect(setIntelligence.isDisplayed()).toBeTruthy();
                expect(setWisdom.isDisplayed()).toBeTruthy();
                expect(setCharisma.isDisplayed()).toBeTruthy();
            });

            describe('set strength', function () {
                it('allows higher than 0', function () {
                    commonTestFunctions.sendInput(setStrength, 9266);
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('does not allow decimals', function () {
                    commonTestFunctions.sendInput(setStrength, 1.5);
                    expect(generateButton.isEnabled()).toBeFalsy();
                });

                it('does not allow 0', function () {
                    commonTestFunctions.sendInput(setStrength, 0);
                    expect(generateButton.isEnabled()).toBeFalsy();
                });

                it('does not allow negatives', function () {
                    commonTestFunctions.sendInput(setStrength, -1);
                    expect(generateButton.isEnabled()).toBeFalsy();
                });

                it('does not allow non-numeric', function () {
                    commonTestFunctions.sendInput(setStrength, 'two');
                    expect(generateButton.isEnabled()).toBeFalsy();
                });

                it('does not allow empty', function () {
                    commonTestFunctions.sendInput(setStrength, '');
                    expect(generateButton.isEnabled()).toBeFalsy();
                });
            });

            describe('set constitution', function () {
                it('allows higher than 0', function () {
                    commonTestFunctions.sendInput(setConstitution, 9266);
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('does not allow decimals', function () {
                    commonTestFunctions.sendInput(setConstitution, 1.5);
                    expect(generateButton.isEnabled()).toBeFalsy();
                });

                it('does not allow 0', function () {
                    commonTestFunctions.sendInput(setConstitution, 0);
                    expect(generateButton.isEnabled()).toBeFalsy();
                });

                it('does not allow negatives', function () {
                    commonTestFunctions.sendInput(setConstitution, -1);
                    expect(generateButton.isEnabled()).toBeFalsy();
                });

                it('does not allow non-numeric', function () {
                    commonTestFunctions.sendInput(setConstitution, 'two');
                    expect(generateButton.isEnabled()).toBeFalsy();
                });

                it('does not allow empty', function () {
                    commonTestFunctions.sendInput(setConstitution, '');
                    expect(generateButton.isEnabled()).toBeFalsy();
                });
            });

            describe('set dexterity', function () {
                it('allows higher than 0', function () {
                    commonTestFunctions.sendInput(setDexterity, 9266);
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('does not allow decimals', function () {
                    commonTestFunctions.sendInput(setDexterity, 1.5);
                    expect(generateButton.isEnabled()).toBeFalsy();
                });

                it('does not allow 0', function () {
                    commonTestFunctions.sendInput(setDexterity, 0);
                    expect(generateButton.isEnabled()).toBeFalsy();
                });

                it('does not allow negatives', function () {
                    commonTestFunctions.sendInput(setDexterity, -1);
                    expect(generateButton.isEnabled()).toBeFalsy();
                });

                it('does not allow non-numeric', function () {
                    commonTestFunctions.sendInput(setDexterity, 'two');
                    expect(generateButton.isEnabled()).toBeFalsy();
                });

                it('does not allow empty', function () {
                    commonTestFunctions.sendInput(setDexterity, '');
                    expect(generateButton.isEnabled()).toBeFalsy();
                });
            });

            describe('set intelligence', function () {
                it('allows higher than 0', function () {
                    commonTestFunctions.sendInput(setIntelligence, 9266);
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('does not allow decimals', function () {
                    commonTestFunctions.sendInput(setIntelligence, 1.5);
                    expect(generateButton.isEnabled()).toBeFalsy();
                });

                it('does not allow 0', function () {
                    commonTestFunctions.sendInput(setIntelligence, 0);
                    expect(generateButton.isEnabled()).toBeFalsy();
                });

                it('does not allow negatives', function () {
                    commonTestFunctions.sendInput(setIntelligence, -1);
                    expect(generateButton.isEnabled()).toBeFalsy();
                });

                it('does not allow non-numeric', function () {
                    commonTestFunctions.sendInput(setIntelligence, 'two');
                    expect(generateButton.isEnabled()).toBeFalsy();
                });

                it('does not allow empty', function () {
                    commonTestFunctions.sendInput(setIntelligence, '');
                    expect(generateButton.isEnabled()).toBeFalsy();
                });
            });

            describe('set wisdom', function () {
                it('allows higher than 0', function () {
                    commonTestFunctions.sendInput(setWisdom, 9266);
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('does not allow decimals', function () {
                    commonTestFunctions.sendInput(setWisdom, 1.5);
                    expect(generateButton.isEnabled()).toBeFalsy();
                });

                it('does not allow 0', function () {
                    commonTestFunctions.sendInput(setWisdom, 0);
                    expect(generateButton.isEnabled()).toBeFalsy();
                });

                it('does not allow negatives', function () {
                    commonTestFunctions.sendInput(setWisdom, -1);
                    expect(generateButton.isEnabled()).toBeFalsy();
                });

                it('does not allow non-numeric', function () {
                    commonTestFunctions.sendInput(setWisdom, 'two');
                    expect(generateButton.isEnabled()).toBeFalsy();
                });

                it('does not allow empty', function () {
                    commonTestFunctions.sendInput(setWisdom, '');
                    expect(generateButton.isEnabled()).toBeFalsy();
                });
            });

            describe('set charisma', function () {
                it('allows higher than 0', function () {
                    commonTestFunctions.sendInput(setCharisma, 9266);
                    expect(generateButton.isEnabled()).toBeTruthy();
                });

                it('does not allow decimals', function () {
                    commonTestFunctions.sendInput(setCharisma, 1.5);
                    expect(generateButton.isEnabled()).toBeFalsy();
                });

                it('does not allow 0', function () {
                    commonTestFunctions.sendInput(setCharisma, 0);
                    expect(generateButton.isEnabled()).toBeFalsy();
                });

                it('does not allow negatives', function () {
                    commonTestFunctions.sendInput(setCharisma, -1);
                    expect(generateButton.isEnabled()).toBeFalsy();
                });

                it('does not allow non-numeric', function () {
                    commonTestFunctions.sendInput(setCharisma, 'two');
                    expect(generateButton.isEnabled()).toBeFalsy();
                });

                it('does not allow empty', function () {
                    commonTestFunctions.sendInput(setCharisma, '');
                    expect(generateButton.isEnabled()).toBeFalsy();
                });
            });
        });
    });

    it('shows no character if there is no character', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Character as vm"]');
            var vm = controllerElement.controller();
            vm.character = null;

            controllerElement.scope().$apply();
        }).then(function () {
            expect(emptyCharacter.isDisplayed()).toBeTruthy();
            expect(emptyCharacter.getText()).toBe('No character has been generated.');

            expect(character.alignment.isDisplayed()).toBeFalsy();
            expect(character.characterClassWrapper.isDisplayed()).toBeFalsy();
            expect(character.raceWrapper.isDisplayed()).toBeFalsy();
            expect(character.abilityWrapper.isDisplayed()).toBeFalsy();
            expect(character.equipmentWrapper.isDisplayed()).toBeFalsy();
            expect(character.combatWrapper.isDisplayed()).toBeFalsy();
            expect(character.magicWrapper.isDisplayed()).toBeFalsy();
            expect(character.leadershipWrapper.isDisplayed()).toBeFalsy();
            expect(character.interestingTrait.isDisplayed()).toBeFalsy();
        });
    });

    it('shows character alignment', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Character as vm"]');
            var vm = controllerElement.controller();
            vm.character = {
                Alignment: {
                    Full: 'full alignment'
                }
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(emptyCharacter.isDisplayed()).toBeFalsy();

            expect(character.alignment.isDisplayed()).toBeTruthy();
            expect(character.alignment.getText()).toBe('full alignment');
        });
    });

    it('shows character class', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Character as vm"]');
            var vm = controllerElement.controller();
            vm.character = {
                Class: {
                    Name: 'class name',
                    Level: 9266
                }
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(emptyCharacter.isDisplayed()).toBeFalsy();

            expect(character.characterClassWrapper.isDisplayed()).toBeTruthy();
            expect(character.characterClass.name.getText()).toBe('Level 9266 class name');
            expect(character.characterClass.level.getText()).toBe('Level 9266 class name');
        });
    });

    it('does not show specialist fields if none', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Character as vm"]');
            var vm = controllerElement.controller();
            vm.character = {
                Class: {
                    SpecialistFields: []
                }
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(emptyCharacter.isDisplayed()).toBeFalsy();

            expect(character.characterClassWrapper.isDisplayed()).toBeTruthy();
            expect(character.characterClass.specialistFields.isDisplayed()).toBeFalsy();
        });
    });

    it('shows specialist fields', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Character as vm"]');
            var vm = controllerElement.controller();
            vm.character = {
                Class: {
                    SpecialistFields: ['specialist field']
                }
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(emptyCharacter.isDisplayed()).toBeFalsy();

            expect(character.characterClassWrapper.isDisplayed()).toBeTruthy();
            expect(character.characterClass.specialistFields.isDisplayed()).toBeTruthy();

            element.all(by.repeater('field in character.Class.SpecialistFields'))
                .then(function (fields) {
                    expect(character.characterClass.specialistFields.count()).toBe(1);
                    expect(fields.length).toBe(1);
                    expect(fields[0].getText()).toBe("specialist field");
                });
        });
    });

    it('shows multiple specialist fields', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Character as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                SpecialistFields: ['specialist field', 'other specialist field']
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(treasure.goodsWrapper.isDisplayed()).toBeTruthy();

            element.all(by.repeater('field in character.Class.SpecialistFields'))
                .then(function (fields) {
                    expect(character.characterClass.specialistFields.count()).toBe(2);
                    expect(fields.length).toBe(2);
                    expect(fields[0].getText()).toBe("specialist field");
                    expect(fields[1].getText()).toBe("other specialist field");
                });
        });
    });

    it('does not show prohibited fields if none', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Character as vm"]');
            var vm = controllerElement.controller();
            vm.character = {
                Class: {
                    ProhibitedFields: []
                }
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(emptyCharacter.isDisplayed()).toBeFalsy();

            expect(character.characterClassWrapper.isDisplayed()).toBeTruthy();
            expect(character.characterClass.prohibitedFields.isDisplayed()).toBeFalsy();
        });
    });

    it('shows prohibited fields', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Character as vm"]');
            var vm = controllerElement.controller();
            vm.character = {
                Class: {
                    ProhibitedFields: ['prohibited field']
                }
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(emptyCharacter.isDisplayed()).toBeFalsy();

            expect(character.characterClassWrapper.isDisplayed()).toBeTruthy();
            expect(character.characterClass.prohibitedFields.isDisplayed()).toBeTruthy();

            element.all(by.repeater('field in character.Class.ProhibitedFields'))
                .then(function (fields) {
                    expect(character.characterClass.prohibitedFields.count()).toBe(1);
                    expect(fields.length).toBe(1);
                    expect(fields[0].getText()).toBe("prohibited field");
                });
        });
    });

    it('shows multiple prohibited fields', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Character as vm"]');
            var vm = controllerElement.controller();
            vm.treasure = {
                SpecialistFields: ['prohibited field', 'other prohibited field']
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(treasure.goodsWrapper.isDisplayed()).toBeTruthy();

            element.all(by.repeater('field in character.Class.ProhibitedFields'))
                .then(function (fields) {
                    expect(character.characterClass.prohibitedFields.count()).toBe(2);
                    expect(fields.length).toBe(2);
                    expect(fields[0].getText()).toBe("prohibited field");
                    expect(fields[1].getText()).toBe("other prohibited field");
                });
        });
    });

    it('shows base race', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Character as vm"]');
            var vm = controllerElement.controller();
            vm.character = {
                Race: {
                    BaseRace: 'base race'
                }
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(emptyCharacter.isDisplayed()).toBeFalsy();

            expect(character.race.wholeRace.isDisplayed()).toBeTruthy();
            expect(character.race.wholeRace.getText()).toBe('base race');
        });
    });

    it('shows base race with no metarace', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Character as vm"]');
            var vm = controllerElement.controller();
            vm.character = {
                Race: {
                    BaseRace: 'base race',
                    Metarace: ''
                }
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(emptyCharacter.isDisplayed()).toBeFalsy();

            expect(character.race.wholeRace.isDisplayed()).toBeTruthy();
            expect(character.race.wholeRace.getText()).toBe('base race');
        });
    });

    it('shows base race with metarace', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Character as vm"]');
            var vm = controllerElement.controller();
            vm.character = {
                Race: {
                    BaseRace: 'base race',
                    Metarace: 'metarace'
                }
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(emptyCharacter.isDisplayed()).toBeFalsy();

            expect(character.race.wholeRace.isDisplayed()).toBeTruthy();
            expect(character.race.wholeRace.getText()).toBe('metarace base race');
        });
    });

    it('shows male', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Character as vm"]');
            var vm = controllerElement.controller();
            vm.character = {
                Race: {
                    Male: true
                }
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(emptyCharacter.isDisplayed()).toBeFalsy();

            expect(character.race.gender.isDisplayed()).toBeTruthy();
            expect(character.race.gender.getText()).toBe('Male');
        });
    });

    it('shows female', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Character as vm"]');
            var vm = controllerElement.controller();
            vm.character = {
                Race: {
                    Male: false
                }
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(emptyCharacter.isDisplayed()).toBeFalsy();

            expect(character.race.gender.isDisplayed()).toBeTruthy();
            expect(character.race.gender.getText()).toBe('Female');
        });
    });

    it('shows metarace species', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Character as vm"]');
            var vm = controllerElement.controller();
            vm.character = {
                Race: {
                    MetaraceSpecies: 'metarace species'
                }
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(emptyCharacter.isDisplayed()).toBeFalsy();

            expect(character.race.metaraceSpecies.isDisplayed()).toBeTruthy();
            expect(character.race.metaraceSpecies.getText()).toBe('Metarace Species: metarace species');
        });
    });

    it('does not show empty metarace species', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Character as vm"]');
            var vm = controllerElement.controller();
            vm.character = {
                Race: {
                    MetaraceSpecies: ''
                }
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(emptyCharacter.isDisplayed()).toBeFalsy();
            expect(character.race.metaraceSpecies.isDisplayed()).toBeFalsy();
        });
    });

    it('shows land speed', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Character as vm"]');
            var vm = controllerElement.controller();
            vm.character = {
                Race: {
                    LandSpeed: 9266
                }
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(emptyCharacter.isDisplayed()).toBeFalsy();
            expect(character.race.landSpeed.isDisplayed()).toBeTruthy();
            expect(character.race.landSpeed.getText()).toBe('Land Speed: 9266');
        });
    });

    it('shows size', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Character as vm"]');
            var vm = controllerElement.controller();
            vm.character = {
                Race: {
                    Size: 'size'
                }
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(emptyCharacter.isDisplayed()).toBeFalsy();
            expect(character.race.size.isDisplayed()).toBeTruthy();
            expect(character.race.size.getText()).toBe('Size: size');
        });
    });

    it('shows if it has wings', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Character as vm"]');
            var vm = controllerElement.controller();
            vm.character = {
                Race: {
                    HasWings: true,
                    AerialSpeed: 9266
                }
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(emptyCharacter.isDisplayed()).toBeFalsy();
            expect(character.race.hasWings.isDisplayed()).toBeTruthy();
            expect(character.race.aerialSpeed.isDisplayed()).toBeTruthy();
            expect(character.race.hasWings.getText()).toBe('Has Wings');
            expect(character.race.aerialSpeed.getText()).toBe('Aerial Speed: 9266');
        });
    });

    it('does not show if it does not have wings', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Character as vm"]');
            var vm = controllerElement.controller();
            vm.character = {
                Race: {
                    HasWings: false,
                    AerialSpeed: 9266
                }
            };

            controllerElement.scope().$apply();
        }).then(function () {
            expect(emptyCharacter.isDisplayed()).toBeFalsy();
            expect(character.race.hasWings.isDisplayed()).toBeFalsy();
            expect(character.race.aerialSpeed.isDisplayed()).toBeFalsy();
        });
    });

    it('notifies user while generating', function () {
        browser.executeScript(function () {
            var controllerElement = angular.element('[ng-controller="Character as vm"]');
            var vm = controllerElement.controller();
            vm.generating = true;

            controllerElement.scope().$apply();
        }).then(function () {
            expect(generateButton.isEnabled()).toBeFalsy();
            expect(emptyCharacter.isDisplayed()).toBeFalsy();
            expect(character.alignment.isDisplayed()).toBeFalsy();
            expect(character.characterClassWrapper.isDisplayed()).toBeFalsy();
            expect(character.raceWrapper.isDisplayed()).toBeFalsy();
            expect(character.abilityWrapper.isDisplayed()).toBeFalsy();
            expect(character.equipmentWrapper.isDisplayed()).toBeFalsy();
            expect(character.combatWrapper.isDisplayed()).toBeFalsy();
            expect(character.magicWrapper.isDisplayed()).toBeFalsy();
            expect(character.leadershipWrapper.isDisplayed()).toBeFalsy();
            expect(character.interestingTrait.isDisplayed()).toBeFalsy();

            expect(generatingSection.isDisplayed()).toBeTruthy();
            expect(generatingSection.getText()).toBe('Generating... (This may take a few minutes)');
        });
    });
});