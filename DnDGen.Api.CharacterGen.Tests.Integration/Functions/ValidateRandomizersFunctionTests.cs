using DnDGen.Api.CharacterGen.Dependencies;
using DnDGen.Api.CharacterGen.Functions;
using DnDGen.Api.CharacterGen.Tests.Integration.Helpers;
using DnDGen.CharacterGen.Alignments;
using DnDGen.CharacterGen.CharacterClasses;
using DnDGen.CharacterGen.Races;
using DnDGen.CharacterGen.Randomizers.Alignments;
using DnDGen.CharacterGen.Randomizers.CharacterClasses;
using DnDGen.CharacterGen.Randomizers.Races;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Web;

namespace DnDGen.Api.CharacterGen.Tests.Integration.Functions
{
    public class ValidateRandomizersFunctionTests : IntegrationTests
    {
        private ValidateRandomizersFunction function;
        private ILogger logger;

        [SetUp]
        public void Setup()
        {
            var dependencyFactory = GetService<IDependencyFactory>();
            function = new ValidateRandomizersFunction(dependencyFactory);

            var loggerFactory = new LoggerFactory();
            logger = loggerFactory.CreateLogger("Integration Test");
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsValid_AllDefaults()
        {
            var request = RequestHelper.BuildRequest();
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.True);
        }

        [TestCase(AlignmentRandomizerTypeConstants.Any)]
        [TestCase(AlignmentRandomizerTypeConstants.Chaotic)]
        [TestCase(AlignmentRandomizerTypeConstants.Evil)]
        [TestCase(AlignmentRandomizerTypeConstants.Good)]
        [TestCase(AlignmentRandomizerTypeConstants.Lawful)]
        [TestCase(AlignmentRandomizerTypeConstants.Neutral)]
        [TestCase(AlignmentRandomizerTypeConstants.NonChaotic)]
        [TestCase(AlignmentRandomizerTypeConstants.NonEvil)]
        [TestCase(AlignmentRandomizerTypeConstants.NonGood)]
        [TestCase(AlignmentRandomizerTypeConstants.NonLawful)]
        [TestCase(AlignmentRandomizerTypeConstants.NonNeutral)]
        public async Task ValidateRandomizers_ReturnsValid_AlignmentRandomizers(string alignmentRandomizerType)
        {
            var request = RequestHelper.BuildRequest($"?alignmentRandomizerType={HttpUtility.UrlEncode(alignmentRandomizerType)}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.True);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsValid_AlignmentRandomizers_CaseInsensitive()
        {
            var request = RequestHelper.BuildRequest($"?alignmentRandomizerType={HttpUtility.UrlEncode(AlignmentRandomizerTypeConstants.Any.ToUpper())}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.True);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsInvalid_InvalidAlignmentRandomizer()
        {
            var request = RequestHelper.BuildRequest("?alignmentRandomizerType=Invalid");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.False);
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
        public async Task ValidateRandomizers_ReturnsValid_SetAlignment(string alignment)
        {
            var request = RequestHelper.BuildRequest($"?alignmentRandomizerType=Set&setAlignment={HttpUtility.UrlEncode(alignment)}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.True);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsValid_SetAlignment_CaseInsensitive()
        {
            var request = RequestHelper.BuildRequest($"?alignmentRandomizerType=Set&setAlignment={HttpUtility.UrlEncode(AlignmentConstants.LawfulGood.ToUpper())}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.True);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsInvalid_NoSetAlignment()
        {
            var request = RequestHelper.BuildRequest($"?alignmentRandomizerType=Set");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.False);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsInvalid_InvalidSetAlignment()
        {
            var request = RequestHelper.BuildRequest($"?alignmentRandomizerType=Set&setAlignment={HttpUtility.UrlEncode("Invalid Alignment")}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.False);
        }

        [TestCase(ClassNameRandomizerTypeConstants.AnyPlayer)]
        [TestCase(ClassNameRandomizerTypeConstants.AnyNPC)]
        [TestCase(ClassNameRandomizerTypeConstants.ArcaneSpellcaster)]
        [TestCase(ClassNameRandomizerTypeConstants.DivineSpellcaster)]
        [TestCase(ClassNameRandomizerTypeConstants.NonSpellcaster)]
        [TestCase(ClassNameRandomizerTypeConstants.PhysicalCombat)]
        [TestCase(ClassNameRandomizerTypeConstants.Spellcaster)]
        [TestCase(ClassNameRandomizerTypeConstants.Stealth)]
        public async Task ValidateRandomizers_ReturnsValid_ClassNameRandomizers(string classNameRandomizerType)
        {
            var request = RequestHelper.BuildRequest($"?classNameRandomizerType={HttpUtility.UrlEncode(classNameRandomizerType)}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.True);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsValid_ClassNameRandomizers_CaseInsensitive()
        {
            var request = RequestHelper.BuildRequest($"?classNameRandomizerType={HttpUtility.UrlEncode(ClassNameRandomizerTypeConstants.AnyPlayer.ToUpper())}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.True);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsInvalid_InvalidClassNameRandomizer()
        {
            var request = RequestHelper.BuildRequest("?classNameRandomizerType=Invalid");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.False);
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
        public async Task ValidateRandomizers_ReturnsValid_SetClassName(string className)
        {
            var request = RequestHelper.BuildRequest($"?classNameRandomizerType=Set&setClassName={HttpUtility.UrlEncode(className)}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.True);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsValid_SetClassName_CaseInsensitive()
        {
            var request = RequestHelper.BuildRequest($"?classNameRandomizerType=Set&setClassName={HttpUtility.UrlEncode(CharacterClassConstants.Druid.ToUpper())}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.True);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsInvalid_NoSetClassName()
        {
            var request = RequestHelper.BuildRequest($"?classNameRandomizerType=Set");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.False);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsInvalid_InvalidSetClassName()
        {
            var request = RequestHelper.BuildRequest($"?classNameRandomizerType=Set&setClassName=Invalid");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.False);
        }

        [TestCase(LevelRandomizerTypeConstants.Any)]
        [TestCase(LevelRandomizerTypeConstants.Low)]
        [TestCase(LevelRandomizerTypeConstants.Medium)]
        [TestCase(LevelRandomizerTypeConstants.High)]
        [TestCase(LevelRandomizerTypeConstants.VeryHigh)]
        public async Task ValidateRandomizers_ReturnsValid_LevelRandomizers(string levelRandomizerType)
        {
            var request = RequestHelper.BuildRequest($"?levelRandomizerType={HttpUtility.UrlEncode(levelRandomizerType)}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.True);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsValid_LevelRandomizers_CaseInsensitive()
        {
            var request = RequestHelper.BuildRequest($"?levelRandomizerType={HttpUtility.UrlEncode(LevelRandomizerTypeConstants.Any.ToUpper())}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.True);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsInvalid_InvalidLevelRandomizer()
        {
            var request = RequestHelper.BuildRequest("?levelRandomizerType=Invalid");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.False);
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
        public async Task ValidateRandomizers_ReturnsValid_SetLevel(int level)
        {
            var request = RequestHelper.BuildRequest($"?levelRandomizerType=Set&setLevel={level}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.True);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsInvalid_NoSetLevel()
        {
            var request = RequestHelper.BuildRequest($"?levelRandomizerType=Set");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.False);
        }

        [TestCase(-2)]
        [TestCase(-1)]
        [TestCase(0)]
        [TestCase(21)]
        [TestCase(22)]
        public async Task ValidateRandomizers_ReturnsInvalid_InvalidSetLevel(int invalidLevel)
        {
            var request = RequestHelper.BuildRequest($"?levelRandomizerType=Set&setLevel={invalidLevel}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.False);
        }

        [TestCase(RaceRandomizerTypeConstants.BaseRace.AnyBase)]
        [TestCase(RaceRandomizerTypeConstants.BaseRace.AquaticBase)]
        [TestCase(RaceRandomizerTypeConstants.BaseRace.MonsterBase)]
        [TestCase(RaceRandomizerTypeConstants.BaseRace.NonMonsterBase)]
        [TestCase(RaceRandomizerTypeConstants.BaseRace.NonStandardBase)]
        [TestCase(RaceRandomizerTypeConstants.BaseRace.StandardBase)]
        public async Task ValidateRandomizers_ReturnsValid_BaseRaceRandomizers(string baseRaceRandomizerType)
        {
            var request = RequestHelper.BuildRequest($"?baseRaceRandomizerType={HttpUtility.UrlEncode(baseRaceRandomizerType)}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.True);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsValid_BaseRaceRandomizers_CaseInsensitive()
        {
            var request = RequestHelper.BuildRequest($"?baseRaceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.BaseRace.StandardBase.ToUpper())}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.True);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsInvalid_InvalidBaseRaceRandomizer()
        {
            var request = RequestHelper.BuildRequest("?baseRaceRandomizerType=Invalid");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.False);
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
        public async Task ValidateRandomizers_ReturnsValid_SetBaseRace(string baseRace)
        {
            var request = RequestHelper.BuildRequest($"?baseRaceRandomizerType=Set&setBaseRace={HttpUtility.UrlEncode(baseRace)}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.True);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsValid_SetBaseRace_CaseInsensitive()
        {
            var request = RequestHelper.BuildRequest($"?baseRaceRandomizerType=Set&setBaseRace={HttpUtility.UrlEncode(RaceConstants.BaseRaces.Tiefling.ToUpper())}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.True);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsInvalid_NoSetBaseRace()
        {
            var request = RequestHelper.BuildRequest($"?baseRaceRandomizerType=Set");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.False);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsInvalid_InvalidSetBaseRace()
        {
            var request = RequestHelper.BuildRequest("?baseRaceRandomizerType=Set&setBaseRace=Invalid");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.False);
        }

        [TestCase(RaceRandomizerTypeConstants.Metarace.AnyMeta, true)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.AnyMeta, false)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.GeneticMeta, true)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.GeneticMeta, false)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.LycanthropeMeta, true)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.LycanthropeMeta, false)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.UndeadMeta, true)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.UndeadMeta, false)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.NoMeta, false)]
        [TestCase(RaceRandomizerTypeConstants.Metarace.NoMeta, true)]
        public async Task ValidateRandomizers_ReturnsValid_MetaraceRandomizers(string metaraceRandomizerType, bool force)
        {
            var request = RequestHelper.BuildRequest($"?metaraceRandomizerType={HttpUtility.UrlEncode(metaraceRandomizerType)}&forceMetarace={force}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.True);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsValid_MetaraceRandomizers_CaseInsensitive()
        {
            var request = RequestHelper.BuildRequest($"?metaraceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.Metarace.GeneticMeta.ToUpper())}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.True);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsInvalid_InvalidMetaraceRandomizer()
        {
            var request = RequestHelper.BuildRequest("?metaraceRandomizerType=Invalid");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.False);
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
        public async Task ValidateRandomizers_ReturnsValid_SetMetarace(string metarace)
        {
            var request = RequestHelper.BuildRequest($"?metaraceRandomizerType=Set&setMetarace={HttpUtility.UrlEncode(metarace)}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.True);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsValid_SetMetarace_CaseInsensitive()
        {
            var request = RequestHelper.BuildRequest($"?metaraceRandomizerType=Set&setMetarace={HttpUtility.UrlEncode(RaceConstants.Metaraces.Vampire.ToUpper())}");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.True);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsInvalid_NoSetMetarace()
        {
            var request = RequestHelper.BuildRequest($"?metaraceRandomizerType=Set");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.False);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsInvalid_InvalidSetMetarace()
        {
            var request = RequestHelper.BuildRequest("?metaraceRandomizerType=Set&setMetarace=Invalid");
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.False);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsValid_AllVariables()
        {
            var queryString = $"?alignmentRandomizerType={HttpUtility.UrlEncode(AlignmentRandomizerTypeConstants.NonLawful)}";
            queryString += $"&classNameRandomizerType={HttpUtility.UrlEncode(ClassNameRandomizerTypeConstants.PhysicalCombat)}";
            queryString += $"&levelRandomizerType={HttpUtility.UrlEncode(LevelRandomizerTypeConstants.Medium)}";
            queryString += $"&baseRaceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.BaseRace.NonStandardBase)}";
            queryString += $"&metaraceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.Metarace.LycanthropeMeta)}&forceMetarace=true";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.True);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsInvalid_IncompatibleAlignmentRandomizer()
        {
            var queryString = $"?alignmentRandomizerType={HttpUtility.UrlEncode(AlignmentRandomizerTypeConstants.Lawful)}";
            queryString += "&classNameRandomizerType=Set&setClassName=Bard";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.False);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsValid_CompatibleAlignmentRandomizer()
        {
            var queryString = $"?alignmentRandomizerType={HttpUtility.UrlEncode(AlignmentRandomizerTypeConstants.NonLawful)}";
            queryString += "&classNameRandomizerType=Set&setClassName=Bard";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.True);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsInvalid_IncompatibleClassNameRandomizer()
        {
            var queryString = $"?classNameRandomizerType={HttpUtility.UrlEncode(ClassNameRandomizerTypeConstants.AnyNPC)}";
            queryString += $"&baseRaceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.BaseRace.MonsterBase)}";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.False);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsInvalid_CompatibleClassNameRandomizer()
        {
            var queryString = $"?classNameRandomizerType={HttpUtility.UrlEncode(ClassNameRandomizerTypeConstants.AnyPlayer)}";
            queryString += $"&baseRaceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.BaseRace.MonsterBase)}";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.True);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsInvalid_IncompatibleBaseRaceRandomizer()
        {
            var queryString = $"?baseRaceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.BaseRace.MonsterBase)}";
            queryString += $"&classNameRandomizerType={HttpUtility.UrlEncode(ClassNameRandomizerTypeConstants.AnyNPC)}";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.False);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsInvalid_CompatibleBaseRaceRandomizer()
        {
            var queryString = $"?baseRaceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.BaseRace.NonMonsterBase)}";
            queryString += $"&classNameRandomizerType={HttpUtility.UrlEncode(ClassNameRandomizerTypeConstants.AnyNPC)}";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.True);
        }

        [Test, Ignore("No non-set metarace randomizer can be incompatible with non-set alignment, class name, or non-set base race")]
        public async Task ValidateRandomizers_ReturnsInvalid_IncompatibleMetaraceRandomizer()
        {
            var queryString = $"?metaraceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.Metarace.UndeadMeta)}&forceMetarace=true";
            queryString += $"&alignmentRandomizerType={HttpUtility.UrlEncode(AlignmentRandomizerTypeConstants.Good)}";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.False);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsInvalid_CompatibleMetaraceRandomizer()
        {
            var queryString = $"?metaraceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.Metarace.GeneticMeta)}&forceMetarace=true";
            queryString += $"&alignmentRandomizerType={HttpUtility.UrlEncode(AlignmentRandomizerTypeConstants.NonEvil)}";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.True);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsInvalid_CompatibleMetaraceRandomizer_AllowNone()
        {
            var queryString = $"?metaraceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.Metarace.UndeadMeta)}&forceMetarace=false";
            queryString += $"&alignmentRandomizerType={HttpUtility.UrlEncode(AlignmentRandomizerTypeConstants.NonEvil)}";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.True);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsValid_AllSetVariables()
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
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.True);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsInvalid_IncompatibleSetAlignment()
        {
            var queryString = $"?alignmentRandomizerType=Set&setAlignment={HttpUtility.UrlEncode(AlignmentConstants.LawfulNeutral)}";
            queryString += "&classNameRandomizerType=Set&setClassName=Bard";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.False);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsValid_CompatibleSetAlignment()
        {
            var queryString = $"?alignmentRandomizerType=Set&setAlignment={HttpUtility.UrlEncode(AlignmentConstants.TrueNeutral)}";
            queryString += "&classNameRandomizerType=Set&setClassName=Bard";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.True);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsInvalid_IncompatibleSetClassName()
        {
            var queryString = $"?classNameRandomizerType=Set&setClassName={HttpUtility.UrlEncode(CharacterClassConstants.Warrior)}";
            queryString += $"&baseRaceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.BaseRace.MonsterBase)}";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.False);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsInvalid_CompatibleSetClassName()
        {
            var queryString = $"?classNameRandomizerType=Set&setClassName={HttpUtility.UrlEncode(CharacterClassConstants.Wizard)}";
            queryString += $"&baseRaceRandomizerType={HttpUtility.UrlEncode(RaceRandomizerTypeConstants.BaseRace.MonsterBase)}";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.True);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsInvalid_IncompatibleSetBaseRace()
        {
            var queryString = $"?baseRaceRandomizerType=Set&setBaseRace={HttpUtility.UrlEncode(RaceConstants.BaseRaces.OgreMage)}";
            queryString += $"&alignmentRandomizerType={HttpUtility.UrlEncode(AlignmentRandomizerTypeConstants.Good)}";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.False);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsInvalid_CompatibleSetBaseRace()
        {
            var queryString = $"?baseRaceRandomizerType=Set&setBaseRace={HttpUtility.UrlEncode(RaceConstants.BaseRaces.Orc)}";
            queryString += $"&alignmentRandomizerType={HttpUtility.UrlEncode(AlignmentRandomizerTypeConstants.Good)}";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.True);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsInvalid_IncompatibleSetMetarace()
        {
            var queryString = $"?metaraceRandomizerType=Set&setMetarace={HttpUtility.UrlEncode(RaceConstants.Metaraces.Lich)}";
            queryString += $"&alignmentRandomizerType={HttpUtility.UrlEncode(AlignmentRandomizerTypeConstants.NonEvil)}";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.False);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsInvalid_CompatibleSetMetarace()
        {
            var queryString = $"?metaraceRandomizerType=Set&setMetarace={HttpUtility.UrlEncode(RaceConstants.Metaraces.Weretiger)}";
            queryString += $"&alignmentRandomizerType={HttpUtility.UrlEncode(AlignmentRandomizerTypeConstants.NonEvil)}";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.True);
        }

        [Test]
        public async Task ValidateRandomizers_ReturnsInvalid_CompatibleSetRandomizer_None()
        {
            var queryString = $"?metaraceRandomizerType=Set&setMetarace={HttpUtility.UrlEncode(RaceConstants.Metaraces.None)}";
            queryString += $"&alignmentRandomizerType={HttpUtility.UrlEncode(AlignmentRandomizerTypeConstants.NonEvil)}";

            var request = RequestHelper.BuildRequest(queryString);
            var response = await function.Run(request, logger);
            Assert.That(response, Is.InstanceOf<OkObjectResult>());

            var okResult = response as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<bool>());
            Assert.That((bool)okResult.Value, Is.True);
        }
    }
}