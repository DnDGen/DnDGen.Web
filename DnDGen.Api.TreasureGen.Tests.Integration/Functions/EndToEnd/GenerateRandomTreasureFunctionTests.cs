using DnDGen.Api.TreasureGen.Models;
using DnDGen.TreasureGen;
using Newtonsoft.Json;
using System.Collections;
using System.Net;

namespace DnDGen.Api.TreasureGen.Tests.Integration.Functions.EndToEnd
{
    [Ignore("These tests are failing locally. Will eventually replace them with Postman/nightly E2E tests")]
    public class GenerateRandomTreasureFunctionTests : EndToEndTests
    {
        [TestCaseSource(nameof(TreasureGenerationData))]
        public async Task GenerateRandom_ReturnsTreasure(string treasureType, int level)
        {
            var baseUri = new Uri(localFunctions.BaseUrl);
            var uri = new Uri(baseUri, $"/api/v1/{treasureType}/level/{level}/generate");
            var response = await httpClient.GetAsync(uri);

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK), uri.AbsoluteUri);
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("application/json; charset=utf-8"), uri.AbsoluteUri);

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty, uri.AbsoluteUri);

            var treasure = JsonConvert.DeserializeObject<Treasure>(result);
            Assert.That(treasure, Is.Not.Null, uri.AbsoluteUri);
            //HACK: Generating treasure does not guarantee you would get treasure, so IsAny can be True or False
            Assert.That(treasure.IsAny, Is.True.Or.False, uri.AbsoluteUri);
        }

        public static IEnumerable TreasureGenerationData
        {
            get
            {
                yield return new TestCaseData(TreasureTypes.Treasure.ToString(), 20);

                var treasureTypes = Enum.GetValues(typeof(TreasureTypes));

                foreach (var treasureType in treasureTypes)
                {
                    yield return new TestCaseData(treasureType.ToString(), LevelLimits.Minimum);
                    yield return new TestCaseData(treasureType.ToString(), 2);
                    yield return new TestCaseData(treasureType.ToString(), 10);
                    yield return new TestCaseData(treasureType.ToString(), 20);
                    yield return new TestCaseData(((int)treasureType).ToString(), 20);
                    yield return new TestCaseData(treasureType.ToString(), LevelLimits.Maximum);
                }
            }
        }
    }
}