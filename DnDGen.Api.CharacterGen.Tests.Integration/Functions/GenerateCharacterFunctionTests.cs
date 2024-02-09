using DnDGen.Api.CharacterGen.Dependencies;
using DnDGen.Api.CharacterGen.Functions;
using DnDGen.Api.CharacterGen.Tests.Integration.Helpers;
using DnDGen.CharacterGen.Abilities;
using DnDGen.CharacterGen.Alignments;
using DnDGen.CharacterGen.CharacterClasses;
using DnDGen.CharacterGen.Characters;
using DnDGen.CharacterGen.Races;
using DnDGen.CharacterGen.Randomizers.Abilities;
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

        [Test]
        public async Task GenerateCharacter_ReturnsCharacter_AlignmentRandomizers_CaseInsensitive()
        {
            var request = RequestHelper.BuildRequest($"?alignmentRandomizerType={HttpUtility.UrlEncode(AlignmentRandomizerTypeConstants.Any.ToUpper())}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Character>());

            var character = okResult.Value as Character;
            Assert.That(character, Is.Not.Null);
            Assert.That(character.Summary, Is.Not.Empty);
            Assert.That(character.Alignment.Full, Is.Not.Empty.And.AnyOf(AlignmentConstants.LawfulGood,
                AlignmentConstants.LawfulNeutral,
                AlignmentConstants.LawfulEvil,
                AlignmentConstants.NeutralGood,
                AlignmentConstants.TrueNeutral,
                AlignmentConstants.NeutralEvil,
                AlignmentConstants.ChaoticGood,
                AlignmentConstants.ChaoticNeutral,
                AlignmentConstants.ChaoticEvil));
            Assert.That(character.Class.Level, Is.AtLeast(1));
            Assert.That(character.Class.Summary, Is.Not.Empty);
            Assert.That(character.Race.Summary, Is.Not.Empty);
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_InvalidAlignmentRandomizer()
        {
            var request = RequestHelper.BuildRequest("?alignmentRandomizerType=Invalid");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
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

        [Test]
        public async Task GenerateCharacter_ReturnsCharacter_SetAlignment_CaseInsensitive()
        {
            var request = RequestHelper.BuildRequest($"?alignmentRandomizerType=Set&setAlignment={HttpUtility.UrlEncode(AlignmentConstants.LawfulGood.ToUpper())}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Character>());

            var character = okResult.Value as Character;
            Assert.That(character, Is.Not.Null);
            Assert.That(character.Summary, Is.Not.Empty);
            Assert.That(character.Alignment.Full, Is.EqualTo(AlignmentConstants.LawfulGood));
            Assert.That(character.Class.Level, Is.AtLeast(1));
            Assert.That(character.Class.Summary, Is.Not.Empty);
            Assert.That(character.Race.Summary, Is.Not.Empty);
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_NoSetAlignment()
        {
            var request = RequestHelper.BuildRequest($"?alignmentRandomizerType=Set");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_InvalidSetAlignment()
        {
            var request = RequestHelper.BuildRequest($"?alignmentRandomizerType=Set&setAlignment={HttpUtility.UrlEncode("Invalid Alignment")}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
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

        [Test]
        public async Task GenerateCharacter_ReturnsCharacter_ClassNameRandomizers_CaseInsensitive()
        {
            var request = RequestHelper.BuildRequest($"?classNameRandomizerType={HttpUtility.UrlEncode(ClassNameRandomizerTypeConstants.AnyPlayer.ToUpper())}");
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
            Assert.That(character.Class.Name, Is.Not.Empty.And.AnyOf(CharacterClassConstants.Barbarian,
                CharacterClassConstants.Bard,
                CharacterClassConstants.Cleric,
                CharacterClassConstants.Druid,
                CharacterClassConstants.Fighter,
                CharacterClassConstants.Monk,
                CharacterClassConstants.Paladin,
                CharacterClassConstants.Ranger,
                CharacterClassConstants.Rogue,
                CharacterClassConstants.Sorcerer,
                CharacterClassConstants.Wizard));
            Assert.That(character.Race.Summary, Is.Not.Empty);
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_InvalidClassNameRandomizer()
        {
            var request = RequestHelper.BuildRequest("?classNameRandomizerType=Invalid");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
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

        [Test]
        public async Task GenerateCharacter_ReturnsCharacter_SetClassName_CaseInsensitive()
        {
            var request = RequestHelper.BuildRequest($"?classNameRandomizerType=Set&setClassName={HttpUtility.UrlEncode(CharacterClassConstants.Druid.ToUpper())}");
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
            Assert.That(character.Class.Name, Is.EqualTo(CharacterClassConstants.Druid));
            Assert.That(character.Race.Summary, Is.Not.Empty);
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_NoSetClassName()
        {
            var request = RequestHelper.BuildRequest($"?classNameRandomizerType=Set");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_InvalidSetClassName()
        {
            var request = RequestHelper.BuildRequest($"?classNameRandomizerType=Set&setClassName=Invalid");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
        }

        [TestCase(LevelRandomizerTypeConstants.Any, 1, 20)]
        [TestCase(LevelRandomizerTypeConstants.Low, 1, 5)]
        [TestCase(LevelRandomizerTypeConstants.Medium, 6, 10)]
        [TestCase(LevelRandomizerTypeConstants.High, 11, 15)]
        [TestCase(LevelRandomizerTypeConstants.VeryHigh, 16, 20)]
        public async Task GenerateCharacter_ReturnsCharacter_LevelRandomizers(string levelRandomizerType, int min, int max)
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
            Assert.That(character.Class.Level, Is.AtLeast(1).And.InRange(min, max));
            Assert.That(character.Class.Summary, Is.Not.Empty);
            Assert.That(character.Race.Summary, Is.Not.Empty);
        }

        [Test]
        public async Task GenerateCharacter_ReturnsCharacter_LevelRandomizers_CaseInsensitive()
        {
            var request = RequestHelper.BuildRequest($"?levelRandomizerType={HttpUtility.UrlEncode(LevelRandomizerTypeConstants.Any.ToUpper())}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Character>());

            var character = okResult.Value as Character;
            Assert.That(character, Is.Not.Null);
            Assert.That(character.Summary, Is.Not.Empty);
            Assert.That(character.Alignment.Full, Is.Not.Empty);
            Assert.That(character.Class.Level, Is.AtLeast(1).And.InRange(1, 20));
            Assert.That(character.Class.Summary, Is.Not.Empty);
            Assert.That(character.Race.Summary, Is.Not.Empty);
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_InvalidLevelRandomizer()
        {
            var request = RequestHelper.BuildRequest("?levelRandomizerType=Invalid");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
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

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_NoSetLevel()
        {
            var request = RequestHelper.BuildRequest($"?levelRandomizerType=Set");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
        }

        [TestCase(-2)]
        [TestCase(-1)]
        [TestCase(0)]
        [TestCase(21)]
        [TestCase(22)]
        public async Task GenerateCharacter_ReturnsBadRequest_InvalidSetLevel(int invalidLevel)
        {
            var request = RequestHelper.BuildRequest($"?levelRandomizerType=Set&setLevel={invalidLevel}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
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

        [Test]
        public async Task GenerateCharacter_ReturnsCharacter_BaseRaceRandomizers_CaseInsensitive()
        {
            var request = RequestHelper.BuildRequest($"?baseRaceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.BaseRace.StandardBase.ToUpper())}");
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
            Assert.That(character.Race.BaseRace, Is.AnyOf(RaceConstants.BaseRaces.HalfElf,
                RaceConstants.BaseRaces.HalfOrc,
                RaceConstants.BaseRaces.HighElf,
                RaceConstants.BaseRaces.HillDwarf,
                RaceConstants.BaseRaces.Human,
                RaceConstants.BaseRaces.LightfootHalfling,
                RaceConstants.BaseRaces.RockGnome));
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_InvalidBaseRaceRandomizer()
        {
            var request = RequestHelper.BuildRequest("?baseRaceRandomizerType=Invalid");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
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

        [Test]
        public async Task GenerateCharacter_ReturnsCharacter_SetBaseRace_CaseInsensitive()
        {
            var request = RequestHelper.BuildRequest($"?baseRaceRandomizerType=Set&setBaseRace={HttpUtility.UrlEncode(RaceConstants.BaseRaces.Tiefling.ToUpper())}");
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
            Assert.That(character.Race.BaseRace, Is.EqualTo(RaceConstants.BaseRaces.Tiefling));
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_NoSetBaseRace()
        {
            var request = RequestHelper.BuildRequest($"?baseRaceRandomizerType=Set");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_InvalidSetBaseRace()
        {
            var request = RequestHelper.BuildRequest("?baseRaceRandomizerType=Set&setBaseRace=Invalid");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
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

        [Test]
        public async Task GenerateCharacter_ReturnsCharacter_MetaraceRandomizers_CaseInsensitive()
        {
            var request = RequestHelper.BuildRequest($"?metaraceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.Metarace.GeneticMeta.ToUpper())}");
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
            Assert.That(character.Race.Metarace, Is.AnyOf(RaceConstants.Metaraces.None,
                RaceConstants.Metaraces.HalfCelestial,
                RaceConstants.Metaraces.HalfDragon,
                RaceConstants.Metaraces.HalfFiend));
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_InvalidMetaraceRandomizer()
        {
            var request = RequestHelper.BuildRequest("?metaraceRandomizerType=Invalid");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
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

        [Test]
        public async Task GenerateCharacter_ReturnsCharacter_SetMetarace_CaseInsensitive()
        {
            var request = RequestHelper.BuildRequest($"?metaraceRandomizerType=Set&setMetarace={HttpUtility.UrlEncode(RaceConstants.Metaraces.Vampire.ToUpper())}");
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
            Assert.That(character.Race.Metarace, Is.EqualTo(RaceConstants.Metaraces.Vampire));
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_NoSetMetarace()
        {
            var request = RequestHelper.BuildRequest($"?metaraceRandomizerType=Set");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_InvalidSetMetarace()
        {
            var request = RequestHelper.BuildRequest("?metaraceRandomizerType=Set&setMetarace=Invalid");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
        }

        [TestCase(AbilitiesRandomizerTypeConstants.Average, 10, 13)]
        [TestCase(AbilitiesRandomizerTypeConstants.BestOfFour, 3, 18)]
        [TestCase(AbilitiesRandomizerTypeConstants.Good, 13, 16)]
        [TestCase(AbilitiesRandomizerTypeConstants.Heroic, 15, 18)]
        [TestCase(AbilitiesRandomizerTypeConstants.OnesAsSixes, 6, 18)]
        [TestCase(AbilitiesRandomizerTypeConstants.Poor, 3, 9)]
        [TestCase(AbilitiesRandomizerTypeConstants.Raw, 3, 18)]
        [TestCase(AbilitiesRandomizerTypeConstants.TwoTenSidedDice, 2, 20)]
        public async Task GenerateCharacter_ReturnsCharacter_AbilitiesRandomizers(string abilitiesRandomizerType, int min, int max)
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
            Assert.That(character.Abilities[AbilityConstants.Strength].Value, Is.InRange(min, max));
            Assert.That(character.Abilities[AbilityConstants.Constitution].Value, Is.InRange(min, max));
            Assert.That(character.Abilities[AbilityConstants.Dexterity].Value, Is.InRange(min, max));
            Assert.That(character.Abilities[AbilityConstants.Intelligence].Value, Is.InRange(min, max));
            Assert.That(character.Abilities[AbilityConstants.Wisdom].Value, Is.InRange(min, max));
            Assert.That(character.Abilities[AbilityConstants.Charisma].Value, Is.InRange(min, max));
        }

        [Test]
        public async Task GenerateCharacter_ReturnsCharacter_AbilitiesRandomizers_CaseInsensitive()
        {
            var queryString = $"?abilitiesRandomizerType={HttpUtility.UrlEncode(AbilitiesRandomizerTypeConstants.OnesAsSixes.ToUpper())}";
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
            Assert.That(character.Abilities[AbilityConstants.Strength].Value, Is.InRange(6, 18));
            Assert.That(character.Abilities[AbilityConstants.Constitution].Value, Is.InRange(6, 18));
            Assert.That(character.Abilities[AbilityConstants.Dexterity].Value, Is.InRange(6, 18));
            Assert.That(character.Abilities[AbilityConstants.Intelligence].Value, Is.InRange(6, 18));
            Assert.That(character.Abilities[AbilityConstants.Wisdom].Value, Is.InRange(6, 18));
            Assert.That(character.Abilities[AbilityConstants.Charisma].Value, Is.InRange(6, 18));
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_InvalidAbilitiesRandomizer()
        {
            var request = RequestHelper.BuildRequest("?abilitiesRandomizerType=Invalid");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
        }

        [Test]
        public async Task GenerateCharacter_ReturnsCharacter_SetAbilities()
        {
            var queryString = "?abilitiesRandomizerType=Set";
            queryString += "&levelRandomizerType=Set&setLevel=1";
            queryString += "&baseRaceRandomizerType=Set&setBaseRace=Human";
            queryString += $"&metaraceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.Metarace.NoMeta)}";
            queryString += "&setStrength=9266";
            queryString += "&setConstitution=90210";
            queryString += "&setDexterity=42";
            queryString += "&setIntelligence=600";
            queryString += "&setWisdom=1337";
            queryString += "&setCharisma=1336";

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
            Assert.That(character.Abilities[AbilityConstants.Strength].Value, Is.EqualTo(9266));
            Assert.That(character.Abilities[AbilityConstants.Constitution].Value, Is.EqualTo(90210));
            Assert.That(character.Abilities[AbilityConstants.Dexterity].Value, Is.EqualTo(42));
            Assert.That(character.Abilities[AbilityConstants.Intelligence].Value, Is.EqualTo(600));
            Assert.That(character.Abilities[AbilityConstants.Wisdom].Value, Is.EqualTo(1337));
            Assert.That(character.Abilities[AbilityConstants.Charisma].Value, Is.EqualTo(1336));
        }

        [Test]
        public async Task GenerateCharacter_ReturnsCharacter_SetAbilities_AllowAbilityAdjustments()
        {
            var queryString = "?abilitiesRandomizerType=Set";
            queryString += "&levelRandomizerType=Set&setLevel=20";
            queryString += $"&baseRaceRandomizerType=Set&setBaseRace={HttpUtility.UrlEncode(RaceConstants.BaseRaces.OgreMage)}";
            queryString += $"&metaraceRandomizerType=Set&setMetarace={HttpUtility.UrlEncode(RaceConstants.Metaraces.HalfDragon)}";
            queryString += "&setStrength=9266";
            queryString += "&setConstitution=90210";
            queryString += "&setDexterity=42";
            queryString += "&setIntelligence=600";
            queryString += "&setWisdom=1337";
            queryString += "&setCharisma=96";
            queryString += "&allowAbilityAdjustments=true";

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

            var sigma = 20;
            var abilityValues = character.Abilities.Values.Select(a => a.Value).OrderBy(v => v).ToArray();
            Assert.That(abilityValues[0], Is.EqualTo(42).Within(sigma));
            Assert.That(abilityValues[1], Is.EqualTo(96).Within(sigma));
            Assert.That(abilityValues[2], Is.EqualTo(600).Within(sigma));
            Assert.That(abilityValues[3], Is.EqualTo(1337).Within(sigma));
            Assert.That(abilityValues[4], Is.EqualTo(9266).Within(sigma));
            Assert.That(abilityValues[5], Is.EqualTo(90210).Within(sigma));
        }

        [Test]
        public async Task GenerateCharacter_ReturnsCharacter_SetAbilities_DoNotAllowAbilityAdjustments()
        {
            var queryString = "?abilitiesRandomizerType=Set";
            queryString += "&levelRandomizerType=Set&setLevel=20";
            queryString += $"&baseRaceRandomizerType=Set&setBaseRace={HttpUtility.UrlEncode(RaceConstants.BaseRaces.OgreMage)}";
            queryString += $"&metaraceRandomizerType=Set&setMetarace={HttpUtility.UrlEncode(RaceConstants.Metaraces.HalfDragon)}";
            queryString += "&setStrength=9266";
            queryString += "&setConstitution=90210";
            queryString += "&setDexterity=42";
            queryString += "&setIntelligence=600";
            queryString += "&setWisdom=1337";
            queryString += "&setCharisma=1336";
            queryString += "&allowAbilityAdjustments=false";

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
            Assert.That(character.Abilities[AbilityConstants.Strength].Value, Is.EqualTo(9266));
            Assert.That(character.Abilities[AbilityConstants.Constitution].Value, Is.EqualTo(90210));
            Assert.That(character.Abilities[AbilityConstants.Dexterity].Value, Is.EqualTo(42));
            Assert.That(character.Abilities[AbilityConstants.Intelligence].Value, Is.EqualTo(600));
            Assert.That(character.Abilities[AbilityConstants.Wisdom].Value, Is.EqualTo(1337));
            Assert.That(character.Abilities[AbilityConstants.Charisma].Value, Is.EqualTo(1336));
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_NoSetStrength()
        {
            var queryString = "?abilitiesRandomizerType=Set";
            queryString += "&levelRandomizerType=Set&setLevel=1";
            queryString += "&baseRaceRandomizerType=Set&setBaseRace=Human";
            queryString += $"&metaraceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.Metarace.NoMeta)}";
            //queryString += "&setStrength=9266";
            queryString += "&setConstitution=90210";
            queryString += "&setDexterity=42";
            queryString += "&setIntelligence=600";
            queryString += "&setWisdom=1337";
            queryString += "&setCharisma=1336";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
        }

        [TestCase(-2)]
        [TestCase(-1)]
        [TestCase(0)]
        public async Task GenerateCharacter_ReturnsBadRequest_InvalidSetStrength(int invalidAbility)
        {
            var queryString = "?abilitiesRandomizerType=Set";
            queryString += "&levelRandomizerType=Set&setLevel=1";
            queryString += "&baseRaceRandomizerType=Set&setBaseRace=Human";
            queryString += $"&metaraceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.Metarace.NoMeta)}";
            queryString += $"&setStrength={invalidAbility}";
            queryString += "&setConstitution=90210";
            queryString += "&setDexterity=42";
            queryString += "&setIntelligence=600";
            queryString += "&setWisdom=1337";
            queryString += "&setCharisma=1336";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_NoSetConstitution()
        {
            var queryString = "?abilitiesRandomizerType=Set";
            queryString += "&levelRandomizerType=Set&setLevel=1";
            queryString += "&baseRaceRandomizerType=Set&setBaseRace=Human";
            queryString += $"&metaraceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.Metarace.NoMeta)}";
            queryString += "&setStrength=9266";
            //queryString += "&setConstitution=90210";
            queryString += "&setDexterity=42";
            queryString += "&setIntelligence=600";
            queryString += "&setWisdom=1337";
            queryString += "&setCharisma=1336";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
        }

        [TestCase(-2)]
        [TestCase(-1)]
        [TestCase(0)]
        public async Task GenerateCharacter_ReturnsBadRequest_InvalidSetConstitution(int invalidAbility)
        {
            var queryString = "?abilitiesRandomizerType=Set";
            queryString += "&levelRandomizerType=Set&setLevel=1";
            queryString += "&baseRaceRandomizerType=Set&setBaseRace=Human";
            queryString += $"&metaraceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.Metarace.NoMeta)}";
            queryString += "&setStrength=9266";
            queryString += $"&setConstitution={invalidAbility}";
            queryString += "&setDexterity=42";
            queryString += "&setIntelligence=600";
            queryString += "&setWisdom=1337";
            queryString += "&setCharisma=1336";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_NoSetDexterity()
        {
            var queryString = "?abilitiesRandomizerType=Set";
            queryString += "&levelRandomizerType=Set&setLevel=1";
            queryString += "&baseRaceRandomizerType=Set&setBaseRace=Human";
            queryString += $"&metaraceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.Metarace.NoMeta)}";
            queryString += "&setStrength=9266";
            queryString += "&setConstitution=90210";
            //queryString += "&setDexterity=42";
            queryString += "&setIntelligence=600";
            queryString += "&setWisdom=1337";
            queryString += "&setCharisma=1336";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
        }

        [TestCase(-2)]
        [TestCase(-1)]
        [TestCase(0)]
        public async Task GenerateCharacter_ReturnsBadRequest_InvalidSetDexterity(int invalidAbility)
        {
            var queryString = "?abilitiesRandomizerType=Set";
            queryString += "&levelRandomizerType=Set&setLevel=1";
            queryString += "&baseRaceRandomizerType=Set&setBaseRace=Human";
            queryString += $"&metaraceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.Metarace.NoMeta)}";
            queryString += "&setStrength=9266";
            queryString += "&setConstitution=90210";
            queryString += $"&setDexterity={invalidAbility}";
            queryString += "&setIntelligence=600";
            queryString += "&setWisdom=1337";
            queryString += "&setCharisma=1336";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_NoSetIntelligence()
        {
            var queryString = "?abilitiesRandomizerType=Set";
            queryString += "&levelRandomizerType=Set&setLevel=1";
            queryString += "&baseRaceRandomizerType=Set&setBaseRace=Human";
            queryString += $"&metaraceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.Metarace.NoMeta)}";
            queryString += "&setStrength=9266";
            queryString += "&setConstitution=90210";
            queryString += "&setDexterity=42";
            //queryString += "&setIntelligence=600";
            queryString += "&setWisdom=1337";
            queryString += "&setCharisma=1336";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
        }

        [TestCase(-2)]
        [TestCase(-1)]
        [TestCase(0)]
        public async Task GenerateCharacter_ReturnsBadRequest_InvalidSetIntelligence(int invalidAbility)
        {
            var queryString = "?abilitiesRandomizerType=Set";
            queryString += "&levelRandomizerType=Set&setLevel=1";
            queryString += "&baseRaceRandomizerType=Set&setBaseRace=Human";
            queryString += $"&metaraceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.Metarace.NoMeta)}";
            queryString += "&setStrength=9266";
            queryString += "&setConstitution=90210";
            queryString += "&setDexterity=42";
            queryString += $"&setIntelligence={invalidAbility}";
            queryString += "&setWisdom=1337";
            queryString += "&setCharisma=1336";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_NoSetWisdom()
        {
            var queryString = "?abilitiesRandomizerType=Set";
            queryString += "&levelRandomizerType=Set&setLevel=1";
            queryString += "&baseRaceRandomizerType=Set&setBaseRace=Human";
            queryString += $"&metaraceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.Metarace.NoMeta)}";
            queryString += "&setStrength=9266";
            queryString += "&setConstitution=90210";
            queryString += "&setDexterity=42";
            queryString += "&setIntelligence=600";
            //queryString += "&setWisdom=1337";
            queryString += "&setCharisma=1336";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
        }

        [TestCase(-2)]
        [TestCase(-1)]
        [TestCase(0)]
        public async Task GenerateCharacter_ReturnsBadRequest_InvalidSetWisdom(int invalidAbility)
        {
            var queryString = "?abilitiesRandomizerType=Set";
            queryString += "&levelRandomizerType=Set&setLevel=1";
            queryString += "&baseRaceRandomizerType=Set&setBaseRace=Human";
            queryString += $"&metaraceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.Metarace.NoMeta)}";
            queryString += "&setStrength=9266";
            queryString += "&setConstitution=90210";
            queryString += "&setDexterity=42";
            queryString += "&setIntelligence=600";
            queryString += $"&setWisdom={invalidAbility}";
            queryString += "&setCharisma=1336";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_NoSetCharisma()
        {
            var queryString = "?abilitiesRandomizerType=Set";
            queryString += "&levelRandomizerType=Set&setLevel=1";
            queryString += "&baseRaceRandomizerType=Set&setBaseRace=Human";
            queryString += $"&metaraceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.Metarace.NoMeta)}";
            queryString += "&setStrength=9266";
            queryString += "&setConstitution=90210";
            queryString += "&setDexterity=42";
            queryString += "&setIntelligence=600";
            queryString += "&setWisdom=1337";
            //queryString += "&setCharisma=1336";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
        }

        [TestCase(-2)]
        [TestCase(-1)]
        [TestCase(0)]
        public async Task GenerateCharacter_ReturnsBadRequest_InvalidSetCharisma(int invalidAbility)
        {
            var queryString = "?abilitiesRandomizerType=Set";
            queryString += "&levelRandomizerType=Set&setLevel=1";
            queryString += "&baseRaceRandomizerType=Set&setBaseRace=Human";
            queryString += $"&metaraceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.Metarace.NoMeta)}";
            queryString += "&setStrength=9266";
            queryString += "&setConstitution=90210";
            queryString += "&setDexterity=42";
            queryString += "&setIntelligence=600";
            queryString += "&setWisdom=1337";
            queryString += $"&setCharisma={invalidAbility}";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
        }

        [Test]
        public async Task GenerateCharacter_ReturnsCharacter_AllVariables()
        {
            var queryString = $"?abilitiesRandomizerType={HttpUtility.UrlEncode(AbilitiesRandomizerTypeConstants.TwoTenSidedDice)}";
            queryString += $"&alignmentRandomizerType={HttpUtility.UrlEncode(AlignmentRandomizerTypeConstants.NonLawful)}";
            queryString += $"&classNameRandomizerType={HttpUtility.UrlEncode(ClassNameRandomizerTypeConstants.PhysicalCombat)}";
            queryString += $"&levelRandomizerType={HttpUtility.UrlEncode(LevelRandomizerTypeConstants.Medium)}";
            queryString += $"&baseRaceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.BaseRace.NonStandardBase)}";
            queryString += $"&metaraceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.Metarace.LycanthropeMeta)}&forceMetarace=true";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Character>());

            var character = okResult.Value as Character;
            Assert.That(character, Is.Not.Null);
            Assert.That(character.Summary, Is.Not.Empty);
            Assert.That(character.Alignment.Full, Is.Not.Empty.And.AnyOf(AlignmentConstants.NeutralGood,
                AlignmentConstants.TrueNeutral,
                AlignmentConstants.NeutralEvil,
                AlignmentConstants.ChaoticGood,
                AlignmentConstants.ChaoticNeutral,
                AlignmentConstants.ChaoticEvil));
            Assert.That(character.Class.Level, Is.AtLeast(1).And.InRange(6, 10));
            Assert.That(character.Class.Summary, Is.Not.Empty);
            Assert.That(character.Class.Name, Is.Not.Empty.And.AnyOf(CharacterClassConstants.Barbarian,
                CharacterClassConstants.Fighter,
                CharacterClassConstants.Monk,
                CharacterClassConstants.Paladin,
                CharacterClassConstants.Ranger));
            Assert.That(character.Race.Summary, Is.Not.Empty);
            Assert.That(character.Race.BaseRace, Is.AnyOf(RaceConstants.BaseRaces.Aasimar,
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
                RaceConstants.BaseRaces.YuanTiPureblood));
            Assert.That(character.Race.Metarace, Is.AnyOf(RaceConstants.Metaraces.Werebear,
                RaceConstants.Metaraces.Wereboar,
                RaceConstants.Metaraces.Wererat,
                RaceConstants.Metaraces.Weretiger,
                RaceConstants.Metaraces.Werewolf));
            Assert.That(character.Abilities, Has.Count.EqualTo(6)
                .And.ContainKey(AbilityConstants.Strength)
                .And.ContainKey(AbilityConstants.Constitution)
                .And.ContainKey(AbilityConstants.Dexterity)
                .And.ContainKey(AbilityConstants.Intelligence)
                .And.ContainKey(AbilityConstants.Wisdom)
                .And.ContainKey(AbilityConstants.Charisma));
            Assert.That(character.Abilities[AbilityConstants.Strength].Value, Is.InRange(2, 20));
            Assert.That(character.Abilities[AbilityConstants.Constitution].Value, Is.InRange(2, 20));
            Assert.That(character.Abilities[AbilityConstants.Dexterity].Value, Is.InRange(2, 20));
            Assert.That(character.Abilities[AbilityConstants.Intelligence].Value, Is.InRange(2, 20));
            Assert.That(character.Abilities[AbilityConstants.Wisdom].Value, Is.InRange(2, 20));
            Assert.That(character.Abilities[AbilityConstants.Charisma].Value, Is.InRange(2, 20));
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_IncompatibleAlignmentRandomizer()
        {
            var queryString = $"?alignmentRandomizerType={HttpUtility.UrlEncode(AlignmentRandomizerTypeConstants.Lawful)}";
            queryString += "&classNameRandomizerType=Set&setClassName=Bard";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
        }

        [Test]
        public async Task GenerateCharacter_ReturnsCharacter_CompatibleAlignmentRandomizer()
        {
            var queryString = $"?alignmentRandomizerType={HttpUtility.UrlEncode(AlignmentRandomizerTypeConstants.NonLawful)}";
            queryString += "&classNameRandomizerType=Set&setClassName=Bard";

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
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_IncompatibleClassNameRandomizer()
        {
            var queryString = $"?classNameRandomizerType={HttpUtility.UrlEncode(ClassNameRandomizerTypeConstants.AnyNPC)}";
            queryString += $"&baseRaceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.BaseRace.MonsterBase)}";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_CompatibleClassNameRandomizer()
        {
            var queryString = $"?classNameRandomizerType={HttpUtility.UrlEncode(ClassNameRandomizerTypeConstants.AnyPlayer)}";
            queryString += $"&baseRaceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.BaseRace.MonsterBase)}";

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
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_IncompatibleBaseRaceRandomizer()
        {
            var queryString = $"?baseRaceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.BaseRace.MonsterBase)}";
            queryString += $"&classNameRandomizerType={HttpUtility.UrlEncode(ClassNameRandomizerTypeConstants.AnyNPC)}";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_CompatibleBaseRaceRandomizer()
        {
            var queryString = $"?baseRaceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.BaseRace.NonMonsterBase)}";
            queryString += $"&classNameRandomizerType={HttpUtility.UrlEncode(ClassNameRandomizerTypeConstants.AnyNPC)}";

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
        }

        [Test, Ignore("No non-set metarace randomizer can be incompatible with non-set alignment, class name, or non-set base race")]
        public async Task GenerateCharacter_ReturnsBadRequest_IncompatibleMetaraceRandomizer()
        {
            var queryString = $"?metaraceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.Metarace.UndeadMeta)}&forceMetarace=true";
            queryString += $"&alignmentRandomizerType={HttpUtility.UrlEncode(AlignmentRandomizerTypeConstants.NonEvil)}";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_CompatibleMetaraceRandomizer()
        {
            var queryString = $"?metaraceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.Metarace.GeneticMeta)}&forceMetarace=true";
            queryString += $"&alignmentRandomizerType={HttpUtility.UrlEncode(AlignmentRandomizerTypeConstants.NonEvil)}";

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
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_CompatibleMetaraceRandomizer_AllowNone()
        {
            var queryString = $"?metaraceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.Metarace.UndeadMeta)}&forceMetarace=false";
            queryString += $"&alignmentRandomizerType={HttpUtility.UrlEncode(AlignmentRandomizerTypeConstants.NonEvil)}";

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
        }

        [Test]
        public async Task GenerateCharacter_ReturnsCharacter_AllSetVariables()
        {
            var queryString = "?abilitiesRandomizerType=Set";
            queryString += $"&alignmentRandomizerType=Set&setAlignment={HttpUtility.UrlEncode(AlignmentConstants.NeutralEvil)}";
            queryString += "&classNameRandomizerType=Set&setClassName=Barbarian";
            queryString += "&levelRandomizerType=Set&setLevel=9";
            queryString += "&baseRaceRandomizerType=Set&setBaseRace=Tiefling";
            queryString += $"&metaraceRandomizerType=Set&setMetarace={HttpUtility.UrlEncode(RaceConstants.Metaraces.HalfDragon)}";
            queryString += "&setStrength=9266";
            queryString += "&setConstitution=90210";
            queryString += "&setDexterity=42";
            queryString += "&setIntelligence=600";
            queryString += "&setWisdom=1337";
            queryString += "&setCharisma=1336";
            queryString += "&allowAbilityAdjustments=false";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<Character>());

            var character = okResult.Value as Character;
            Assert.That(character, Is.Not.Null);
            Assert.That(character.Summary, Is.Not.Empty);
            Assert.That(character.Alignment.Full, Is.Not.Empty.And.EqualTo(AlignmentConstants.NeutralEvil));
            Assert.That(character.Class.Level, Is.AtLeast(1).And.EqualTo(9));
            Assert.That(character.Class.Summary, Is.Not.Empty);
            Assert.That(character.Class.Name, Is.Not.Empty.And.EqualTo(CharacterClassConstants.Barbarian));
            Assert.That(character.Race.Summary, Is.Not.Empty);
            Assert.That(character.Race.BaseRace, Is.EqualTo(RaceConstants.BaseRaces.Tiefling));
            Assert.That(character.Race.Metarace, Is.EqualTo(RaceConstants.Metaraces.HalfDragon));
            Assert.That(character.Abilities, Has.Count.EqualTo(6)
                .And.ContainKey(AbilityConstants.Strength)
                .And.ContainKey(AbilityConstants.Constitution)
                .And.ContainKey(AbilityConstants.Dexterity)
                .And.ContainKey(AbilityConstants.Intelligence)
                .And.ContainKey(AbilityConstants.Wisdom)
                .And.ContainKey(AbilityConstants.Charisma));
            Assert.That(character.Abilities[AbilityConstants.Strength].Value, Is.EqualTo(9266));
            Assert.That(character.Abilities[AbilityConstants.Constitution].Value, Is.EqualTo(90210));
            Assert.That(character.Abilities[AbilityConstants.Dexterity].Value, Is.EqualTo(42));
            Assert.That(character.Abilities[AbilityConstants.Intelligence].Value, Is.EqualTo(600));
            Assert.That(character.Abilities[AbilityConstants.Wisdom].Value, Is.EqualTo(1337));
            Assert.That(character.Abilities[AbilityConstants.Charisma].Value, Is.EqualTo(1336));
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_IncompatibleSetAlignment()
        {
            var queryString = $"?alignmentRandomizerType=Set&setAlignment={HttpUtility.UrlEncode(AlignmentConstants.LawfulNeutral)}";
            queryString += "&classNameRandomizerType=Set&setClassName=Bard";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
        }

        [Test]
        public async Task GenerateCharacter_ReturnsCharacter_CompatibleSetAlignment()
        {
            var queryString = $"?alignmentRandomizerType=Set&setAlignment={HttpUtility.UrlEncode(AlignmentConstants.TrueNeutral)}";
            queryString += "&classNameRandomizerType=Set&setClassName=Bard";

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
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_IncompatibleSetClassName()
        {
            var queryString = $"?classNameRandomizerType=Set&setClassName={HttpUtility.UrlEncode(CharacterClassConstants.Warrior)}";
            queryString += $"&baseRaceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.BaseRace.MonsterBase)}";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_CompatibleSetClassName()
        {
            var queryString = $"?classNameRandomizerType=Set&setClassName={HttpUtility.UrlEncode(CharacterClassConstants.Wizard)}";
            queryString += $"&baseRaceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.BaseRace.MonsterBase)}";

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
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_IncompatibleSetBaseRace()
        {
            var queryString = $"?baseRaceRandomizerType=Set&setBaseRace={HttpUtility.UrlEncode(RaceConstants.BaseRaces.OgreMage)}";
            queryString += $"&alignmentRandomizerType={HttpUtility.UrlEncode(AlignmentRandomizerTypeConstants.Good)}";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_CompatibleSetBaseRace()
        {
            var queryString = $"?baseRaceRandomizerType=Set&setBaseRace={HttpUtility.UrlEncode(RaceConstants.BaseRaces.Orc)}";
            queryString += $"&alignmentRandomizerType={HttpUtility.UrlEncode(AlignmentRandomizerTypeConstants.Good)}";

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
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_IncompatibleSetMetarace()
        {
            var queryString = $"?metaraceRandomizerType=Set&setMetarace={HttpUtility.UrlEncode(RaceConstants.Metaraces.Lich)}";
            queryString += $"&alignmentRandomizerType={HttpUtility.UrlEncode(AlignmentRandomizerTypeConstants.NonEvil)}";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<BadRequestResult>());
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_CompatibleSetMetarace()
        {
            var queryString = $"?metaraceRandomizerType=Set&setMetarace={HttpUtility.UrlEncode(RaceConstants.Metaraces.Weretiger)}";
            queryString += $"&alignmentRandomizerType={HttpUtility.UrlEncode(AlignmentRandomizerTypeConstants.NonEvil)}";

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
        }

        [Test]
        public async Task GenerateCharacter_ReturnsBadRequest_CompatibleSetRandomizer_None()
        {
            var queryString = $"?metaraceRandomizerType=Set&setMetarace={HttpUtility.UrlEncode(RaceConstants.Metaraces.None)}";
            queryString += $"&alignmentRandomizerType={HttpUtility.UrlEncode(AlignmentRandomizerTypeConstants.NonEvil)}";

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
        }
    }
}