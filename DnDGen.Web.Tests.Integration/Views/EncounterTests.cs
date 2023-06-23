using DnDGen.Web.Models;
using Newtonsoft.Json.Linq;
using NUnit.Framework;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;

namespace DnDGen.Web.Tests.Integration.Views
{
    [TestFixture]
    internal class EncounterTests : EndToEndTests
    {
        [TestCase("/encounter")]
        [TestCase("/Encounter")]
        public async Task Encounter_Index_ReturnsEncounterPage(string url)
        {
            var response = await httpClient.GetAsync(url);

            response.EnsureSuccessStatusCode();
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("text/html; charset=utf-8"));

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty
                .And.Contains("EncounterGen")
                .And.Not.Contains("DnDGen rolled a Nat 1"));
        }

        [TestCaseSource(nameof(EncounterGenerationData))]
        public async Task Generate_ReturnsEncounter(string url,
            string environment,
            int level,
            string temperature,
            string timeOfDay,
            bool allowAquatic,
            bool allowUnderground,
            IEnumerable<string> creatureTypes)
        {
            var clientId = Guid.NewGuid();
            var fullUrl = $"{url}?clientId={clientId}" +
                $"&environment={HttpUtility.UrlEncode(environment)}" +
                $"&level={level}" +
                $"&temperature={HttpUtility.UrlEncode(temperature)}" +
                $"&timeOfDay={HttpUtility.UrlEncode(timeOfDay)}" +
                $"&allowAquatic={allowAquatic}" +
                $"&allowUnderground={allowUnderground}";

            foreach (var creatureType in creatureTypes)
            {
                fullUrl += $"&creatureTypeFilters={HttpUtility.UrlEncode(creatureType)}";
            }

            var response = await httpClient.GetAsync(fullUrl);

            response.EnsureSuccessStatusCode();
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("application/json; charset=utf-8"));

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty
                .And.Contains("encounter")
                .And.Not.Contains("DnDGen rolled a Nat 1"));

            var body = JObject.Parse(result);
            Assert.That(body, Contains.Key("encounter"));
            Assert.That(body["encounter"], Is.Not.Null.And.Not.Empty);
        }

        public static IEnumerable EncounterGenerationData
        {
            get
            {
                yield return GetEncounterGenerationTestCase("/Encounter/Generate");

                var viewModel = new EncounterViewModel();

                yield return GetEncounterGenerationTestCase("/encounter/generate", level: 1);
                yield return GetEncounterGenerationTestCase("/encounter/generate", level: 2);
                yield return GetEncounterGenerationTestCase("/encounter/generate", level: 10);
                yield return GetEncounterGenerationTestCase("/encounter/generate", level: 20);
                yield return GetEncounterGenerationTestCase("/encounter/generate", allowAquatic: true);
                yield return GetEncounterGenerationTestCase("/encounter/generate", allowAquatic: false);
                yield return GetEncounterGenerationTestCase("/encounter/generate", allowUnderground: true);
                yield return GetEncounterGenerationTestCase("/encounter/generate", allowUnderground: false);

                foreach (var environment in viewModel.Environments)
                {
                    yield return GetEncounterGenerationTestCase("/encounter/generate", environment: environment);
                }

                foreach (var time in viewModel.TimesOfDay)
                {
                    yield return GetEncounterGenerationTestCase("/encounter/generate", timeOfDay: time);
                }

                foreach (var temperature in viewModel.Temperatures)
                {
                    yield return GetEncounterGenerationTestCase("/encounter/generate", temperature: temperature);
                }

                foreach (var creatureType in viewModel.CreatureTypes)
                {
                    if (creatureType == "Aberration" || creatureType == "Ooze")
                    {
                        yield return GetEncounterGenerationTestCase("/encounter/generate", environment: "Underground", level: 7, creatureTypes: new[] { creatureType });
                    }
                    else if (creatureType == "Giant")
                    {
                        yield return GetEncounterGenerationTestCase("/encounter/generate", environment: "Hills", level: 7, creatureTypes: new[] { creatureType });
                    }
                    else if (creatureType == "Monstrous Humanoid" || creatureType == "Fey" || creatureType == "Plant")
                    {
                        yield return GetEncounterGenerationTestCase("/encounter/generate", level: 3, creatureTypes: new[] { creatureType });
                    }
                    else
                    {
                        yield return GetEncounterGenerationTestCase("/encounter/generate", creatureTypes: new[] { creatureType });
                    }
                }

                yield return GetEncounterGenerationTestCase("/encounter/generate", creatureTypes: new[] { viewModel.CreatureTypes.First(), viewModel.CreatureTypes.Last() });
                yield return GetEncounterGenerationTestCase("/encounter/generate", creatureTypes: viewModel.CreatureTypes.ToArray());
            }
        }

        public static TestCaseData GetEncounterGenerationTestCase(
            string url,
            string environment = "Forest",
            int level = 1,
            string temperature = "Temperate",
            string timeOfDay = "Day",
            bool allowAquatic = false,
            bool allowUnderground = false,
            params string[] creatureTypes)
            => new TestCaseData(url, environment, level, temperature, timeOfDay, allowAquatic, allowUnderground, creatureTypes);

        [TestCaseSource(nameof(EncounterValidationData))]
        public async Task Validate_ReturnsValid(string url, bool valid,
            string environment,
            int level,
            string temperature,
            string timeOfDay,
            bool allowAquatic,
            bool allowUnderground,
            IEnumerable<string> creatureTypes)
        {
            var clientId = Guid.NewGuid();
            var fullUrl = $"{url}?clientId={clientId}" +
                $"&environment={HttpUtility.UrlEncode(environment)}" +
                $"&level={level}" +
                $"&temperature={HttpUtility.UrlEncode(temperature)}" +
                $"&timeOfDay={HttpUtility.UrlEncode(timeOfDay)}" +
                $"&allowAquatic={allowAquatic}" +
                $"&allowUnderground={allowUnderground}";

            foreach (var creatureType in creatureTypes)
            {
                fullUrl += $"&creatureTypeFilters={HttpUtility.UrlEncode(creatureType)}";
            }

            var response = await httpClient.GetAsync(fullUrl);

            response.EnsureSuccessStatusCode();
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("application/json; charset=utf-8"));

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty
                .And.Contains("isValid")
                .And.Not.Contains("DnDGen rolled a Nat 1"));

            var body = JObject.Parse(result);
            Assert.That(body, Contains.Key("isValid").And.Not.ContainKey("error"));
            Assert.That(Convert.ToBoolean(body["isValid"]), Is.EqualTo(valid));
        }

        public static IEnumerable EncounterValidationData
        {
            get
            {
                yield return GetEncounterValidationTestCase("/Encounter/Validate", true);

                var viewModel = new EncounterViewModel();

                yield return GetEncounterValidationTestCase("/encounter/validate", true, level: 1);
                yield return GetEncounterValidationTestCase("/encounter/validate", true, level: 2);
                yield return GetEncounterValidationTestCase("/encounter/validate", true, level: 10);
                yield return GetEncounterValidationTestCase("/encounter/validate", true, level: 20);
                yield return GetEncounterValidationTestCase("/encounter/validate", true, allowAquatic: true);
                yield return GetEncounterValidationTestCase("/encounter/validate", true, allowAquatic: false);
                yield return GetEncounterValidationTestCase("/encounter/validate", true, allowUnderground: true);
                yield return GetEncounterValidationTestCase("/encounter/validate", true, allowUnderground: false);

                foreach (var environment in viewModel.Environments)
                {
                    yield return GetEncounterValidationTestCase("/encounter/validate", true, environment: environment);
                }

                foreach (var time in viewModel.TimesOfDay)
                {
                    yield return GetEncounterValidationTestCase("/encounter/validate", true, timeOfDay: time);
                }

                foreach (var temperature in viewModel.Temperatures)
                {
                    yield return GetEncounterValidationTestCase("/encounter/validate", true, temperature: temperature);
                }

                foreach (var creatureType in viewModel.CreatureTypes)
                {
                    if (creatureType == "Aberration" || creatureType == "Ooze")
                    {
                        yield return GetEncounterValidationTestCase("/encounter/validate", false, creatureTypes: new[] { creatureType });
                        yield return GetEncounterValidationTestCase("/encounter/validate", false, environment: "Underground", creatureTypes: new[] { creatureType });
                        yield return GetEncounterValidationTestCase("/encounter/validate", false, level: 7, creatureTypes: new[] { creatureType });
                        yield return GetEncounterValidationTestCase("/encounter/validate", true,
                            environment: "Underground",
                            level: 7,
                            creatureTypes: new[] { creatureType });
                    }
                    else if (creatureType == "Giant")
                    {
                        yield return GetEncounterValidationTestCase("/encounter/validate", false, creatureTypes: new[] { creatureType });
                        yield return GetEncounterValidationTestCase("/encounter/validate", false, environment: "Hills", creatureTypes: new[] { creatureType });
                        yield return GetEncounterValidationTestCase("/encounter/validate", false, level: 7, creatureTypes: new[] { creatureType });
                        yield return GetEncounterValidationTestCase("/encounter/validate", true,
                            environment: "Hills",
                            level: 7,
                            creatureTypes: new[] { creatureType });
                    }
                    else if (creatureType == "Monstrous Humanoid" || creatureType == "Fey" || creatureType == "Plant")
                    {
                        yield return GetEncounterValidationTestCase("/encounter/validate", false, creatureTypes: new[] { creatureType });
                        yield return GetEncounterValidationTestCase("/encounter/validate", true, level: 3, creatureTypes: new[] { creatureType });
                    }
                    else
                    {
                        yield return GetEncounterValidationTestCase("/encounter/validate", true, creatureTypes: new[] { creatureType });
                    }
                }

                yield return GetEncounterValidationTestCase("/encounter/validate", true, creatureTypes: new[] { viewModel.CreatureTypes.First(), viewModel.CreatureTypes.Last() });
                yield return GetEncounterValidationTestCase("/encounter/validate", true, creatureTypes: viewModel.CreatureTypes.ToArray());

                yield return GetEncounterValidationTestCase("/encounter/validate", false, level: 20, creatureTypes: new[] { "Vermin", "Animal", "Ooze" });
                yield return GetEncounterValidationTestCase("/encounter/validate", false, environment: "Aquatic", creatureTypes: new[] { "Plant" });
            }
        }

        public static TestCaseData GetEncounterValidationTestCase(
            string url,
            bool valid,
            string environment = "Forest",
            int level = 1,
            string temperature = "Temperate",
            string timeOfDay = "Day",
            bool allowAquatic = false,
            bool allowUnderground = false,
            params string[] creatureTypes)
            => new TestCaseData(url, valid, environment, level, temperature, timeOfDay, allowAquatic, allowUnderground, creatureTypes);
    }
}
