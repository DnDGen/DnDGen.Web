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
    internal class DungeonTests : EndToEndTests
    {
        [TestCase("/dungeon")]
        [TestCase("/Dungeon")]
        public async Task Dungeon_Index_ReturnsDungeonPage(string url)
        {
            var response = await httpClient.GetAsync(url);

            response.EnsureSuccessStatusCode();
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("text/html; charset=utf-8"));

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty
                .And.Contains("DungeonGen")
                .And.Not.Contains("DnDGen rolled a Nat 1"));
        }

        [TestCaseSource(nameof(DungeonGenerationFromHallData))]
        [TestCaseSource(nameof(DungeonGenerationFromDoorData))]
        public async Task Generate_ReturnsDungeonArea(string url,
            int dungeonLevel,
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
                $"&dungeonLevel={dungeonLevel}" +
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
                .And.Contains("areas")
                .And.Not.Contains("DnDGen rolled a Nat 1"));

            var body = JObject.Parse(result);
            Assert.That(body, Contains.Key("areas"));
            Assert.That(body["areas"], Is.Not.Null.And.Not.Empty);
        }

        public static IEnumerable DungeonGenerationFromHallData
        {
            get
            {
                yield return GetDungeonGenerationTestCase("/Dungeon/GenerateFromHall");
                yield return GetDungeonGenerationTestCase("/dungeon/generateFromHall");

                var viewModel = new EncounterViewModel();

                yield return GetDungeonGenerationTestCase("/dungeon/generatefromhall", dungeonLevel: 1);
                yield return GetDungeonGenerationTestCase("/dungeon/generatefromhall", dungeonLevel: 2);
                yield return GetDungeonGenerationTestCase("/dungeon/generatefromhall", dungeonLevel: 10);
                yield return GetDungeonGenerationTestCase("/dungeon/generatefromhall", dungeonLevel: 20);
                yield return GetDungeonGenerationTestCase("/dungeon/generatefromhall", level: 1);
                yield return GetDungeonGenerationTestCase("/dungeon/generatefromhall", level: 2);
                yield return GetDungeonGenerationTestCase("/dungeon/generatefromhall", level: 10);
                yield return GetDungeonGenerationTestCase("/dungeon/generatefromhall", level: 20);
                yield return GetDungeonGenerationTestCase("/dungeon/generatefromhall", allowAquatic: true);
                yield return GetDungeonGenerationTestCase("/dungeon/generatefromhall", allowAquatic: false);
                yield return GetDungeonGenerationTestCase("/dungeon/generatefromhall", allowUnderground: true);
                yield return GetDungeonGenerationTestCase("/dungeon/generatefromhall", allowUnderground: false);

                foreach (var environment in viewModel.Environments)
                {
                    yield return GetDungeonGenerationTestCase("/dungeon/generatefromhall", environment: environment);
                }

                foreach (var time in viewModel.TimesOfDay)
                {
                    yield return GetDungeonGenerationTestCase("/dungeon/generatefromhall", timeOfDay: time);
                }

                foreach (var temperature in viewModel.Temperatures)
                {
                    yield return GetDungeonGenerationTestCase("/dungeon/generatefromhall", temperature: temperature);
                }

                foreach (var creatureType in viewModel.CreatureTypes)
                {
                    if (creatureType == "Aberration" || creatureType == "Ooze")
                    {
                        yield return GetDungeonGenerationTestCase("/dungeon/generatefromhall", environment: "Underground", level: 7, creatureTypes: new[] { creatureType });
                    }
                    else if (creatureType == "Giant")
                    {
                        yield return GetDungeonGenerationTestCase("/dungeon/generatefromhall", environment: "Hills", level: 7, creatureTypes: new[] { creatureType });
                    }
                    else if (creatureType == "Monstrous Humanoid" || creatureType == "Fey" || creatureType == "Plant")
                    {
                        yield return GetDungeonGenerationTestCase("/dungeon/generatefromhall", level: 3, creatureTypes: new[] { creatureType });
                    }
                    else
                    {
                        yield return GetDungeonGenerationTestCase("/dungeon/generatefromhall", creatureTypes: new[] { creatureType });
                    }
                }

                yield return GetDungeonGenerationTestCase("/dungeon/generatefromhall", creatureTypes: new[] { viewModel.CreatureTypes.First(), viewModel.CreatureTypes.Last() });
                yield return GetDungeonGenerationTestCase("/dungeon/generatefromhall", creatureTypes: viewModel.CreatureTypes.ToArray());
            }
        }

        public static TestCaseData GetDungeonGenerationTestCase(
            string url,
            int dungeonLevel = 1,
            string environment = "Forest",
            int level = 1,
            string temperature = "Temperate",
            string timeOfDay = "Day",
            bool allowAquatic = false,
            bool allowUnderground = false,
            params string[] creatureTypes)
            => new TestCaseData(url, dungeonLevel, environment, level, temperature, timeOfDay, allowAquatic, allowUnderground, creatureTypes);

        public static IEnumerable DungeonGenerationFromDoorData
        {
            get
            {
                yield return GetDungeonGenerationTestCase("/Dungeon/GenerateFromDoor");
                yield return GetDungeonGenerationTestCase("/dungeon/generateFromDoor");

                var viewModel = new EncounterViewModel();

                yield return GetDungeonGenerationTestCase("/dungeon/generatefromdoor", dungeonLevel: 1);
                yield return GetDungeonGenerationTestCase("/dungeon/generatefromdoor", dungeonLevel: 2);
                yield return GetDungeonGenerationTestCase("/dungeon/generatefromdoor", dungeonLevel: 10);
                yield return GetDungeonGenerationTestCase("/dungeon/generatefromdoor", dungeonLevel: 20);
                yield return GetDungeonGenerationTestCase("/dungeon/generatefromdoor", level: 1);
                yield return GetDungeonGenerationTestCase("/dungeon/generatefromdoor", level: 2);
                yield return GetDungeonGenerationTestCase("/dungeon/generatefromdoor", level: 10);
                yield return GetDungeonGenerationTestCase("/dungeon/generatefromdoor", level: 20);
                yield return GetDungeonGenerationTestCase("/dungeon/generatefromdoor", allowAquatic: true);
                yield return GetDungeonGenerationTestCase("/dungeon/generatefromdoor", allowAquatic: false);
                yield return GetDungeonGenerationTestCase("/dungeon/generatefromdoor", allowUnderground: true);
                yield return GetDungeonGenerationTestCase("/dungeon/generatefromdoor", allowUnderground: false);

                foreach (var environment in viewModel.Environments)
                {
                    yield return GetDungeonGenerationTestCase("/dungeon/generatefromdoor", environment: environment);
                }

                foreach (var time in viewModel.TimesOfDay)
                {
                    yield return GetDungeonGenerationTestCase("/dungeon/generatefromdoor", timeOfDay: time);
                }

                foreach (var temperature in viewModel.Temperatures)
                {
                    yield return GetDungeonGenerationTestCase("/dungeon/generatefromdoor", temperature: temperature);
                }

                foreach (var creatureType in viewModel.CreatureTypes)
                {
                    if (creatureType == "Aberration" || creatureType == "Ooze")
                    {
                        yield return GetDungeonGenerationTestCase("/dungeon/generatefromdoor", environment: "Underground", level: 7, creatureTypes: new[] { creatureType });
                    }
                    else if (creatureType == "Giant")
                    {
                        yield return GetDungeonGenerationTestCase("/dungeon/generatefromdoor", environment: "Hills", level: 7, creatureTypes: new[] { creatureType });
                    }
                    else if (creatureType == "Monstrous Humanoid" || creatureType == "Fey" || creatureType == "Plant")
                    {
                        yield return GetDungeonGenerationTestCase("/dungeon/generatefromdoor", level: 3, creatureTypes: new[] { creatureType });
                    }
                    else
                    {
                        yield return GetDungeonGenerationTestCase("/dungeon/generatefromdoor", creatureTypes: new[] { creatureType });
                    }
                }

                yield return GetDungeonGenerationTestCase("/dungeon/generatefromdoor", creatureTypes: new[] { viewModel.CreatureTypes.First(), viewModel.CreatureTypes.Last() });
                yield return GetDungeonGenerationTestCase("/dungeon/generatefromdoor", creatureTypes: viewModel.CreatureTypes.ToArray());
            }
        }
    }
}
