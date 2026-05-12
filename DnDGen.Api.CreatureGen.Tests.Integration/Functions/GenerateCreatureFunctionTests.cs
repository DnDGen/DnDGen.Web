using DnDGen.Api.CreatureGen.Dependencies;
using DnDGen.Api.CreatureGen.Functions;
using DnDGen.Api.CreatureGen.Models;
using DnDGen.Api.Tests.Integration.Helpers;
using DnDGen.CreatureGen.Creatures;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Collections;
using System.Net;
using System.Web;

namespace DnDGen.Api.CreatureGen.Tests.Integration.Functions
{
    [TestFixture]
    public class GenerateCreatureFunctionTests : IntegrationTests
    {
        private GenerateCreatureFunction function;

        [SetUp]
        public void Setup()
        {
            var loggerFactory = new LoggerFactory();
            var dependencyFactory = GetService<IDependencyFactory>();
            function = new GenerateCreatureFunction(loggerFactory, dependencyFactory);
        }

        private static IEnumerable CreatureNames => CreatureSpecifications.Creatures.Select(c => new TestCaseData(c));

        [TestCaseSource(nameof(CreatureNames))]
        public async Task GenerateCreature_ReturnsCreature_WithValidCreatureName(string creatureName)
        {
            var url = GetUrl(creatureName);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request, creatureName);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var creature = StreamHelper.Read<Creature>(response.Body);
            Assert.That(creature, Is.Not.Null);
            using (Assert.EnterMultipleScope())
            {
                Assert.That(creature.Name, Is.EqualTo(creatureName));
                Assert.That(creature.Summary, Contains.Substring(creatureName));
            }
        }

        [Test]
        public async Task GenerateCreature_ReturnsCreature_WithValidCreatureName_CaseInsensitive()
        {
            var url = GetUrl(CreatureConstants.Goblin.ToUpper());
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request, CreatureConstants.Goblin.ToUpper());

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var creature = StreamHelper.Read<Creature>(response.Body);
            Assert.That(creature, Is.Not.Null);
            using (Assert.EnterMultipleScope())
            {
                Assert.That(creature.Name, Is.EqualTo(CreatureConstants.Goblin));
                Assert.That(creature.Summary, Is.EqualTo(CreatureConstants.Goblin));
            }
        }

        private static IEnumerable TemplateNames => CreatureSpecifications.Templates
            .Except([CreatureConstants.Templates.None, CreatureConstants.Templates.Lich])
            .Select(c => new TestCaseData(c));

        [TestCaseSource(nameof(TemplateNames))]
        public async Task GenerateCreature_ReturnsCreature_WithValidTemplate(string templateName)
        {
            var creatureName = CreatureConstants.Human;

            if (templateName == CreatureConstants.Templates.Lycanthrope_Rat_Afflicted || templateName == CreatureConstants.Templates.Lycanthrope_Rat_Natural)
                creatureName = CreatureConstants.Halfling_Lightfoot;
            else if (templateName == CreatureConstants.Templates.Vampire)
                creatureName = CreatureConstants.Minotaur;

            var url = GetUrl(creatureName, $"templates={HttpUtility.UrlEncode(templateName)}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request, creatureName);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var creature = StreamHelper.Read<Creature>(response.Body);
            Assert.That(creature, Is.Not.Null);
            using (Assert.EnterMultipleScope())
            {
                Assert.That(creature.Name, Is.EqualTo(creatureName));
                Assert.That(creature.Templates, Is.EqualTo([templateName]));
                Assert.That(creature.Summary, Contains.Substring(creatureName)
                    .And.Contains(templateName));
            }
        }

        [Test]
        public async Task GenerateCreature_ReturnsCreature_WithValidTemplate_None()
        {
            var url = GetUrl(CreatureConstants.Human, $"templates={CreatureConstants.Templates.None}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request, CreatureConstants.Human);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var creature = StreamHelper.Read<Creature>(response.Body);
            Assert.That(creature, Is.Not.Null);
            using (Assert.EnterMultipleScope())
            {
                Assert.That(creature.Name, Is.EqualTo(CreatureConstants.Human));
                Assert.That(creature.Templates, Is.Empty);
                Assert.That(creature.Summary, Is.EqualTo(CreatureConstants.Human));
            }
        }

        //INFO: This is because Liches can only be generated as characters, and the API only supports non-character creatures
        [Test]
        public async Task GenerateRandomCreature_ReturnsBadRequest_WithValidTemplate_Lich()
        {
            var url = GetUrl(CreatureConstants.Human, $"templates={CreatureConstants.Templates.Lich}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request, CreatureConstants.Human);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
                Assert.That(response.Body, Is.Not.Null);
            }

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        [Test]
        public async Task GenerateCreature_ReturnsCreature_WithMultipleTemplates()
        {
            var query = $"templates={HttpUtility.UrlEncode(CreatureConstants.Templates.HalfDragon_Gold)}";
            query += $"&templates={HttpUtility.UrlEncode(CreatureConstants.Templates.CelestialCreature)}";
            var url = GetUrl(CreatureConstants.Lammasu, query);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request, CreatureConstants.Lammasu);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var creature = StreamHelper.Read<Creature>(response.Body);
            Assert.That(creature, Is.Not.Null);
            Assert.That(creature.Summary, Contains.Substring("Half-Dragon (Gold) Celestial Creature Lammasu"));
        }

        [Test]
        public async Task GenerateCreature_ReturnsBadRequest_WithIncompatibleCreatureAndTemplate()
        {
            var url = GetUrl(CreatureConstants.Giant_Fire, $"templates={CreatureConstants.Templates.Vampire}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request, CreatureConstants.Giant_Fire);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
                Assert.That(response.Body, Is.Not.Null);
            }

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        private static string GetUrl(string creatureName, string query = "")
        {
            var url = $"https://creature.dndgen.com/api/v1/creature/{creatureName}/generate";
            if (query.Length != 0)
                url += "?" + query;

            return url;
        }
    }
}
