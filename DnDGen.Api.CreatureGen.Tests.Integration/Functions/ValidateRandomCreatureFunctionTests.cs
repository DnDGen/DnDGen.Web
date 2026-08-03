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
    public class ValidateRandomCreatureFunctionTests : IntegrationTests
    {
        private ValidateRandomCreatureFunction function;

        [SetUp]
        public void Setup()
        {
            var loggerFactory = new LoggerFactory();
            var dependencyFactory = GetService<IDependencyFactory>();
            function = new ValidateRandomCreatureFunction(loggerFactory, dependencyFactory);
        }

        [Test]
        public async Task ValidateRandomCreature_ReturnsValid()
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

            var valid = StreamHelper.Read<bool>(response.Body);
            Assert.That(valid, Is.True);
        }

        private static IEnumerable TemplateNames => CreatureSpecifications.Templates
            .Except([CreatureConstants.Templates.None, CreatureConstants.Templates.Lich])
            .Select(c => new TestCaseData(c));

        [TestCaseSource(nameof(TemplateNames))]
        public async Task ValidateRandomCreature_ReturnsValid_WithValidTemplate(string templateName)
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

            var valid = StreamHelper.Read<bool>(response.Body);
            Assert.That(valid, Is.True);
        }

        [Test]
        public async Task ValidateRandomCreature_ReturnsValid_WithValidTemplate_None()
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

            var valid = StreamHelper.Read<bool>(response.Body);
            Assert.That(valid, Is.True);
        }

        //INFO: This is because Liches can only be generated as characters, and the API only supports non-character creatures
        [Test]
        public async Task ValidateRandomCreature_ReturnsInvalid_WithValidTemplate_Lich()
        {
            var url = GetUrl($"templates={CreatureConstants.Templates.Lich}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request);

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
        public async Task ValidateRandomCreature_ReturnsValid_WithMultipleTemplates()
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

            var valid = StreamHelper.Read<bool>(response.Body);
            Assert.That(valid, Is.True);
        }

        private static IEnumerable Alignments => CreatureSpecifications.Alignments
            .Except([CreatureConstants.Templates.None, CreatureConstants.Templates.Lich])
            .Select(c => new TestCaseData(c));

        [TestCaseSource(nameof(Alignments))]
        public async Task ValidateRandomCreature_ReturnsValid_WithValidAlignment(string alignment)
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

            var valid = StreamHelper.Read<bool>(response.Body);
            Assert.That(valid, Is.True);
        }

        private static IEnumerable CreatureTypes => CreatureSpecifications.CreatureTypes.Select(c => new TestCaseData(c));

        [TestCaseSource(nameof(CreatureTypes))]
        public async Task ValidateRandomCreature_ReturnsValid_WithValidCreatureType(string type)
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

            var valid = StreamHelper.Read<bool>(response.Body);
            Assert.That(valid, Is.True);
        }

        private static IEnumerable ChallengeRatings => CreatureSpecifications.ChallengeRatings
            .Except([ChallengeRatingConstants.CR0])
            .Select(c => new TestCaseData(c));

        [TestCaseSource(nameof(ChallengeRatings))]
        public async Task ValidateRandomCreature_ReturnsValid_WithValidChallengeRating(string cr)
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

            var valid = StreamHelper.Read<bool>(response.Body);
            Assert.That(valid, Is.True);
        }

        [Test]
        public async Task ValidateRandomCreature_ReturnsValid_WithAllFilters()
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

            var valid = StreamHelper.Read<bool>(response.Body);
            Assert.That(valid, Is.True);
        }

        [Test]
        public async Task ValidateRandomCreature_ReturnsInvalid_WithIncompatibleFilters()
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
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var valid = StreamHelper.Read<bool>(response.Body);
            Assert.That(valid, Is.False);
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
