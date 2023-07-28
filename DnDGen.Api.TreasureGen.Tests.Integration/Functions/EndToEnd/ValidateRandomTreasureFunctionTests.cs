using DnDGen.Api.TreasureGen.Models;
using DnDGen.TreasureGen;
using System.Collections;
using System.Net;

namespace DnDGen.Api.TreasureGen.Tests.Integration.Functions.EndToEnd
{
    public class ValidateRandomTreasureFunctionTests : EndToEndTests
    {
        [TestCaseSource(nameof(TreasureValidationData))]
        public async Task ValidateRandom_ReturnsValidity(string route, string treasureType, int level, bool valid)
        {
            var baseUri = new Uri(localFunctions.BaseUrl);
            var uri = new Uri(baseUri, $"{route}?treasureType={treasureType}&level={level}");
            var response = await httpClient.GetAsync(uri);

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK), uri.AbsoluteUri);
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("application/json; charset=utf-8"), uri.AbsoluteUri);

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.EqualTo(valid.ToString()), uri.AbsoluteUri);
        }

        public static IEnumerable TreasureValidationData
        {
            get
            {
                yield return new TestCaseData("/API/V1/Generate/Random/Validate", TreasureTypes.Treasure.ToString(), 20, true);
                yield return new TestCaseData("/API/V1/Generate/Random/Validate", "Coolpoints", 20, false);

                var treasureTypes = Enum.GetValues(typeof(TreasureTypes));

                foreach (var treasureType in treasureTypes)
                {
                    yield return new TestCaseData("/api/v1/generate/random/validate", treasureType.ToString(), LevelLimits.Minimum - 1, false);
                    yield return new TestCaseData("/api/v1/generate/random/validate", treasureType.ToString(), LevelLimits.Minimum, true);
                    yield return new TestCaseData("/api/v1/generate/random/validate", treasureType.ToString(), 2, true);
                    yield return new TestCaseData("/api/v1/generate/random/validate", treasureType.ToString(), 10, true);
                    yield return new TestCaseData("/api/v1/generate/random/validate", treasureType.ToString(), 20, true);
                    yield return new TestCaseData("/api/v1/generate/random/validate", treasureType.ToString().ToUpper(), 20, false);
                    yield return new TestCaseData("/api/v1/generate/random/validate", treasureType.ToString().ToLower(), 20, false);
                    yield return new TestCaseData("/api/v1/generate/random/validate", ((int)treasureType).ToString(), 20, true);
                    yield return new TestCaseData("/api/v1/generate/random/validate", treasureType.ToString(), LevelLimits.Maximum, true);
                    yield return new TestCaseData("/api/v1/generate/random/validate", treasureType.ToString(), LevelLimits.Maximum + 1, false);
                }
            }
        }
    }
}