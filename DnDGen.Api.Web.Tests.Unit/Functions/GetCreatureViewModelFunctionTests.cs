using DnDGen.Api.Tests.Unit;
using DnDGen.Api.Tests.Unit.Helpers;
using DnDGen.Api.Web.Functions;
using DnDGen.Api.Web.Models;
using DnDGen.CharacterGen.Alignments;
using DnDGen.CreatureGen.Creatures;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Moq;
using System.Net;

namespace DnDGen.Api.Web.Tests.Unit.Functions
{
    public class GetCreatureViewModelFunctionTests
    {
        private GetCreatureViewModelFunction function;
        private Mock<ILogger<GetCreatureViewModelFunction>> mockLogger;
        private RequestHelper requestHelper;

        [SetUp]
        public void Setup()
        {
            mockLogger = new Mock<ILogger<GetCreatureViewModelFunction>>();

            var mockLoggerFactory = new Mock<ILoggerFactory>();
            mockLogger.Setup(l => l.Log(
                It.IsAny<LogLevel>(),
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception?>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()));

            mockLoggerFactory.Setup(f => f.CreateLogger("DnDGen.Api.Web.Functions.GetCreatureViewModelFunction")).Returns(mockLogger.Object);

            function = new GetCreatureViewModelFunction(mockLoggerFactory.Object);
            requestHelper = new RequestHelper();
        }

        [Test]
        public async Task Run_ReturnsTheCreatureViewModel()
        {
            var request = requestHelper.BuildRequest();

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

            mockLogger.AssertLog("C# HTTP trigger function (GetCreatureViewModelFunction.Run) processed a request.");
        }
    }
}