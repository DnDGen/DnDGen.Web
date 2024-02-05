using DnDGen.Api.CharacterGen.Dependencies;
using DnDGen.Api.CharacterGen.Functions;
using DnDGen.Api.CharacterGen.Tests.Integration.Helpers;
using DnDGen.CharacterGen.Abilities;
using DnDGen.CharacterGen.Alignments;
using DnDGen.CharacterGen.CharacterClasses;
using DnDGen.CharacterGen.Characters;
using DnDGen.CharacterGen.Races;
using DnDGen.CharacterGen.Randomizers.Alignments;
using DnDGen.CharacterGen.Randomizers.CharacterClasses;
using DnDGen.CharacterGen.Randomizers.Races;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Web;

namespace DnDGen.Api.CharacterGen.Tests.Integration.Functions
{
    public class GenerateCharacterFunctionTests : IntegrationTests
    {
        private GenerateCharacterFunction function;
        private ILogger logger;

        [SetUp]
        public void Setup()
        {
            var dependencyFactory = GetService<IDependencyFactory>();
            function = new GenerateCharacterFunction(dependencyFactory);

            var loggerFactory = new LoggerFactory();
            logger = loggerFactory.CreateLogger("Integration Test");
        }

        [Test]
        public async Task GenerateCharacter_ReturnsCharacter_AllDefaults()
        {
            var request = RequestHelper.BuildRequest();
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Character>());

            var character = okResult.Value as Character;
            Assert.That(character, Is.Not.Null);
            Assert.That(character.Summary, Is.Not.Empty);
            Assert.That(character.Alignment.Full, Is.Not.Empty);
            Assert.That(character.Class.Level, Is.AtLeast(1));
            Assert.That(character.Class.Summary, Is.Not.Empty);
            Assert.That(character.Race.Summary, Is.Not.Empty);
        }

        [TestCase(AlignmentRandomizerTypeConstants.Any,
            AlignmentConstants.LawfulGood,
            AlignmentConstants.LawfulNeutral,
            AlignmentConstants.LawfulEvil,
            AlignmentConstants.NeutralGood,
            AlignmentConstants.TrueNeutral,
            AlignmentConstants.NeutralEvil,
            AlignmentConstants.ChaoticGood,
            AlignmentConstants.ChaoticNeutral,
            AlignmentConstants.ChaoticEvil)]
        [TestCase(AlignmentRandomizerTypeConstants.Chaotic,
            AlignmentConstants.ChaoticGood,
            AlignmentConstants.ChaoticNeutral,
            AlignmentConstants.ChaoticEvil)]
        [TestCase(AlignmentRandomizerTypeConstants.Evil,
            AlignmentConstants.LawfulEvil,
            AlignmentConstants.NeutralEvil,
            AlignmentConstants.ChaoticEvil)]
        [TestCase(AlignmentRandomizerTypeConstants.Good,
            AlignmentConstants.LawfulGood,
            AlignmentConstants.NeutralGood,
            AlignmentConstants.ChaoticGood)]
        [TestCase(AlignmentRandomizerTypeConstants.Lawful,
            AlignmentConstants.LawfulGood,
            AlignmentConstants.LawfulNeutral,
            AlignmentConstants.LawfulEvil)]
        [TestCase(AlignmentRandomizerTypeConstants.Neutral,
            AlignmentConstants.LawfulNeutral,
            AlignmentConstants.NeutralGood,
            AlignmentConstants.TrueNeutral,
            AlignmentConstants.NeutralEvil,
            AlignmentConstants.ChaoticNeutral)]
        [TestCase(AlignmentRandomizerTypeConstants.NonChaotic,
            AlignmentConstants.LawfulGood,
            AlignmentConstants.LawfulNeutral,
            AlignmentConstants.LawfulEvil,
            AlignmentConstants.NeutralGood,
            AlignmentConstants.TrueNeutral,
            AlignmentConstants.NeutralEvil)]
        [TestCase(AlignmentRandomizerTypeConstants.NonEvil,
            AlignmentConstants.LawfulGood,
            AlignmentConstants.LawfulNeutral,
            AlignmentConstants.NeutralGood,
            AlignmentConstants.TrueNeutral,
            AlignmentConstants.ChaoticGood,
            AlignmentConstants.ChaoticNeutral)]
        [TestCase(AlignmentRandomizerTypeConstants.NonGood,
            AlignmentConstants.LawfulNeutral,
            AlignmentConstants.LawfulEvil,
            AlignmentConstants.TrueNeutral,
            AlignmentConstants.NeutralEvil,
            AlignmentConstants.ChaoticNeutral,
            AlignmentConstants.ChaoticEvil)]
        [TestCase(AlignmentRandomizerTypeConstants.NonLawful,
            AlignmentConstants.NeutralGood,
            AlignmentConstants.TrueNeutral,
            AlignmentConstants.NeutralEvil,
            AlignmentConstants.ChaoticGood,
            AlignmentConstants.ChaoticNeutral,
            AlignmentConstants.ChaoticEvil)]
        [TestCase(AlignmentRandomizerTypeConstants.NonNeutral,
            AlignmentConstants.LawfulGood,
            AlignmentConstants.LawfulEvil,
            AlignmentConstants.ChaoticGood,
            AlignmentConstants.ChaoticEvil)]
        public async Task GenerateCharacter_ReturnsCharacter_AlignmentRandomizers(string alignmentRandomizerType, params string[] expectedAlignments)
        {
            var request = RequestHelper.BuildRequest($"?alignmentRandomizerType={HttpUtility.UrlEncode(alignmentRandomizerType)}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Character>());

            var character = okResult.Value as Character;
            Assert.That(character, Is.Not.Null);
            Assert.That(character.Summary, Is.Not.Empty);
            Assert.That(character.Alignment.Full, Is.Not.Empty.And.AnyOf(expectedAlignments));
            Assert.That(character.Class.Level, Is.AtLeast(1));
            Assert.That(character.Class.Summary, Is.Not.Empty);
            Assert.That(character.Race.Summary, Is.Not.Empty);
        }

        [TestCase(AlignmentConstants.LawfulGood)]
        [TestCase(AlignmentConstants.LawfulNeutral)]
        [TestCase(AlignmentConstants.LawfulEvil)]
        [TestCase(AlignmentConstants.NeutralGood)]
        [TestCase(AlignmentConstants.TrueNeutral)]
        [TestCase(AlignmentConstants.NeutralEvil)]
        [TestCase(AlignmentConstants.ChaoticGood)]
        [TestCase(AlignmentConstants.ChaoticNeutral)]
        [TestCase(AlignmentConstants.ChaoticEvil)]
        public async Task GenerateCharacter_ReturnsCharacter_SetAlignment(string alignment)
        {
            var request = RequestHelper.BuildRequest($"?alignmentRandomizerType=Set&setAlignment={HttpUtility.UrlEncode(alignment)}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Character>());

            var character = okResult.Value as Character;
            Assert.That(character, Is.Not.Null);
            Assert.That(character.Summary, Is.Not.Empty);
            Assert.That(character.Alignment.Full, Is.EqualTo(alignment));
            Assert.That(character.Class.Level, Is.AtLeast(1));
            Assert.That(character.Class.Summary, Is.Not.Empty);
            Assert.That(character.Race.Summary, Is.Not.Empty);
        }

        [TestCase(ClassNameRandomizerTypeConstants.AnyPlayer,
            CharacterClassConstants.Barbarian,
            CharacterClassConstants.Bard,
            CharacterClassConstants.Cleric,
            CharacterClassConstants.Druid,
            CharacterClassConstants.Fighter,
            CharacterClassConstants.Monk,
            CharacterClassConstants.Paladin,
            CharacterClassConstants.Ranger,
            CharacterClassConstants.Rogue,
            CharacterClassConstants.Sorcerer,
            CharacterClassConstants.Wizard)]
        [TestCase(ClassNameRandomizerTypeConstants.AnyNPC,
            CharacterClassConstants.Adept,
            CharacterClassConstants.Aristocrat,
            CharacterClassConstants.Commoner,
            CharacterClassConstants.Expert,
            CharacterClassConstants.Warrior)]
        [TestCase(ClassNameRandomizerTypeConstants.ArcaneSpellcaster,
            CharacterClassConstants.Bard,
            CharacterClassConstants.Sorcerer,
            CharacterClassConstants.Wizard)]
        [TestCase(ClassNameRandomizerTypeConstants.DivineSpellcaster,
            CharacterClassConstants.Cleric,
            CharacterClassConstants.Druid,
            CharacterClassConstants.Paladin,
            CharacterClassConstants.Ranger)]
        [TestCase(ClassNameRandomizerTypeConstants.NonSpellcaster,
            CharacterClassConstants.Barbarian,
            CharacterClassConstants.Fighter,
            CharacterClassConstants.Monk,
            CharacterClassConstants.Rogue)]
        [TestCase(ClassNameRandomizerTypeConstants.PhysicalCombat,
            CharacterClassConstants.Barbarian,
            CharacterClassConstants.Fighter,
            CharacterClassConstants.Monk,
            CharacterClassConstants.Paladin,
            CharacterClassConstants.Ranger)]
        [TestCase(ClassNameRandomizerTypeConstants.Spellcaster,
            CharacterClassConstants.Bard,
            CharacterClassConstants.Cleric,
            CharacterClassConstants.Druid,
            CharacterClassConstants.Paladin,
            CharacterClassConstants.Ranger,
            CharacterClassConstants.Sorcerer,
            CharacterClassConstants.Wizard)]
        [TestCase(ClassNameRandomizerTypeConstants.Stealth,
            CharacterClassConstants.Bard,
            CharacterClassConstants.Ranger,
            CharacterClassConstants.Rogue)]
        public async Task GenerateCharacter_ReturnsCharacter_ClassNameRandomizers(string classNameRandomizerType, params string[] expectedClassNames)
        {
            var request = RequestHelper.BuildRequest($"?classNameRandomizerType={HttpUtility.UrlEncode(classNameRandomizerType)}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Character>());

            var character = okResult.Value as Character;
            Assert.That(character, Is.Not.Null);
            Assert.That(character.Summary, Is.Not.Empty);
            Assert.That(character.Alignment.Full, Is.Not.Empty);
            Assert.That(character.Class.Level, Is.AtLeast(1));
            Assert.That(character.Class.Summary, Is.Not.Empty);
            Assert.That(character.Class.Name, Is.Not.Empty.And.AnyOf(expectedClassNames));
            Assert.That(character.Race.Summary, Is.Not.Empty);
        }

        [TestCase(CharacterClassConstants.Barbarian)]
        [TestCase(CharacterClassConstants.Bard)]
        [TestCase(CharacterClassConstants.Cleric)]
        [TestCase(CharacterClassConstants.Druid)]
        [TestCase(CharacterClassConstants.Fighter)]
        [TestCase(CharacterClassConstants.Monk)]
        [TestCase(CharacterClassConstants.Paladin)]
        [TestCase(CharacterClassConstants.Ranger)]
        [TestCase(CharacterClassConstants.Rogue)]
        [TestCase(CharacterClassConstants.Sorcerer)]
        [TestCase(CharacterClassConstants.Wizard)]
        [TestCase(CharacterClassConstants.Adept)]
        [TestCase(CharacterClassConstants.Aristocrat)]
        [TestCase(CharacterClassConstants.Commoner)]
        [TestCase(CharacterClassConstants.Expert)]
        [TestCase(CharacterClassConstants.Warrior)]
        public async Task GenerateCharacter_ReturnsCharacter_SetClassName(string className)
        {
            var request = RequestHelper.BuildRequest($"?classNameRandomizerType=Set&setClassName={HttpUtility.UrlEncode(className)}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Character>());

            var character = okResult.Value as Character;
            Assert.That(character, Is.Not.Null);
            Assert.That(character.Summary, Is.Not.Empty);
            Assert.That(character.Alignment.Full, Is.Not.Empty);
            Assert.That(character.Class.Level, Is.AtLeast(1));
            Assert.That(character.Class.Summary, Is.Not.Empty);
            Assert.That(character.Class.Name, Is.EqualTo(className));
            Assert.That(character.Race.Summary, Is.Not.Empty);
        }

        [TestCase(LevelRandomizerTypeConstants.Any,
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20)]
        [TestCase(LevelRandomizerTypeConstants.Low,
            1, 2, 3, 4, 5)]
        [TestCase(LevelRandomizerTypeConstants.Medium,
            6, 7, 8, 9, 10)]
        [TestCase(LevelRandomizerTypeConstants.High,
            11, 12, 13, 14, 15)]
        [TestCase(LevelRandomizerTypeConstants.VeryHigh,
            16, 17, 18, 19, 20)]
        public async Task GenerateCharacter_ReturnsCharacter_LevelRandomizers(string levelRandomizerType, params int[] expectedLevels)
        {
            var request = RequestHelper.BuildRequest($"?levelRandomizerType={HttpUtility.UrlEncode(levelRandomizerType)}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Character>());

            var character = okResult.Value as Character;
            Assert.That(character, Is.Not.Null);
            Assert.That(character.Summary, Is.Not.Empty);
            Assert.That(character.Alignment.Full, Is.Not.Empty);
            Assert.That(character.Class.Level, Is.AtLeast(1).And.AnyOf(expectedLevels));
            Assert.That(character.Class.Summary, Is.Not.Empty);
            Assert.That(character.Race.Summary, Is.Not.Empty);
        }

        [TestCase(1)]
        [TestCase(2)]
        [TestCase(3)]
        [TestCase(4)]
        [TestCase(5)]
        [TestCase(6)]
        [TestCase(7)]
        [TestCase(8)]
        [TestCase(9)]
        [TestCase(10)]
        [TestCase(11)]
        [TestCase(12)]
        [TestCase(13)]
        [TestCase(14)]
        [TestCase(15)]
        [TestCase(16)]
        [TestCase(17)]
        [TestCase(18)]
        [TestCase(19)]
        [TestCase(20)]
        public async Task GenerateCharacter_ReturnsCharacter_SetLevel(int level)
        {
            var request = RequestHelper.BuildRequest($"?levelRandomizerType=Set&setLevel={level}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Character>());

            var character = okResult.Value as Character;
            Assert.That(character, Is.Not.Null);
            Assert.That(character.Summary, Is.Not.Empty);
            Assert.That(character.Alignment.Full, Is.Not.Empty);
            Assert.That(character.Class.Level, Is.AtLeast(1).And.EqualTo(level));
            Assert.That(character.Class.Summary, Is.Not.Empty);
            Assert.That(character.Race.Summary, Is.Not.Empty);
        }

        [TestCase(RaceRandomizerTypeConstants.BaseRace.AnyBase,
            RaceConstants.BaseRaces.Aasimar,
            RaceConstants.BaseRaces.AquaticElf,
            RaceConstants.BaseRaces.Azer,
            RaceConstants.BaseRaces.BlueSlaad,
            RaceConstants.BaseRaces.Bugbear,
            RaceConstants.BaseRaces.Centaur,
            RaceConstants.BaseRaces.CloudGiant,
            RaceConstants.BaseRaces.DeathSlaad,
            RaceConstants.BaseRaces.DeepDwarf,
            RaceConstants.BaseRaces.DeepHalfling,
            RaceConstants.BaseRaces.Derro,
            RaceConstants.BaseRaces.Doppelganger,
            RaceConstants.BaseRaces.Drow,
            RaceConstants.BaseRaces.DuergarDwarf,
            RaceConstants.BaseRaces.FireGiant,
            RaceConstants.BaseRaces.ForestGnome,
            RaceConstants.BaseRaces.FrostGiant,
            RaceConstants.BaseRaces.Gargoyle,
            RaceConstants.BaseRaces.Githyanki,
            RaceConstants.BaseRaces.Githzerai,
            RaceConstants.BaseRaces.Gnoll,
            RaceConstants.BaseRaces.Goblin,
            RaceConstants.BaseRaces.GrayElf,
            RaceConstants.BaseRaces.GraySlaad,
            RaceConstants.BaseRaces.GreenSlaad,
            RaceConstants.BaseRaces.Grimlock,
            RaceConstants.BaseRaces.HalfElf,
            RaceConstants.BaseRaces.HalfOrc,
            RaceConstants.BaseRaces.Harpy,
            RaceConstants.BaseRaces.HighElf,
            RaceConstants.BaseRaces.HillDwarf,
            RaceConstants.BaseRaces.HillGiant,
            RaceConstants.BaseRaces.Hobgoblin,
            RaceConstants.BaseRaces.HoundArchon,
            RaceConstants.BaseRaces.Human,
            RaceConstants.BaseRaces.Janni,
            RaceConstants.BaseRaces.Kapoacinth,
            RaceConstants.BaseRaces.Kobold,
            RaceConstants.BaseRaces.KuoToa,
            RaceConstants.BaseRaces.LightfootHalfling,
            RaceConstants.BaseRaces.Lizardfolk,
            RaceConstants.BaseRaces.Locathah,
            RaceConstants.BaseRaces.Merfolk,
            RaceConstants.BaseRaces.Merrow,
            RaceConstants.BaseRaces.MindFlayer,
            RaceConstants.BaseRaces.Minotaur,
            RaceConstants.BaseRaces.MountainDwarf,
            RaceConstants.BaseRaces.Ogre,
            RaceConstants.BaseRaces.OgreMage,
            RaceConstants.BaseRaces.Orc,
            RaceConstants.BaseRaces.Pixie,
            RaceConstants.BaseRaces.Rakshasa,
            RaceConstants.BaseRaces.RedSlaad,
            RaceConstants.BaseRaces.RockGnome,
            RaceConstants.BaseRaces.Sahuagin,
            RaceConstants.BaseRaces.Satyr,
            RaceConstants.BaseRaces.Scorpionfolk,
            RaceConstants.BaseRaces.Scrag,
            RaceConstants.BaseRaces.StoneGiant,
            RaceConstants.BaseRaces.StormGiant,
            RaceConstants.BaseRaces.Svirfneblin,
            RaceConstants.BaseRaces.TallfellowHalfling,
            RaceConstants.BaseRaces.Tiefling,
            RaceConstants.BaseRaces.Troglodyte,
            RaceConstants.BaseRaces.Troll,
            RaceConstants.BaseRaces.WildElf,
            RaceConstants.BaseRaces.WoodElf,
            RaceConstants.BaseRaces.YuanTiAbomination,
            RaceConstants.BaseRaces.YuanTiHalfblood,
            RaceConstants.BaseRaces.YuanTiPureblood)]
        [TestCase(RaceRandomizerTypeConstants.BaseRace.AquaticBase,
            RaceConstants.BaseRaces.AquaticElf,
            RaceConstants.BaseRaces.Kapoacinth,
            RaceConstants.BaseRaces.KuoToa,
            RaceConstants.BaseRaces.Locathah,
            RaceConstants.BaseRaces.Merfolk,
            RaceConstants.BaseRaces.Merrow,
            RaceConstants.BaseRaces.Sahuagin,
            RaceConstants.BaseRaces.Scrag)]
        [TestCase(RaceRandomizerTypeConstants.BaseRace.MonsterBase,
            RaceConstants.BaseRaces.Azer,
            RaceConstants.BaseRaces.BlueSlaad,
            RaceConstants.BaseRaces.Bugbear,
            RaceConstants.BaseRaces.Centaur,
            RaceConstants.BaseRaces.CloudGiant,
            RaceConstants.BaseRaces.DeathSlaad,
            RaceConstants.BaseRaces.Derro,
            RaceConstants.BaseRaces.Doppelganger,
            RaceConstants.BaseRaces.FireGiant,
            RaceConstants.BaseRaces.FrostGiant,
            RaceConstants.BaseRaces.Gargoyle,
            RaceConstants.BaseRaces.Githyanki,
            RaceConstants.BaseRaces.Githzerai,
            RaceConstants.BaseRaces.Gnoll,
            RaceConstants.BaseRaces.Goblin,
            RaceConstants.BaseRaces.GraySlaad,
            RaceConstants.BaseRaces.GreenSlaad,
            RaceConstants.BaseRaces.Grimlock,
            RaceConstants.BaseRaces.Harpy,
            RaceConstants.BaseRaces.HillGiant,
            RaceConstants.BaseRaces.Hobgoblin,
            RaceConstants.BaseRaces.HoundArchon,
            RaceConstants.BaseRaces.Janni,
            RaceConstants.BaseRaces.Kapoacinth,
            RaceConstants.BaseRaces.Kobold,
            RaceConstants.BaseRaces.KuoToa,
            RaceConstants.BaseRaces.Lizardfolk,
            RaceConstants.BaseRaces.Locathah,
            RaceConstants.BaseRaces.Merfolk,
            RaceConstants.BaseRaces.Merrow,
            RaceConstants.BaseRaces.MindFlayer,
            RaceConstants.BaseRaces.Minotaur,
            RaceConstants.BaseRaces.Ogre,
            RaceConstants.BaseRaces.OgreMage,
            RaceConstants.BaseRaces.Orc,
            RaceConstants.BaseRaces.Pixie,
            RaceConstants.BaseRaces.Rakshasa,
            RaceConstants.BaseRaces.RedSlaad,
            RaceConstants.BaseRaces.Sahuagin,
            RaceConstants.BaseRaces.Satyr,
            RaceConstants.BaseRaces.Scorpionfolk,
            RaceConstants.BaseRaces.Scrag,
            RaceConstants.BaseRaces.StoneGiant,
            RaceConstants.BaseRaces.StormGiant,
            RaceConstants.BaseRaces.Troglodyte,
            RaceConstants.BaseRaces.Troll,
            RaceConstants.BaseRaces.YuanTiAbomination,
            RaceConstants.BaseRaces.YuanTiHalfblood,
            RaceConstants.BaseRaces.YuanTiPureblood)]
        [TestCase(RaceRandomizerTypeConstants.BaseRace.NonMonsterBase,
            RaceConstants.BaseRaces.Aasimar,
            RaceConstants.BaseRaces.AquaticElf,
            RaceConstants.BaseRaces.DeepDwarf,
            RaceConstants.BaseRaces.DeepHalfling,
            RaceConstants.BaseRaces.Derro,
            RaceConstants.BaseRaces.Drow,
            RaceConstants.BaseRaces.DuergarDwarf,
            RaceConstants.BaseRaces.ForestGnome,
            RaceConstants.BaseRaces.GrayElf,
            RaceConstants.BaseRaces.HalfElf,
            RaceConstants.BaseRaces.HalfOrc,
            RaceConstants.BaseRaces.HighElf,
            RaceConstants.BaseRaces.HillDwarf,
            RaceConstants.BaseRaces.Human,
            RaceConstants.BaseRaces.LightfootHalfling,
            RaceConstants.BaseRaces.MountainDwarf,
            RaceConstants.BaseRaces.RockGnome,
            RaceConstants.BaseRaces.Svirfneblin,
            RaceConstants.BaseRaces.TallfellowHalfling,
            RaceConstants.BaseRaces.Tiefling,
            RaceConstants.BaseRaces.WildElf,
            RaceConstants.BaseRaces.WoodElf)]
        [TestCase(RaceRandomizerTypeConstants.BaseRace.NonStandardBase,
            RaceConstants.BaseRaces.Aasimar,
            RaceConstants.BaseRaces.AquaticElf,
            RaceConstants.BaseRaces.Azer,
            RaceConstants.BaseRaces.BlueSlaad,
            RaceConstants.BaseRaces.Bugbear,
            RaceConstants.BaseRaces.Centaur,
            RaceConstants.BaseRaces.CloudGiant,
            RaceConstants.BaseRaces.DeathSlaad,
            RaceConstants.BaseRaces.DeepDwarf,
            RaceConstants.BaseRaces.DeepHalfling,
            RaceConstants.BaseRaces.Derro,
            RaceConstants.BaseRaces.Doppelganger,
            RaceConstants.BaseRaces.Drow,
            RaceConstants.BaseRaces.DuergarDwarf,
            RaceConstants.BaseRaces.FireGiant,
            RaceConstants.BaseRaces.ForestGnome,
            RaceConstants.BaseRaces.FrostGiant,
            RaceConstants.BaseRaces.Gargoyle,
            RaceConstants.BaseRaces.Githyanki,
            RaceConstants.BaseRaces.Githzerai,
            RaceConstants.BaseRaces.Gnoll,
            RaceConstants.BaseRaces.Goblin,
            RaceConstants.BaseRaces.GrayElf,
            RaceConstants.BaseRaces.GraySlaad,
            RaceConstants.BaseRaces.GreenSlaad,
            RaceConstants.BaseRaces.Grimlock,
            RaceConstants.BaseRaces.Harpy,
            RaceConstants.BaseRaces.HillGiant,
            RaceConstants.BaseRaces.Hobgoblin,
            RaceConstants.BaseRaces.HoundArchon,
            RaceConstants.BaseRaces.Janni,
            RaceConstants.BaseRaces.Kapoacinth,
            RaceConstants.BaseRaces.Kobold,
            RaceConstants.BaseRaces.KuoToa,
            RaceConstants.BaseRaces.Lizardfolk,
            RaceConstants.BaseRaces.Locathah,
            RaceConstants.BaseRaces.Merfolk,
            RaceConstants.BaseRaces.Merrow,
            RaceConstants.BaseRaces.MindFlayer,
            RaceConstants.BaseRaces.Minotaur,
            RaceConstants.BaseRaces.MountainDwarf,
            RaceConstants.BaseRaces.Ogre,
            RaceConstants.BaseRaces.OgreMage,
            RaceConstants.BaseRaces.Orc,
            RaceConstants.BaseRaces.Pixie,
            RaceConstants.BaseRaces.Rakshasa,
            RaceConstants.BaseRaces.RedSlaad,
            RaceConstants.BaseRaces.Sahuagin,
            RaceConstants.BaseRaces.Satyr,
            RaceConstants.BaseRaces.Scorpionfolk,
            RaceConstants.BaseRaces.Scrag,
            RaceConstants.BaseRaces.StoneGiant,
            RaceConstants.BaseRaces.StormGiant,
            RaceConstants.BaseRaces.Svirfneblin,
            RaceConstants.BaseRaces.TallfellowHalfling,
            RaceConstants.BaseRaces.Tiefling,
            RaceConstants.BaseRaces.Troglodyte,
            RaceConstants.BaseRaces.Troll,
            RaceConstants.BaseRaces.WildElf,
            RaceConstants.BaseRaces.WoodElf,
            RaceConstants.BaseRaces.YuanTiAbomination,
            RaceConstants.BaseRaces.YuanTiHalfblood,
            RaceConstants.BaseRaces.YuanTiPureblood)]
        [TestCase(RaceRandomizerTypeConstants.BaseRace.StandardBase,
            RaceConstants.BaseRaces.HalfElf,
            RaceConstants.BaseRaces.HalfOrc,
            RaceConstants.BaseRaces.HighElf,
            RaceConstants.BaseRaces.HillDwarf,
            RaceConstants.BaseRaces.Human,
            RaceConstants.BaseRaces.LightfootHalfling,
            RaceConstants.BaseRaces.RockGnome)]
        public async Task GenerateCharacter_ReturnsCharacter_BaseRaceRandomizers(string baseRaceRandomizerType, params string[] expectedBaseRaces)
        {
            var request = RequestHelper.BuildRequest($"?baseRaceRandomizerType={HttpUtility.UrlEncode(baseRaceRandomizerType)}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Character>());

            var character = okResult.Value as Character;
            Assert.That(character, Is.Not.Null);
            Assert.That(character.Summary, Is.Not.Empty);
            Assert.That(character.Alignment.Full, Is.Not.Empty);
            Assert.That(character.Class.Level, Is.AtLeast(1));
            Assert.That(character.Class.Summary, Is.Not.Empty);
            Assert.That(character.Race.Summary, Is.Not.Empty);
            Assert.That(character.Race.BaseRace, Is.AnyOf(expectedBaseRaces));
        }

        [TestCase(RaceConstants.BaseRaces.Aasimar)]
        [TestCase(RaceConstants.BaseRaces.AquaticElf)]
        [TestCase(RaceConstants.BaseRaces.Azer)]
        [TestCase(RaceConstants.BaseRaces.BlueSlaad)]
        [TestCase(RaceConstants.BaseRaces.Bugbear)]
        [TestCase(RaceConstants.BaseRaces.Centaur)]
        [TestCase(RaceConstants.BaseRaces.CloudGiant)]
        [TestCase(RaceConstants.BaseRaces.DeathSlaad)]
        [TestCase(RaceConstants.BaseRaces.DeepDwarf)]
        [TestCase(RaceConstants.BaseRaces.DeepHalfling)]
        [TestCase(RaceConstants.BaseRaces.Derro)]
        [TestCase(RaceConstants.BaseRaces.Doppelganger)]
        [TestCase(RaceConstants.BaseRaces.Drow)]
        [TestCase(RaceConstants.BaseRaces.DuergarDwarf)]
        [TestCase(RaceConstants.BaseRaces.FireGiant)]
        [TestCase(RaceConstants.BaseRaces.ForestGnome)]
        [TestCase(RaceConstants.BaseRaces.FrostGiant)]
        [TestCase(RaceConstants.BaseRaces.Gargoyle)]
        [TestCase(RaceConstants.BaseRaces.Githyanki)]
        [TestCase(RaceConstants.BaseRaces.Githzerai)]
        [TestCase(RaceConstants.BaseRaces.Gnoll)]
        [TestCase(RaceConstants.BaseRaces.Goblin)]
        [TestCase(RaceConstants.BaseRaces.GrayElf)]
        [TestCase(RaceConstants.BaseRaces.GraySlaad)]
        [TestCase(RaceConstants.BaseRaces.GreenSlaad)]
        [TestCase(RaceConstants.BaseRaces.Grimlock)]
        [TestCase(RaceConstants.BaseRaces.HalfElf)]
        [TestCase(RaceConstants.BaseRaces.HalfOrc)]
        [TestCase(RaceConstants.BaseRaces.Harpy)]
        [TestCase(RaceConstants.BaseRaces.HighElf)]
        [TestCase(RaceConstants.BaseRaces.HillDwarf)]
        [TestCase(RaceConstants.BaseRaces.HillGiant)]
        [TestCase(RaceConstants.BaseRaces.Hobgoblin)]
        [TestCase(RaceConstants.BaseRaces.HoundArchon)]
        [TestCase(RaceConstants.BaseRaces.Human)]
        [TestCase(RaceConstants.BaseRaces.Janni)]
        [TestCase(RaceConstants.BaseRaces.Kapoacinth)]
        [TestCase(RaceConstants.BaseRaces.Kobold)]
        [TestCase(RaceConstants.BaseRaces.KuoToa)]
        [TestCase(RaceConstants.BaseRaces.LightfootHalfling)]
        [TestCase(RaceConstants.BaseRaces.Lizardfolk)]
        [TestCase(RaceConstants.BaseRaces.Locathah)]
        [TestCase(RaceConstants.BaseRaces.Merfolk)]
        [TestCase(RaceConstants.BaseRaces.Merrow)]
        [TestCase(RaceConstants.BaseRaces.MindFlayer)]
        [TestCase(RaceConstants.BaseRaces.Minotaur)]
        [TestCase(RaceConstants.BaseRaces.MountainDwarf)]
        [TestCase(RaceConstants.BaseRaces.Ogre)]
        [TestCase(RaceConstants.BaseRaces.OgreMage)]
        [TestCase(RaceConstants.BaseRaces.Orc)]
        [TestCase(RaceConstants.BaseRaces.Pixie)]
        [TestCase(RaceConstants.BaseRaces.Rakshasa)]
        [TestCase(RaceConstants.BaseRaces.RedSlaad)]
        [TestCase(RaceConstants.BaseRaces.RockGnome)]
        [TestCase(RaceConstants.BaseRaces.Sahuagin)]
        [TestCase(RaceConstants.BaseRaces.Satyr)]
        [TestCase(RaceConstants.BaseRaces.Scorpionfolk)]
        [TestCase(RaceConstants.BaseRaces.Scrag)]
        [TestCase(RaceConstants.BaseRaces.StoneGiant)]
        [TestCase(RaceConstants.BaseRaces.StormGiant)]
        [TestCase(RaceConstants.BaseRaces.Svirfneblin)]
        [TestCase(RaceConstants.BaseRaces.TallfellowHalfling)]
        [TestCase(RaceConstants.BaseRaces.Tiefling)]
        [TestCase(RaceConstants.BaseRaces.Troglodyte)]
        [TestCase(RaceConstants.BaseRaces.Troll)]
        [TestCase(RaceConstants.BaseRaces.WildElf)]
        [TestCase(RaceConstants.BaseRaces.WoodElf)]
        [TestCase(RaceConstants.BaseRaces.YuanTiAbomination)]
        [TestCase(RaceConstants.BaseRaces.YuanTiHalfblood)]
        [TestCase(RaceConstants.BaseRaces.YuanTiPureblood)]
        public async Task GenerateCharacter_ReturnsCharacter_SetBaseRace(string baseRace)
        {
            var request = RequestHelper.BuildRequest($"?baseRaceRandomizerType=Set&setBaseRace={HttpUtility.UrlEncode(baseRace)}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Character>());

            var character = okResult.Value as Character;
            Assert.That(character, Is.Not.Null);
            Assert.That(character.Summary, Is.Not.Empty);
            Assert.That(character.Alignment.Full, Is.Not.Empty);
            Assert.That(character.Class.Level, Is.AtLeast(1));
            Assert.That(character.Class.Summary, Is.Not.Empty);
            Assert.That(character.Race.Summary, Is.Not.Empty);
            Assert.That(character.Race.BaseRace, Is.EqualTo(baseRace));
        }

        [TestCase(RaceRandomizerTypeConstants.Metarace.AnyMeta, true,
            RaceConstants.Metaraces.Ghost,
            RaceConstants.Metaraces.HalfCelestial,
            RaceConstants.Metaraces.HalfDragon,
            RaceConstants.Metaraces.HalfFiend,
            RaceConstants.Metaraces.Lich,
            RaceConstants.Metaraces.Mummy,
            RaceConstants.Metaraces.Vampire,
            RaceConstants.Metaraces.Werebear,
            RaceConstants.Metaraces.Wereboar,
            RaceConstants.Metaraces.Wererat,
            RaceConstants.Metaraces.Weretiger,
            RaceConstants.Metaraces.Werewolf)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.AnyMeta, false,
            RaceConstants.Metaraces.None,
            RaceConstants.Metaraces.Ghost,
            RaceConstants.Metaraces.HalfCelestial,
            RaceConstants.Metaraces.HalfDragon,
            RaceConstants.Metaraces.HalfFiend,
            RaceConstants.Metaraces.Lich,
            RaceConstants.Metaraces.Mummy,
            RaceConstants.Metaraces.Vampire,
            RaceConstants.Metaraces.Werebear,
            RaceConstants.Metaraces.Wereboar,
            RaceConstants.Metaraces.Wererat,
            RaceConstants.Metaraces.Weretiger,
            RaceConstants.Metaraces.Werewolf)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.GeneticMeta, true,
            RaceConstants.Metaraces.HalfCelestial,
            RaceConstants.Metaraces.HalfDragon,
            RaceConstants.Metaraces.HalfFiend)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.GeneticMeta, false,
            RaceConstants.Metaraces.None,
            RaceConstants.Metaraces.HalfCelestial,
            RaceConstants.Metaraces.HalfDragon,
            RaceConstants.Metaraces.HalfFiend)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.LycanthropeMeta, true,
            RaceConstants.Metaraces.Werebear,
            RaceConstants.Metaraces.Wereboar,
            RaceConstants.Metaraces.Wererat,
            RaceConstants.Metaraces.Weretiger,
            RaceConstants.Metaraces.Werewolf)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.LycanthropeMeta, false,
            RaceConstants.Metaraces.None,
            RaceConstants.Metaraces.Werebear,
            RaceConstants.Metaraces.Wereboar,
            RaceConstants.Metaraces.Wererat,
            RaceConstants.Metaraces.Weretiger,
            RaceConstants.Metaraces.Werewolf)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.UndeadMeta, true,
            RaceConstants.Metaraces.Ghost,
            RaceConstants.Metaraces.Lich,
            RaceConstants.Metaraces.Mummy,
            RaceConstants.Metaraces.Vampire)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.UndeadMeta, false,
            RaceConstants.Metaraces.None,
            RaceConstants.Metaraces.Ghost,
            RaceConstants.Metaraces.Lich,
            RaceConstants.Metaraces.Mummy,
            RaceConstants.Metaraces.Vampire)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.NoMeta, false,
            RaceConstants.Metaraces.None)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.NoMeta, true,
            RaceConstants.Metaraces.None)]
        public async Task GenerateCharacter_ReturnsCharacter_MetaraceRandomizers(string metaraceRandomizerType, bool force, params string[] expectedMetaraces)
        {
            var request = RequestHelper.BuildRequest($"?metaraceRandomizerType={HttpUtility.UrlEncode(metaraceRandomizerType)}&forceMetarace={force}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Character>());

            var character = okResult.Value as Character;
            Assert.That(character, Is.Not.Null);
            Assert.That(character.Summary, Is.Not.Empty);
            Assert.That(character.Alignment.Full, Is.Not.Empty);
            Assert.That(character.Class.Level, Is.AtLeast(1));
            Assert.That(character.Class.Summary, Is.Not.Empty);
            Assert.That(character.Race.Summary, Is.Not.Empty);
            Assert.That(character.Race.Metarace, Is.AnyOf(expectedMetaraces));
        }

        [TestCase(RaceConstants.Metaraces.None)]
        [TestCase(RaceConstants.Metaraces.Ghost)]
        [TestCase(RaceConstants.Metaraces.HalfCelestial)]
        [TestCase(RaceConstants.Metaraces.HalfDragon)]
        [TestCase(RaceConstants.Metaraces.HalfFiend)]
        [TestCase(RaceConstants.Metaraces.Lich)]
        [TestCase(RaceConstants.Metaraces.Mummy)]
        [TestCase(RaceConstants.Metaraces.Vampire)]
        [TestCase(RaceConstants.Metaraces.Werebear)]
        [TestCase(RaceConstants.Metaraces.Wereboar)]
        [TestCase(RaceConstants.Metaraces.Wererat)]
        [TestCase(RaceConstants.Metaraces.Weretiger)]
        [TestCase(RaceConstants.Metaraces.Werewolf)]
        public async Task GenerateCharacter_ReturnsCharacter_SetMetarace(string metarace)
        {
            var request = RequestHelper.BuildRequest($"?metaraceRandomizerType=Set&setMetarace={HttpUtility.UrlEncode(metarace)}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Character>());

            var character = okResult.Value as Character;
            Assert.That(character, Is.Not.Null);
            Assert.That(character.Summary, Is.Not.Empty);
            Assert.That(character.Alignment.Full, Is.Not.Empty);
            Assert.That(character.Class.Level, Is.AtLeast(1));
            Assert.That(character.Class.Summary, Is.Not.Empty);
            Assert.That(character.Race.Summary, Is.Not.Empty);
            Assert.That(character.Race.Metarace, Is.EqualTo(metarace));
        }

        [TestCase(RaceRandomizerTypeConstants.Metarace.AnyMeta, true,
            RaceConstants.Metaraces.Ghost,
            RaceConstants.Metaraces.HalfCelestial,
            RaceConstants.Metaraces.HalfDragon,
            RaceConstants.Metaraces.HalfFiend,
            RaceConstants.Metaraces.Lich,
            RaceConstants.Metaraces.Mummy,
            RaceConstants.Metaraces.Vampire,
            RaceConstants.Metaraces.Werebear,
            RaceConstants.Metaraces.Wereboar,
            RaceConstants.Metaraces.Wererat,
            RaceConstants.Metaraces.Weretiger,
            RaceConstants.Metaraces.Werewolf)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.AnyMeta, false,
            RaceConstants.Metaraces.None,
            RaceConstants.Metaraces.Ghost,
            RaceConstants.Metaraces.HalfCelestial,
            RaceConstants.Metaraces.HalfDragon,
            RaceConstants.Metaraces.HalfFiend,
            RaceConstants.Metaraces.Lich,
            RaceConstants.Metaraces.Mummy,
            RaceConstants.Metaraces.Vampire,
            RaceConstants.Metaraces.Werebear,
            RaceConstants.Metaraces.Wereboar,
            RaceConstants.Metaraces.Wererat,
            RaceConstants.Metaraces.Weretiger,
            RaceConstants.Metaraces.Werewolf)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.GeneticMeta, true,
            RaceConstants.Metaraces.HalfCelestial,
            RaceConstants.Metaraces.HalfDragon,
            RaceConstants.Metaraces.HalfFiend)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.GeneticMeta, false,
            RaceConstants.Metaraces.None,
            RaceConstants.Metaraces.HalfCelestial,
            RaceConstants.Metaraces.HalfDragon,
            RaceConstants.Metaraces.HalfFiend)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.LycanthropeMeta, true,
            RaceConstants.Metaraces.Werebear,
            RaceConstants.Metaraces.Wereboar,
            RaceConstants.Metaraces.Wererat,
            RaceConstants.Metaraces.Weretiger,
            RaceConstants.Metaraces.Werewolf)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.LycanthropeMeta, false,
            RaceConstants.Metaraces.None,
            RaceConstants.Metaraces.Werebear,
            RaceConstants.Metaraces.Wereboar,
            RaceConstants.Metaraces.Wererat,
            RaceConstants.Metaraces.Weretiger,
            RaceConstants.Metaraces.Werewolf)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.UndeadMeta, true,
            RaceConstants.Metaraces.Ghost,
            RaceConstants.Metaraces.Lich,
            RaceConstants.Metaraces.Mummy,
            RaceConstants.Metaraces.Vampire)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.UndeadMeta, false,
            RaceConstants.Metaraces.None,
            RaceConstants.Metaraces.Ghost,
            RaceConstants.Metaraces.Lich,
            RaceConstants.Metaraces.Mummy,
            RaceConstants.Metaraces.Vampire)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.NoMeta, false,
            RaceConstants.Metaraces.None)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.NoMeta, true,
            RaceConstants.Metaraces.None)]
        public async Task GenerateCharacter_ReturnsCharacter_AbilitiesRandomizers(string abilitiesRandomizerType, params int[] expectedAbilities)
        {
            var queryString = $"?abilitiesRandomizerType={HttpUtility.UrlEncode(abilitiesRandomizerType)}";
            queryString += "&levelRandomizerType=Set&setLevel=1";
            queryString += "&baseRaceRandomizerType=Set&setBaseRace=Human";
            queryString += $"&metaraceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.Metarace.NoMeta)}";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Character>());

            var character = okResult.Value as Character;
            Assert.That(character, Is.Not.Null);
            Assert.That(character.Summary, Is.Not.Empty);
            Assert.That(character.Alignment.Full, Is.Not.Empty);
            Assert.That(character.Class.Level, Is.AtLeast(1));
            Assert.That(character.Class.Summary, Is.Not.Empty);
            Assert.That(character.Race.Summary, Is.Not.Empty);
            Assert.That(character.Abilities, Has.Count.EqualTo(6)
                .And.ContainKey(AbilityConstants.Strength)
                .And.ContainKey(AbilityConstants.Constitution)
                .And.ContainKey(AbilityConstants.Dexterity)
                .And.ContainKey(AbilityConstants.Intelligence)
                .And.ContainKey(AbilityConstants.Wisdom)
                .And.ContainKey(AbilityConstants.Charisma));
            Assert.That(character.Abilities[AbilityConstants.Strength], Is.AnyOf(expectedAbilities));
            Assert.That(character.Abilities[AbilityConstants.Constitution], Is.AnyOf(expectedAbilities));
            Assert.That(character.Abilities[AbilityConstants.Dexterity], Is.AnyOf(expectedAbilities));
            Assert.That(character.Abilities[AbilityConstants.Intelligence], Is.AnyOf(expectedAbilities));
            Assert.That(character.Abilities[AbilityConstants.Wisdom], Is.AnyOf(expectedAbilities));
            Assert.That(character.Abilities[AbilityConstants.Charisma], Is.AnyOf(expectedAbilities));
        }

        [Test]
        public async Task GenerateCharacter_ReturnsCharacter_SetAbilities()
        {
            var queryString = $"?abilitiesRandomizerType=Set&setMetarace={HttpUtility.UrlEncode(metarace)}";
            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Character>());

            var character = okResult.Value as Character;
            Assert.That(character, Is.Not.Null);
            Assert.That(character.Summary, Is.Not.Empty);
            Assert.That(character.Alignment.Full, Is.Not.Empty);
            Assert.That(character.Class.Level, Is.AtLeast(1));
            Assert.That(character.Class.Summary, Is.Not.Empty);
            Assert.That(character.Race.Summary, Is.Not.Empty);
            Assert.That(character.Race.Metarace, Is.EqualTo(metarace));
        }
    }
}