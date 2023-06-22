using DnDGen.Web.App_Start;
using DnDGen.Web.Models;
using Newtonsoft.Json.Linq;
using NUnit.Framework;
using System;
using System.Collections;
using System.Net;
using System.Threading.Tasks;
using System.Web;

namespace DnDGen.Web.Tests.Integration.Views
{
    [TestFixture]
    internal class CharacterTests : EndToEndTests
    {
        [TestCase("/character")]
        [TestCase("/Character")]
        public async Task Character_Index_ReturnsCharacterPage(string url)
        {
            var response = await httpClient.GetAsync(url);

            response.EnsureSuccessStatusCode();
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("text/html; charset=utf-8"));

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty
                .And.Contains("CharacterGen")
                .And.Not.Contains("DnDGen rolled a Nat 1"));
        }

        [TestCaseSource(nameof(CharacterGenerationData))]
        public async Task Generate_ReturnsCharacter(string url,
            string alignmentRandomizerType,
            string classNameRandomizerType,
            string levelRandomizerType,
            string baseRaceRandomizerType,
            string metaraceRandomizerType,
            string abilitiesRandomizerType,
            string setAlignment,
            string setClassName,
            int setLevel,
            bool allowLevelAdjustments,
            string setBaseRace,
            bool forceMetarace,
            string setMetarace,
            int setStrength,
            int setConstitution,
            int setDexterity,
            int setIntelligence,
            int setWisdom,
            int setCharisma,
            bool allowAbilityAdjustments)
        {
            var clientId = Guid.NewGuid();
            var response = await httpClient.GetAsync($"{url}?clientId={clientId}" +
                $"&alignmentRandomizerType={HttpUtility.UrlEncode(alignmentRandomizerType)}" +
                $"&classNameRandomizerType={HttpUtility.UrlEncode(classNameRandomizerType)}" +
                $"&levelRandomizerType={HttpUtility.UrlEncode(levelRandomizerType)}" +
                $"&baseRaceRandomizerType={HttpUtility.UrlEncode(baseRaceRandomizerType)}" +
                $"&metaraceRandomizerType={HttpUtility.UrlEncode(metaraceRandomizerType)}" +
                $"&abilitiesRandomizerType={HttpUtility.UrlEncode(abilitiesRandomizerType)}" +
                $"&setAlignment={HttpUtility.UrlEncode(setAlignment)}" +
                $"&setClassName={HttpUtility.UrlEncode(setClassName)}" +
                $"&setLevel={setLevel}" +
                $"&allowLevelAdjustments={allowLevelAdjustments}" +
                $"&setBaseRace={HttpUtility.UrlEncode(setBaseRace)}" +
                $"&forceMetarace={forceMetarace}" +
                $"&setMetarace={HttpUtility.UrlEncode(setMetarace)}" +
                $"&setStrength={setStrength}" +
                $"&setConstitution={setConstitution}" +
                $"&setDexterity={setDexterity}" +
                $"&setIntelligence={setIntelligence}" +
                $"&setWisdom={setWisdom}" +
                $"&setCharisma={setCharisma}" +
                $"&allowAbilityAdjustments={allowAbilityAdjustments}");

            response.EnsureSuccessStatusCode();
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("application/json; charset=utf-8"));

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty
                .And.Contains("character")
                .And.Not.Contains("DnDGen rolled a Nat 1"));

            var body = JObject.Parse(result);
            Assert.That(body, Contains.Key("character"));
            Assert.That(body["character"], Is.Not.Null.And.Not.Empty);
        }

        public static IEnumerable CharacterGenerationData
        {
            get
            {
                yield return GetCharacterGenerationTestCase("/Character/Generate");

                var viewModel = new CharacterViewModel();

                foreach (var alignmentRandomizer in viewModel.AlignmentRandomizerTypes)
                {
                    if (alignmentRandomizer != RandomizerTypeConstants.Set)
                    {
                        yield return GetCharacterGenerationTestCase("/character/generate", alignmentRandomizerType: alignmentRandomizer);
                    }
                    else
                    {
                        foreach (var alignment in viewModel.Alignments)
                        {
                            yield return GetCharacterGenerationTestCase("/character/generate", alignmentRandomizerType: alignmentRandomizer, setAlignment: alignment);
                        }
                    }
                }

                foreach (var classNameRandomizer in viewModel.ClassNameRandomizerTypes)
                {
                    if (classNameRandomizer != RandomizerTypeConstants.Set)
                    {
                        yield return GetCharacterGenerationTestCase("/character/generate", classNameRandomizerType: classNameRandomizer);
                    }
                    else
                    {
                        foreach (var className in viewModel.ClassNames)
                        {
                            yield return GetCharacterGenerationTestCase("/character/generate", classNameRandomizerType: classNameRandomizer, setClassName: className);
                        }
                    }
                }

                foreach (var levelRandomizer in viewModel.LevelRandomizerTypes)
                {
                    if (levelRandomizer != RandomizerTypeConstants.Set)
                    {
                        yield return GetCharacterGenerationTestCase("/character/generate", levelRandomizerType: levelRandomizer, allowLevelAdjustments: true);
                        yield return GetCharacterGenerationTestCase("/character/generate", levelRandomizerType: levelRandomizer, allowLevelAdjustments: false);
                    }
                    else
                    {
                        yield return GetCharacterGenerationTestCase("/character/generate",
                            levelRandomizerType: levelRandomizer,
                            setLevel: 1,
                            allowLevelAdjustments: true);
                        yield return GetCharacterGenerationTestCase("/character/generate",
                            levelRandomizerType: levelRandomizer,
                            setLevel: 2,
                            allowLevelAdjustments: true);
                        yield return GetCharacterGenerationTestCase("/character/generate",
                            levelRandomizerType: levelRandomizer,
                            setLevel: 10,
                            allowLevelAdjustments: true);
                        yield return GetCharacterGenerationTestCase("/character/generate",
                            levelRandomizerType: levelRandomizer,
                            setLevel: 20,
                            allowLevelAdjustments: true);
                        yield return GetCharacterGenerationTestCase("/character/generate",
                            levelRandomizerType: levelRandomizer,
                            setLevel: 1,
                            allowLevelAdjustments: false);
                        yield return GetCharacterGenerationTestCase("/character/generate",
                            levelRandomizerType: levelRandomizer,
                            setLevel: 2,
                            allowLevelAdjustments: false);
                        yield return GetCharacterGenerationTestCase("/character/generate",
                            levelRandomizerType: levelRandomizer,
                            setLevel: 10,
                            allowLevelAdjustments: false);
                        yield return GetCharacterGenerationTestCase("/character/generate",
                            levelRandomizerType: levelRandomizer,
                            setLevel: 20,
                            allowLevelAdjustments: false);
                    }
                }

                foreach (var baseRaceRandomizer in viewModel.BaseRaceRandomizerTypes)
                {
                    if (baseRaceRandomizer != RandomizerTypeConstants.Set)
                    {
                        yield return GetCharacterGenerationTestCase("/character/generate", baseRaceRandomizerType: baseRaceRandomizer);
                    }
                    else
                    {
                        foreach (var baseRace in viewModel.BaseRaces)
                        {
                            yield return GetCharacterGenerationTestCase("/character/generate", baseRaceRandomizerType: baseRaceRandomizer, setBaseRace: baseRace);
                        }
                    }
                }

                foreach (var metaraceRandomizer in viewModel.MetaraceRandomizerTypes)
                {
                    if (metaraceRandomizer != RandomizerTypeConstants.Set)
                    {
                        yield return GetCharacterGenerationTestCase("/character/generate", metaraceRandomizerType: metaraceRandomizer, forceMetarace: true);
                        yield return GetCharacterGenerationTestCase("/character/generate", metaraceRandomizerType: metaraceRandomizer, forceMetarace: false);
                    }
                    else
                    {
                        foreach (var metarace in viewModel.Metaraces)
                        {
                            yield return GetCharacterGenerationTestCase("/character/generate",
                                metaraceRandomizerType: metaraceRandomizer,
                                setMetarace: metarace,
                                forceMetarace: true);
                            yield return GetCharacterGenerationTestCase("/character/generate",
                                metaraceRandomizerType: metaraceRandomizer,
                                setMetarace: metarace,
                                forceMetarace: false);
                        }
                    }
                }

                foreach (var abilitiesRandomizer in viewModel.AbilitiesRandomizerTypes)
                {
                    if (abilitiesRandomizer != RandomizerTypeConstants.Set)
                    {
                        yield return GetCharacterGenerationTestCase("/character/generate", abilitiesRandomizerType: abilitiesRandomizer, allowAbilityAdjustments: true);
                        yield return GetCharacterGenerationTestCase("/character/generate", abilitiesRandomizerType: abilitiesRandomizer, allowAbilityAdjustments: false);
                    }
                    else
                    {
                        yield return GetCharacterGenerationTestCase("/character/generate",
                            abilitiesRandomizerType: abilitiesRandomizer,
                            setStrength: 10,
                            setConstitution: 10,
                            setDexterity: 10,
                            setIntelligence: 10,
                            setWisdom: 10,
                            setCharisma: 10,
                            allowLevelAdjustments: true);
                        yield return GetCharacterGenerationTestCase("/character/generate",
                            abilitiesRandomizerType: abilitiesRandomizer,
                            setStrength: 10,
                            setConstitution: 10,
                            setDexterity: 10,
                            setIntelligence: 10,
                            setWisdom: 10,
                            setCharisma: 10,
                            allowLevelAdjustments: false);
                        yield return GetCharacterGenerationTestCase("/character/generate",
                            abilitiesRandomizerType: abilitiesRandomizer,
                            setStrength: 1,
                            setConstitution: 2,
                            setDexterity: 10,
                            setIntelligence: 18,
                            setWisdom: 20,
                            setCharisma: 9,
                            allowLevelAdjustments: true);
                        yield return GetCharacterGenerationTestCase("/character/generate",
                            abilitiesRandomizerType: abilitiesRandomizer,
                            setStrength: 2,
                            setConstitution: 6,
                            setDexterity: 6,
                            setIntelligence: 9,
                            setWisdom: 2,
                            setCharisma: 10,
                            allowLevelAdjustments: false);
                    }
                }
            }
        }

        public static TestCaseData GetCharacterGenerationTestCase(
            string url,
            string alignmentRandomizerType = "Any",
            string classNameRandomizerType = "Any Player",
            string levelRandomizerType = "Any",
            string baseRaceRandomizerType = "Any Base",
            string metaraceRandomizerType = "Any Meta",
            string abilitiesRandomizerType = "Raw",
            string setAlignment = "Lawful Good",
            string setClassName = "Barbarian",
            int setLevel = 0,
            bool allowLevelAdjustments = true,
            string setBaseRace = "Aasimar",
            bool forceMetarace = false,
            string setMetarace = "Ghost",
            int setStrength = 0,
            int setConstitution = 0,
            int setDexterity = 0,
            int setIntelligence = 0,
            int setWisdom = 0,
            int setCharisma = 0,
            bool allowAbilityAdjustments = true)
            => new TestCaseData(
                url,
                alignmentRandomizerType,
                classNameRandomizerType,
                levelRandomizerType,
                baseRaceRandomizerType,
                metaraceRandomizerType,
                abilitiesRandomizerType,
                setAlignment,
                setClassName,
                setLevel,
                allowLevelAdjustments,
                setBaseRace,
                forceMetarace,
                setMetarace,
                setStrength,
                setConstitution,
                setDexterity,
                setIntelligence,
                setWisdom,
                setCharisma,
                allowAbilityAdjustments);

        [TestCaseSource(nameof(RandomizerVerificationData))]
        public async Task RandomizersVerify_ReturnsVerified(string url,
            string alignmentRandomizerType,
            string classNameRandomizerType,
            string levelRandomizerType,
            string baseRaceRandomizerType,
            string metaraceRandomizerType,
            string setAlignment,
            string setClassName,
            int setLevel,
            bool allowLevelAdjustments,
            string setBaseRace,
            bool forceMetarace,
            string setMetarace,
            bool valid)
        {
            var clientId = Guid.NewGuid();
            var response = await httpClient.GetAsync($"{url}?clientId={clientId}" +
                $"&alignmentRandomizerType={HttpUtility.UrlEncode(alignmentRandomizerType)}" +
                $"&classNameRandomizerType={HttpUtility.UrlEncode(classNameRandomizerType)}" +
                $"&levelRandomizerType={HttpUtility.UrlEncode(levelRandomizerType)}" +
                $"&baseRaceRandomizerType={HttpUtility.UrlEncode(baseRaceRandomizerType)}" +
                $"&metaraceRandomizerType={HttpUtility.UrlEncode(metaraceRandomizerType)}" +
                $"&setAlignment={HttpUtility.UrlEncode(setAlignment)}" +
                $"&setClassName={HttpUtility.UrlEncode(setClassName)}" +
                $"&setLevel={setLevel}" +
                $"&allowLevelAdjustments={allowLevelAdjustments}" +
                $"&setBaseRace={HttpUtility.UrlEncode(setBaseRace)}" +
                $"&forceMetarace={forceMetarace}" +
                $"&setMetarace={HttpUtility.UrlEncode(setMetarace)}");

            response.EnsureSuccessStatusCode();
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("application/json; charset=utf-8"));

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty
                .And.Contains("compatible")
                .And.Not.Contains("DnDGen rolled a Nat 1"));

            var body = JObject.Parse(result);
            Assert.That(body, Contains.Key("compatible"));
            Assert.That(Convert.ToBoolean(body["compatible"]), Is.EqualTo(valid));
        }

        public static IEnumerable RandomizerVerificationData
        {
            get
            {
                yield return GetRandomizerVerificationDataTestCase("/Characters/Randomizers/Verify", true);

                var viewModel = new CharacterViewModel();

                foreach (var alignmentRandomizer in viewModel.AlignmentRandomizerTypes)
                {
                    if (alignmentRandomizer != RandomizerTypeConstants.Set)
                    {
                        yield return GetRandomizerVerificationDataTestCase("/characters/randomizers/verify", true, alignmentRandomizerType: alignmentRandomizer);
                    }
                    else
                    {
                        foreach (var alignment in viewModel.Alignments)
                        {
                            yield return GetRandomizerVerificationDataTestCase("/characters/randomizers/verify", true, alignmentRandomizerType: alignmentRandomizer, setAlignment: alignment);
                        }
                    }
                }

                foreach (var classNameRandomizer in viewModel.ClassNameRandomizerTypes)
                {
                    if (classNameRandomizer != RandomizerTypeConstants.Set)
                    {
                        yield return GetRandomizerVerificationDataTestCase("/characters/randomizers/verify", true, classNameRandomizerType: classNameRandomizer);
                    }
                    else
                    {
                        foreach (var className in viewModel.ClassNames)
                        {
                            yield return GetRandomizerVerificationDataTestCase("/characters/randomizers/verify", true, classNameRandomizerType: classNameRandomizer, setClassName: className);
                        }
                    }
                }

                foreach (var levelRandomizer in viewModel.LevelRandomizerTypes)
                {
                    if (levelRandomizer != RandomizerTypeConstants.Set)
                    {
                        yield return GetRandomizerVerificationDataTestCase("/characters/randomizers/verify", true, levelRandomizerType: levelRandomizer, allowLevelAdjustments: true);
                        yield return GetRandomizerVerificationDataTestCase("/characters/randomizers/verify", true, levelRandomizerType: levelRandomizer, allowLevelAdjustments: false);
                    }
                    else
                    {
                        yield return GetRandomizerVerificationDataTestCase("/characters/randomizers/verify", true,
                            levelRandomizerType: levelRandomizer,
                            setLevel: 1,
                            allowLevelAdjustments: true);
                        yield return GetRandomizerVerificationDataTestCase("/characters/randomizers/verify", true,
                            levelRandomizerType: levelRandomizer,
                            setLevel: 2,
                            allowLevelAdjustments: true);
                        yield return GetRandomizerVerificationDataTestCase("/characters/randomizers/verify", true,
                            levelRandomizerType: levelRandomizer,
                            setLevel: 10,
                            allowLevelAdjustments: true);
                        yield return GetRandomizerVerificationDataTestCase("/characters/randomizers/verify", true,
                            levelRandomizerType: levelRandomizer,
                            setLevel: 20,
                            allowLevelAdjustments: true);
                        yield return GetRandomizerVerificationDataTestCase("/characters/randomizers/verify", true,
                            levelRandomizerType: levelRandomizer,
                            setLevel: 1,
                            allowLevelAdjustments: false);
                        yield return GetRandomizerVerificationDataTestCase("/characters/randomizers/verify", true,
                            levelRandomizerType: levelRandomizer,
                            setLevel: 2,
                            allowLevelAdjustments: false);
                        yield return GetRandomizerVerificationDataTestCase("/characters/randomizers/verify", true,
                            levelRandomizerType: levelRandomizer,
                            setLevel: 10,
                            allowLevelAdjustments: false);
                        yield return GetRandomizerVerificationDataTestCase("/characters/randomizers/verify", true,
                            levelRandomizerType: levelRandomizer,
                            setLevel: 20,
                            allowLevelAdjustments: false);
                    }
                }

                foreach (var baseRaceRandomizer in viewModel.BaseRaceRandomizerTypes)
                {
                    if (baseRaceRandomizer != RandomizerTypeConstants.Set)
                    {
                        yield return GetRandomizerVerificationDataTestCase("/characters/randomizers/verify", true, baseRaceRandomizerType: baseRaceRandomizer);
                    }
                    else
                    {
                        foreach (var baseRace in viewModel.BaseRaces)
                        {
                            yield return GetRandomizerVerificationDataTestCase("/characters/randomizers/verify", true, baseRaceRandomizerType: baseRaceRandomizer, setBaseRace: baseRace);
                        }
                    }
                }

                foreach (var metaraceRandomizer in viewModel.MetaraceRandomizerTypes)
                {
                    if (metaraceRandomizer != RandomizerTypeConstants.Set)
                    {
                        yield return GetRandomizerVerificationDataTestCase("/characters/randomizers/verify", true, metaraceRandomizerType: metaraceRandomizer, forceMetarace: true);
                        yield return GetRandomizerVerificationDataTestCase("/characters/randomizers/verify", true, metaraceRandomizerType: metaraceRandomizer, forceMetarace: false);
                    }
                    else
                    {
                        foreach (var metarace in viewModel.Metaraces)
                        {
                            yield return GetRandomizerVerificationDataTestCase("/characters/randomizers/verify", true,
                                metaraceRandomizerType: metaraceRandomizer,
                                setMetarace: metarace,
                                forceMetarace: true);
                            yield return GetRandomizerVerificationDataTestCase("/characters/randomizers/verify", true,
                                metaraceRandomizerType: metaraceRandomizer,
                                setMetarace: metarace,
                                forceMetarace: false);
                        }
                    }
                }

                yield return GetRandomizerVerificationDataTestCase("/characters/Randomizers/Verify", false,
                    alignmentRandomizerType: RandomizerTypeConstants.Set, setAlignment: "Lawful Good",
                    classNameRandomizerType: RandomizerTypeConstants.Set, setClassName: "Druid");
                yield return GetRandomizerVerificationDataTestCase("/characters/Randomizers/Verify", false,
                    alignmentRandomizerType: "Non-lawful",
                    classNameRandomizerType: RandomizerTypeConstants.Set, setClassName: "Paladin");
            }
        }

        public static TestCaseData GetRandomizerVerificationDataTestCase(
            string url,
            bool valid,
            string alignmentRandomizerType = "Any",
            string classNameRandomizerType = "Any Player",
            string levelRandomizerType = "Any",
            string baseRaceRandomizerType = "Any Base",
            string metaraceRandomizerType = "Any Meta",
            string setAlignment = "Lawful Good",
            string setClassName = "Barbarian",
            int setLevel = 0,
            bool allowLevelAdjustments = true,
            string setBaseRace = "Aasimar",
            bool forceMetarace = false,
            string setMetarace = "Ghost")
            => new TestCaseData(
                url,
                alignmentRandomizerType,
                classNameRandomizerType,
                levelRandomizerType,
                baseRaceRandomizerType,
                metaraceRandomizerType,
                setAlignment,
                setClassName,
                setLevel,
                allowLevelAdjustments,
                setBaseRace,
                forceMetarace,
                setMetarace,
                valid);

        [TestCaseSource(nameof(LeadershipGenerationData))]
        public async Task GenerateLeadership_ReturnsLeadership(string url, int leaderLevel, int leaderCharismaBonus, string leaderAnimal)
        {
            var clientId = Guid.NewGuid();
            var response = await httpClient.GetAsync($"{url}?clientId={clientId}" +
                $"&leaderLevel={leaderLevel}" +
                $"&leaderCharismaBonus={leaderCharismaBonus}" +
                $"&leaderAnimal={HttpUtility.UrlEncode(leaderAnimal)}");

            response.EnsureSuccessStatusCode();
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("application/json; charset=utf-8"));

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty
                .And.Contains("leadership")
                .And.Not.Contains("DnDGen rolled a Nat 1"));

            var body = JObject.Parse(result);
            Assert.That(body, Contains.Key("leadership"));
            Assert.That(body["leadership"], Is.Not.Null.And.Not.Empty);
        }

        public static IEnumerable LeadershipGenerationData
        {
            get
            {
                yield return new TestCaseData("/Characters/Leadership/Generate", 6, 0, string.Empty);
                yield return new TestCaseData("/characters/leadership/generate", 6, 0, string.Empty);
                yield return new TestCaseData("/characters/leadership/generate", 10, 0, string.Empty);
                yield return new TestCaseData("/characters/leadership/generate", 20, 0, string.Empty);
                yield return new TestCaseData("/characters/leadership/generate", 6, -5, string.Empty);
                yield return new TestCaseData("/characters/leadership/generate", 6, -2, string.Empty);
                yield return new TestCaseData("/characters/leadership/generate", 6, -1, string.Empty);
                yield return new TestCaseData("/characters/leadership/generate", 6, 1, string.Empty);
                yield return new TestCaseData("/characters/leadership/generate", 6, 2, string.Empty);
                yield return new TestCaseData("/characters/leadership/generate", 6, 5, string.Empty);
                yield return new TestCaseData("/characters/leadership/generate", 6, 0, "Wolf");
                yield return new TestCaseData("/characters/leadership/generate", 6, 0, "Dire Ape");
                yield return new TestCaseData("/characters/leadership/generate", 6, 0, "Raven");
                yield return new TestCaseData("/characters/leadership/generate", 6, 0, "Toad");
                yield return new TestCaseData("/characters/leadership/generate", 6, 0, "Bat");
                yield return new TestCaseData("/characters/leadership/generate", 6, 0, "Rat");
                yield return new TestCaseData("/characters/leadership/generate", 6, 0, "Ape");
                yield return new TestCaseData("/characters/leadership/generate", 6, 0, "Dire Wolf");
                yield return new TestCaseData("/characters/leadership/generate", 6, 0, "Dire Bat");
                yield return new TestCaseData("/characters/leadership/generate", 6, 0, "Dire Rat");
                yield return new TestCaseData("/characters/leadership/generate", 6, 0, "Tyrannosaurus");
            }
        }

        [TestCaseSource(nameof(CohortGenerationData))]
        public async Task GenerateCohort_ReturnsCohort(string url, int cohortScore, int leaderLevel, string leaderAlignment, string leaderClass)
        {
            var clientId = Guid.NewGuid();
            var response = await httpClient.GetAsync($"{url}?clientId={clientId}" +
                $"&cohortScore={cohortScore}" +
                $"&leaderLevel={leaderLevel}" +
                $"&leaderAlignment={HttpUtility.UrlEncode(leaderAlignment)}" +
                $"&leaderClass={HttpUtility.UrlEncode(leaderClass)}");

            response.EnsureSuccessStatusCode();
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("application/json; charset=utf-8"));

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty
                .And.Contains("cohort")
                .And.Not.Contains("DnDGen rolled a Nat 1"));

            var body = JObject.Parse(result);
            Assert.That(body, Contains.Key("cohort"));
            //Cohort can in fact be null, so this check is not needed
            //Assert.That(body["cohort"], Is.Not.Null.And.Not.Empty);
        }

        public static IEnumerable CohortGenerationData
        {
            get
            {
                yield return new TestCaseData("/Characters/Leadership/Cohort", 6, 6, "Lawful Good", "Fighter");
                yield return new TestCaseData("/characters/leadership/cohort", 1, 6, "Lawful Good", "Fighter");
                yield return new TestCaseData("/characters/leadership/cohort", 2, 6, "Lawful Good", "Fighter");
                yield return new TestCaseData("/characters/leadership/cohort", 6, 6, "Lawful Good", "Fighter");
                yield return new TestCaseData("/characters/leadership/cohort", 10, 6, "Lawful Good", "Fighter");
                yield return new TestCaseData("/characters/leadership/cohort", 20, 6, "Lawful Good", "Fighter");
                yield return new TestCaseData("/characters/leadership/cohort", 25, 6, "Lawful Good", "Fighter");
                yield return new TestCaseData("/characters/leadership/cohort", 6, 10, "Lawful Good", "Fighter");
                yield return new TestCaseData("/characters/leadership/cohort", 6, 20, "Lawful Good", "Fighter");
                yield return new TestCaseData("/characters/leadership/cohort", 6, 6, "Lawful Neutral", "Fighter");
                yield return new TestCaseData("/characters/leadership/cohort", 6, 6, "Lawful Evil", "Fighter");
                yield return new TestCaseData("/characters/leadership/cohort", 6, 6, "Neutral Good", "Fighter");
                yield return new TestCaseData("/characters/leadership/cohort", 6, 6, "True Neutral", "Fighter");
                yield return new TestCaseData("/characters/leadership/cohort", 6, 6, "Neutral Evil", "Fighter");
                yield return new TestCaseData("/characters/leadership/cohort", 6, 6, "Chaotic Good", "Fighter");
                yield return new TestCaseData("/characters/leadership/cohort", 6, 6, "Chaotic Neutral", "Fighter");
                yield return new TestCaseData("/characters/leadership/cohort", 6, 6, "Chaotic Evil", "Fighter");
                yield return new TestCaseData("/characters/leadership/cohort", 6, 6, "Chaotic Good", "Barbarian");
                yield return new TestCaseData("/characters/leadership/cohort", 6, 6, "Chaotic Good", "Bard");
                yield return new TestCaseData("/characters/leadership/cohort", 6, 6, "Lawful Good", "Cleric");
                yield return new TestCaseData("/characters/leadership/cohort", 6, 6, "Lawful Good", "Druid");
                yield return new TestCaseData("/characters/leadership/cohort", 6, 6, "Lawful Good", "Monk");
                yield return new TestCaseData("/characters/leadership/cohort", 6, 6, "Lawful Good", "Paladin");
                yield return new TestCaseData("/characters/leadership/cohort", 6, 6, "Lawful Good", "Ranger");
                yield return new TestCaseData("/characters/leadership/cohort", 6, 6, "Lawful Good", "Rogue");
                yield return new TestCaseData("/characters/leadership/cohort", 6, 6, "Lawful Good", "Sorcerer");
                yield return new TestCaseData("/characters/leadership/cohort", 6, 6, "Lawful Good", "Wizard");
            }
        }

        [TestCaseSource(nameof(FollowerGenerationData))]
        public async Task GenerateFollower_ReturnsFollower(string url, int followerLevel, string leaderAlignment, string leaderClass)
        {
            var clientId = Guid.NewGuid();
            var response = await httpClient.GetAsync($"{url}?clientId={clientId}" +
                $"&followerLevel={followerLevel}" +
                $"&leaderAlignment={HttpUtility.UrlEncode(leaderAlignment)}" +
                $"&leaderClass={HttpUtility.UrlEncode(leaderClass)}");

            response.EnsureSuccessStatusCode();
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("application/json; charset=utf-8"));

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty
                .And.Contains("follower")
                .And.Not.Contains("DnDGen rolled a Nat 1"));

            var body = JObject.Parse(result);
            Assert.That(body, Contains.Key("follower"));
            Assert.That(body["follower"], Is.Not.Null.And.Not.Empty);
        }

        public static IEnumerable FollowerGenerationData
        {
            get
            {
                yield return new TestCaseData("/Characters/Leadership/Follower", 1, "Lawful Good", "Fighter");
                yield return new TestCaseData("/characters/leadership/follower", 1, "Lawful Good", "Fighter");
                yield return new TestCaseData("/characters/leadership/follower", 2, "Lawful Good", "Fighter");
                yield return new TestCaseData("/characters/leadership/follower", 6, "Lawful Good", "Fighter");
                yield return new TestCaseData("/characters/leadership/follower", 1, "Lawful Neutral", "Fighter");
                yield return new TestCaseData("/characters/leadership/follower", 1, "Lawful Evil", "Fighter");
                yield return new TestCaseData("/characters/leadership/follower", 1, "Neutral Good", "Fighter");
                yield return new TestCaseData("/characters/leadership/follower", 1, "True Neutral", "Fighter");
                yield return new TestCaseData("/characters/leadership/follower", 1, "Neutral Evil", "Fighter");
                yield return new TestCaseData("/characters/leadership/follower", 1, "Chaotic Good", "Fighter");
                yield return new TestCaseData("/characters/leadership/follower", 1, "Chaotic Neutral", "Fighter");
                yield return new TestCaseData("/characters/leadership/follower", 1, "Chaotic Evil", "Fighter");
                yield return new TestCaseData("/characters/leadership/follower", 1, "Chaotic Good", "Barbarian");
                yield return new TestCaseData("/characters/leadership/follower", 1, "Chaotic Good", "Bard");
                yield return new TestCaseData("/characters/leadership/follower", 1, "Lawful Good", "Cleric");
                yield return new TestCaseData("/characters/leadership/follower", 1, "Lawful Good", "Druid");
                yield return new TestCaseData("/characters/leadership/follower", 1, "Lawful Good", "Monk");
                yield return new TestCaseData("/characters/leadership/follower", 1, "Lawful Good", "Paladin");
                yield return new TestCaseData("/characters/leadership/follower", 1, "Lawful Good", "Ranger");
                yield return new TestCaseData("/characters/leadership/follower", 1, "Lawful Good", "Rogue");
                yield return new TestCaseData("/characters/leadership/follower", 1, "Lawful Good", "Sorcerer");
                yield return new TestCaseData("/characters/leadership/follower", 1, "Lawful Good", "Wizard");
            }
        }
    }
}
