using DnDGen.Api.Tests.Integration.Helpers;
using DnDGen.Api.Web.Functions;
using DnDGen.Api.Web.Models;
using DnDGen.CharacterGen.Alignments;
using DnDGen.CreatureGen.Creatures;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;

namespace DnDGen.Api.Web.Tests.Integration.Functions
{
    public class GetCreatureViewModelFunctionTests : IntegrationTests
    {
        private GetCreatureViewModelFunction function;

        [SetUp]
        public void Setup()
        {
            var loggerFactory = new LoggerFactory();
            function = new GetCreatureViewModelFunction(loggerFactory);
        }

        [Test]
        public async Task Run_ReturnsCreatureViewModel()
        {
            var url = GetUrl();
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.Run(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            using (Assert.EnterMultipleScope())
            {
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(response.Body, Is.Not.Null);
            }

            var model = StreamHelper.Read<CreatureViewModel>(response.Body);
            Assert.That(model, Is.Not.Null);
            using (Assert.EnterMultipleScope())
            {
                var creatures = CreatureConstants.GetAll();
                var templates = CreatureConstants.Templates.GetAll();
                var creatureTypes = CreatureConstants.Types.GetAll()
                    .Concat(CreatureConstants.Types.Subtypes.GetAll());
                var challengeRatings = ChallengeRatingConstants.GetOrdered();

                Assert.That(model.Creatures, Is.EquivalentTo(creatures));
                Assert.That(model.Templates, Is.EquivalentTo(templates));
                Assert.That(model.Alignments, Is.EquivalentTo(
                [
                    AlignmentConstants.ChaoticEvil,
                    AlignmentConstants.ChaoticGood,
                    AlignmentConstants.ChaoticNeutral,
                    AlignmentConstants.LawfulEvil,
                    AlignmentConstants.LawfulGood,
                    AlignmentConstants.LawfulNeutral,
                    AlignmentConstants.NeutralEvil,
                    AlignmentConstants.NeutralGood,
                    AlignmentConstants.TrueNeutral,
                ]));
                Assert.That(model.CreatureTypes, Is.EquivalentTo(creatureTypes));
                Assert.That(model.ChallengeRatings, Is.EquivalentTo(challengeRatings));
            }
        }

        private static string GetUrl(string query = "")
        {
            var url = "https://web.dndgen.com/api/v1/creature/viewmodel";
            if (query.Length != 0)
                url += "?" + query.TrimStart('?');

            return url;
        }
    }
}