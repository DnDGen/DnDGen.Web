using DnDGen.Web.Controllers.Characters;
using NUnit.Framework;
using System;

namespace DnDGen.Web.Tests.Integration.Controllers.Characters
{
    [TestFixture]
    internal class LeadershipControllerTests : IntegrationTests
    {
        private LeadershipController controller;

        [SetUp]
        public void Setup()
        {
            controller = GetController<LeadershipController>();
        }

        [TestCase(1, 6, "Lawful Good", "Fighter")]
        [TestCase(2, 6, "Lawful Good", "Fighter")]
        public void BUG_CanGenerateNullCohort(int cohortScore, int leaderLevel, string leaderAlignment, string leaderClass)
        {
            var clientId = Guid.NewGuid();

            var result = controller.Cohort(clientId, cohortScore, leaderLevel, leaderAlignment, leaderClass);
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Value, Is.Not.Null);

            //INFO: We don't care if the cohort is null or not, we just want to know that the method doesn't throw an exception
        }
    }
}
