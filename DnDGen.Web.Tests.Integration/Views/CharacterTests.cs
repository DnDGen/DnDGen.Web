using Newtonsoft.Json.Linq;
using NUnit.Framework;
using System;
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

        [TestCase("/character/generate",
            "Any",
            "Any Player",
            "Any",
            "Any Base",
            "Any Meta",
            "Raw",
            "Lawful Good",
            "Barbarian",
            0,
            true,
            "Aasimar",
            false,
            "Ghost",
            0,
            0,
            0,
            0,
            0,
            0,
            true)]
        [TestCase("/Character/Generate",
            "Any",
            "Any Player",
            "Any",
            "Any Base",
            "Any Meta",
            "Raw",
            "Lawful Good",
            "Barbarian",
            0,
            true,
            "Aasimar",
            false,
            "Ghost",
            0,
            0,
            0,
            0,
            0,
            0,
            true)]
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
                .And.Contains("treasure")
                .And.Not.Contains("DnDGen rolled a Nat 1"));

            var body = JObject.Parse(result);
            Assert.That(body, Contains.Key("character"));
            Assert.That(body["character"], Is.Not.Null.And.Not.Empty);
        }
    }
}
