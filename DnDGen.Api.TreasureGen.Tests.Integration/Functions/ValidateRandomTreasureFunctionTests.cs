using DnDGen.Api.Tests.Integration.Helpers;
using DnDGen.Api.TreasureGen.Functions;
using DnDGen.Api.TreasureGen.Models;
using DnDGen.TreasureGen;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Collections;
using System.Net;

namespace DnDGen.Api.TreasureGen.Tests.Integration.Functions
{
    public class ValidateRandomTreasureFunctionTests : IntegrationTests
    {
        private ValidateRandomTreasureFunction function;

        [SetUp]
        public void Setup()
        {
            var loggerFactory = new LoggerFactory();
            function = new ValidateRandomTreasureFunction(loggerFactory);
        }

        [TestCaseSource(nameof(TreasureValidationData))]
        public async Task ValidateRandom_ReturnsValidity(string treasureType, int level, bool valid)
        {
            var url = GetUrl(treasureType, level);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request, treasureType, level);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var validity = StreamHelper.Read<bool>(response.Body);
            Assert.That(validity, Is.EqualTo(valid));
        }

        private string GetUrl(string version, string treasureType, int level, string query = "")
        {
            var url = $"https://treasure.dndgen.com/api/{version}/{treasureType}/level/{level}/validate";
            if (query.Any())
                url += "?" + query.TrimStart('?');

            return url;
        }

        public static IEnumerable TreasureValidationData
        {
            get
            {
                yield return new TestCaseData("Coolpoints", 20, false);

                var treasureTypes = Enum.GetValues(typeof(TreasureTypes));

                foreach (var treasureType in treasureTypes)
                {
                    yield return new TestCaseData(treasureType.ToString(), LevelLimits.Minimum - 1, false);
                    yield return new TestCaseData(treasureType.ToString(), LevelLimits.Minimum, true);
                    yield return new TestCaseData(treasureType.ToString(), 2, true);
                    yield return new TestCaseData(treasureType.ToString(), 10, true);
                    yield return new TestCaseData(treasureType.ToString(), 20, true);
                    yield return new TestCaseData(treasureType.ToString().ToUpper(), 20, true);
                    yield return new TestCaseData(treasureType.ToString().ToLower(), 20, true);
                    yield return new TestCaseData(((int)treasureType).ToString(), 20, true);
                    yield return new TestCaseData(treasureType.ToString(), LevelLimits.Maximum_Standard, true);
                    yield return new TestCaseData(treasureType.ToString(), LevelLimits.Maximum_Standard + 1, false);
                    yield return new TestCaseData(treasureType.ToString(), LevelLimits.Maximum_Epic, true);
                    yield return new TestCaseData(treasureType.ToString(), LevelLimits.Maximum_Epic + 1, false);
                }
            }
        }
    }
}