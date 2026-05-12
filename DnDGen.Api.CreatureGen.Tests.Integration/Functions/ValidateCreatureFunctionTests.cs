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
    public class ValidateCreatureFunctionTests : IntegrationTests
    {
        private ValidateCreatureFunction function;

        [SetUp]
        public void Setup()
        {
            var loggerFactory = new LoggerFactory();
            var dependencyFactory = GetService<IDependencyFactory>();
            function = new ValidateCreatureFunction(loggerFactory, dependencyFactory);
        }

        private static IEnumerable CreatureNames => CreatureSpecifications.Creatures.Select(c => new TestCaseData(c));

        [TestCaseSource(nameof(CreatureNames))]
        public async Task ValidateCreature_ReturnsValid_WithValidCreatureName(string creatureName)
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

            var valid = StreamHelper.Read<bool>(response.Body);
            Assert.That(valid, Is.True);
        }

        private static IEnumerable TemplateNames => CreatureSpecifications.Templates
            .Except([CreatureConstants.Templates.None, CreatureConstants.Templates.Lich])
            .Select(c => new TestCaseData(c));

        [TestCaseSource(nameof(TemplateNames))]
        public async Task GenerateCreature_ReturnsValid_WithValidTemplate(string templateName)
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

            var valid = StreamHelper.Read<bool>(response.Body);
            Assert.That(valid, Is.True);
        }

        [TestCase(CreatureConstants.Halfling_Lightfoot, CreatureConstants.Templates.Lich)]
        [TestCase(CreatureConstants.Halfling_Lightfoot, CreatureConstants.Templates.Vampire)]
        [TestCase(CreatureConstants.Human, CreatureConstants.Templates.Lich)]
        [TestCase(CreatureConstants.Human, CreatureConstants.Templates.Lycanthrope_Rat_Afflicted)]
        [TestCase(CreatureConstants.Human, CreatureConstants.Templates.Lycanthrope_Rat_Natural)]
        [TestCase(CreatureConstants.Human, CreatureConstants.Templates.Vampire)]
        [TestCase(CreatureConstants.Minotaur, CreatureConstants.Templates.Lich)]
        [TestCase(CreatureConstants.Minotaur, CreatureConstants.Templates.Lycanthrope_Rat_Afflicted)]
        [TestCase(CreatureConstants.Minotaur, CreatureConstants.Templates.Lycanthrope_Rat_Natural)]
        public async Task GenerateCreature_ReturnsInvalid(string creatureName, string templateName)
        {
            var url = GetUrl(creatureName, $"templates={HttpUtility.UrlEncode(templateName)}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request, creatureName);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var valid = StreamHelper.Read<bool>(response.Body);
            Assert.That(valid, Is.False);
        }

        [Test]
        public async Task GenerateCreature_ReturnsValid_WithMultipleTemplates()
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

            var valid = StreamHelper.Read<bool>(response.Body);
            Assert.That(valid, Is.True);
        }

        [Test]
        public async Task GenerateCreature_ReturnsInvalid_WithMultipleTemplates()
        {
            var query = $"templates={HttpUtility.UrlEncode(CreatureConstants.Templates.HalfDragon_Gold)}";
            query += $"&templates={HttpUtility.UrlEncode(CreatureConstants.Templates.FiendishCreature)}";
            var url = GetUrl(CreatureConstants.Lammasu, query);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request, CreatureConstants.Lammasu);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var valid = StreamHelper.Read<bool>(response.Body);
            Assert.That(valid, Is.False);
        }

        [Test]
        public async Task GenerateCreature_ReturnsInvalid_WithIncompatibleCreatureAndTemplate()
        {
            var url = GetUrl(CreatureConstants.Giant_Fire, $"templates={CreatureConstants.Templates.Vampire}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request, CreatureConstants.Giant_Fire);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());
            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var valid = StreamHelper.Read<bool>(response.Body);
            Assert.That(valid, Is.False);
        }

        private static string GetUrl(string creatureName, string query = "")
        {
            var url = $"https://creature.dndgen.com/api/v1/creature/{creatureName}/validate";
            if (query.Length != 0)
                url += "?" + query;

            return url;
        }
    }
}
