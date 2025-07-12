using DnDGen.Api.Tests.Integration.Helpers;
using DnDGen.Api.TreasureGen.Dependencies;
using DnDGen.Api.TreasureGen.Functions;
using DnDGen.Api.TreasureGen.Models;
using DnDGen.TreasureGen;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Collections;
using System.Net;

namespace DnDGen.Api.TreasureGen.Tests.Integration.Functions
{
    public class GenerateRandomTreasureFunctionTests : IntegrationTests
    {
        private GenerateRandomTreasureFunction function;

        [SetUp]
        public void Setup()
        {
            var loggerFactory = new LoggerFactory();
            var dependencyFactory = GetService<IDependencyFactory>();
            function = new GenerateRandomTreasureFunction(loggerFactory, dependencyFactory);
        }

        [TestCaseSource(nameof(TreasureGenerationData))]
        public async Task GenerateRandom_ReturnsTreasure(string treasureType, int level)
        {
            var url = GetUrl(treasureType, level);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request, treasureType, level);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var treasure = StreamHelper.Read<Treasure>(response.Body);
            Assert.That(treasure, Is.Not.Null);
            //HACK: Generating treasure does not guarantee you would get treasure, so IsAny can be True or False
            Assert.That(treasure.IsAny, Is.True.Or.False);

            foreach (var item in treasure.Items)
            {
                Assert.That(item, Is.Not.Null);
                Assert.That(item.Name, Is.Not.Empty);
                Assert.That(item.ItemType, Is.Not.Empty, item.Name);
                Assert.That(item.Quantity, Is.Positive, item.Name);
            }
        }

        private string GetUrl(string treasureType, int level, string query = "")
        {
            var url = $"https://treasure.dndgen.com/api/v1/{treasureType}/level/{level}/generate";
            if (query.Any())
                url += "?" + query.TrimStart('?');

            return url;
        }

        public static IEnumerable TreasureGenerationData
        {
            get
            {
                var treasureTypes = Enum.GetValues(typeof(TreasureTypes));

                foreach (var treasureType in treasureTypes)
                {
                    yield return new TestCaseData(treasureType.ToString(), LevelLimits.Minimum);
                    yield return new TestCaseData(treasureType.ToString(), 2);
                    yield return new TestCaseData(treasureType.ToString(), 10);
                    yield return new TestCaseData(treasureType.ToString(), 20);
                    yield return new TestCaseData(treasureType.ToString().ToUpper(), 20);
                    yield return new TestCaseData(treasureType.ToString().ToLower(), 20);
                    yield return new TestCaseData(((int)treasureType).ToString(), 20);
                    yield return new TestCaseData(treasureType.ToString(), LevelLimits.Maximum_Standard);
                    yield return new TestCaseData(treasureType.ToString(), LevelLimits.Maximum_Epic);
                }
            }
        }
    }
}