using DnDGen.Api.CreatureGen.Dependencies;
using DnDGen.Api.CreatureGen.Functions;
using DnDGen.Api.CreatureGen.Models;
using DnDGen.Api.Tests.Integration.Helpers;
using DnDGen.CreatureGen.Alignments;
using DnDGen.CreatureGen.Creatures;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Collections;
using System.Net;
using System.Web;

namespace DnDGen.Api.CreatureGen.Tests.Integration.Functions
{
    [TestFixture]
    public class GenerateRandomCreatureFunctionTests : IntegrationTests
    {
        private GenerateRandomCreatureFunction function;

        [SetUp]
        public void Setup()
        {
            var loggerFactory = new LoggerFactory();
            var dependencyFactory = GetService<IDependencyFactory>();
            function = new GenerateRandomCreatureFunction(loggerFactory, dependencyFactory);
        }

        [Test]
        public async Task GenerateRandomCreature_ReturnsCreature()
        {
            var url = GetUrl();
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request);

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
                Assert.That(creature.Name, Is.Not.Empty);
                Assert.That(creature.Summary, Is.Not.Empty);
            }
        }

        private static IEnumerable TemplateNames => CreatureSpecifications.Templates
            .Except([CreatureConstants.Templates.None, CreatureConstants.Templates.Lich])
            .Select(c => new TestCaseData(c));

        [TestCaseSource(nameof(TemplateNames))]
        public async Task GenerateRandomCreature_ReturnsCreature_WithValidTemplate(string templateName)
        {
            var url = GetUrl($"templates={HttpUtility.UrlEncode(templateName)}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request);

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
                Assert.That(creature.Name, Is.Not.Empty);
                Assert.That(creature.Templates, Is.EqualTo([templateName]));
                Assert.That(creature.Summary, Contains.Substring(templateName));
            }
        }

        [Test]
        public async Task GenerateRandomCreature_ReturnsCreature_WithValidTemplate_None()
        {
            var url = GetUrl($"templates={CreatureConstants.Templates.None}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request);

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
                Assert.That(creature.Name, Is.Not.Empty);
                Assert.That(creature.Templates, Is.Empty);
                Assert.That(creature.Summary, Is.Not.Empty);
            }
        }

        //INFO: This is because Liches can only be generated as characters, and the API only supports non-character creatures
        [Test]
        public async Task GenerateRandomCreature_ReturnsBadRequest_WithValidTemplate_Lich()
        {
            var url = GetUrl($"templates={CreatureConstants.Templates.Lich}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request);

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
        public async Task GenerateRandomCreature_ReturnsCreature_WithMultipleTemplates()
        {
            var query = $"templates={HttpUtility.UrlEncode(CreatureConstants.Templates.HalfDragon_Gold)}";
            query += $"&templates={HttpUtility.UrlEncode(CreatureConstants.Templates.CelestialCreature)}";
            var url = GetUrl(query);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request);

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
                Assert.That(creature.Name, Is.Not.Empty);
                Assert.That(creature.Templates, Is.EqualTo([CreatureConstants.Templates.HalfDragon_Gold, CreatureConstants.Templates.CelestialCreature]));
                Assert.That(creature.Summary, Contains.Substring("Half-Dragon (Gold) Celestial Creature"));
            }
        }

        private static IEnumerable Alignments => CreatureSpecifications.Alignments
            .Except([CreatureConstants.Templates.None, CreatureConstants.Templates.Lich])
            .Select(c => new TestCaseData(c));

        [TestCaseSource(nameof(Alignments))]
        public async Task GenerateRandomCreature_ReturnsCreature_WithValidAlignment(string alignment)
        {
            var url = GetUrl($"alignment={HttpUtility.UrlEncode(alignment)}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request);

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
                Assert.That(creature.Name, Is.Not.Empty);
                Assert.That(creature.Alignment.Full, Is.EqualTo(alignment));
                Assert.That(creature.Summary, Is.Not.Empty);
            }
        }

        private static IEnumerable CreatureTypes => CreatureSpecifications.CreatureTypes.Select(c => new TestCaseData(c));

        [TestCaseSource(nameof(CreatureTypes))]
        public async Task GenerateRandomCreature_ReturnsCreature_WithValidCreatureType(string type)
        {
            var url = GetUrl($"type={HttpUtility.UrlEncode(type)}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request);

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
                Assert.That(creature.Name, Is.Not.Empty);
                Assert.That(creature.Type.Is(type), Is.True, string.Join(", ", creature.Type.AllTypes));
                Assert.That(creature.Summary, Is.Not.Empty);
            }
        }

        private static IEnumerable ChallengeRatings => CreatureSpecifications.ChallengeRatings
            .Except([ChallengeRatingConstants.CR0])
            .Select(c => new TestCaseData(c));

        [TestCaseSource(nameof(ChallengeRatings))]
        public async Task GenerateRandomCreature_ReturnsCreature_WithValidChallengeRating(string cr)
        {
            var url = GetUrl($"cr={HttpUtility.UrlEncode(cr)}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request);

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
                Assert.That(creature.Name, Is.Not.Empty);
                Assert.That(creature.ChallengeRating, Is.EqualTo(cr));
                Assert.That(creature.Summary, Is.Not.Empty);
            }
        }

        [Test]
        public async Task GenerateRandomCreature_ReturnsCreature_WithAllFilters()
        {
            var query = $"templates={HttpUtility.UrlEncode(CreatureConstants.Templates.FiendishCreature)}";
            query += $"&alignment={HttpUtility.UrlEncode(AlignmentConstants.NeutralEvil)}";
            query += $"&type={HttpUtility.UrlEncode(CreatureConstants.Types.MagicalBeast)}";
            query += $"&cr={HttpUtility.UrlEncode(ChallengeRatingConstants.CR1_2nd)}";
            var url = GetUrl(query);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request);

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
                Assert.That(creature.Name, Is.Not.Empty);
                Assert.That(creature.Templates, Is.EqualTo([CreatureConstants.Templates.FiendishCreature]));
                Assert.That(creature.Alignment.Full, Is.EqualTo(AlignmentConstants.NeutralEvil));
                Assert.That(creature.Type.Is(CreatureConstants.Types.MagicalBeast), Is.True, string.Join(", ", creature.Type.AllTypes));
                Assert.That(creature.ChallengeRating, Is.EqualTo(ChallengeRatingConstants.CR1_2nd));
                Assert.That(creature.Summary, Is.Not.Empty);
            }
        }

        [Test]
        public async Task GenerateRandomCreature_ReturnsBadRequest_WithIncompatibleFilters()
        {
            var query = $"templates={HttpUtility.UrlEncode(CreatureConstants.Templates.FiendishCreature)}";
            query += $"&alignment={HttpUtility.UrlEncode(AlignmentConstants.NeutralGood)}";
            query += $"&type={HttpUtility.UrlEncode(CreatureConstants.Types.MagicalBeast)}";
            query += $"&cr={HttpUtility.UrlEncode(ChallengeRatingConstants.CR1_2nd)}";
            var url = GetUrl(query);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request);

            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
                Assert.That(response.Body, Is.Not.Null);
            }

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        private static string GetUrl(string query = "")
        {
            var url = "https://creature.dndgen.com/api/v1/creature/random/generate";
            if (query.Length != 0)
                url += "?" + query;

            return url;
        }
    }
}
