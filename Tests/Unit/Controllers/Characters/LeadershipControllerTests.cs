using CharacterGen.Common;
using CharacterGen.Generators;
using DNDGenSite.Controllers;
using DNDGenSite.Controllers.Characters;
using Moq;
using NUnit.Framework;
using System;
using System.Web.Mvc;

namespace DNDGenSite.Tests.Unit.Controllers.Characters
{
    [TestFixture]
    public class LeadershipControllerTests
    {
        private LeadershipController controller;
        private Mock<ILeadershipGenerator> mockLeadershipGenerator;

        [SetUp]
        public void Setup()
        {
            mockLeadershipGenerator = new Mock<ILeadershipGenerator>();
            controller = new LeadershipController(mockLeadershipGenerator.Object);
        }

        [TestCase("Generate")]
        [TestCase("Cohort")]
        [TestCase("Follower")]
        public void ActionHandlesGetVerb(String action)
        {
            var attributes = AttributeProvider.GetAttributesFor(controller, action);
            Assert.That(attributes, Contains.Item(typeof(HttpGetAttribute)));
        }

        [Test]
        public void GenerateReturnsJsonResult()
        {
            var result = controller.Generate(9266, 90210, "leader animal");
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void GenerateJsonResultAllowsGet()
        {
            var result = controller.Generate(9266, 90210, "leader animal") as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void GenerateReturnsLeadershipFromGenerator()
        {
            var leadership = new Leadership();
            mockLeadershipGenerator.Setup(g => g.GenerateLeadership(9266, 90210, "leader animal")).Returns(leadership);

            var result = controller.Generate(9266, 90210, "leader animal") as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.leadership, Is.EqualTo(leadership));
        }

        [Test]
        public void CohortReturnsJsonResult()
        {
            var result = controller.Cohort(9266, 90210, "leader alignment");
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void CohortJsonResultAllowsGet()
        {
            var result = controller.Cohort(9266, 90210, "leader alignment") as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void CohortReturnsCohortFromGenerator()
        {
            var cohort = new Character();
            mockLeadershipGenerator.Setup(g => g.GenerateCohort(9266, 90210, "leader alignment")).Returns(cohort);

            var result = controller.Cohort(9266, 90210, "leader alignment") as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.cohort, Is.EqualTo(cohort));
        }

        [Test]
        public void FollowerReturnsJsonResult()
        {
            var result = controller.Follower(9266, "leader alignment");
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void FollowerJsonResultAllowsGet()
        {
            var result = controller.Follower(9266, "leader alignment") as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void FollowerReturnsFollowerFromGenerator()
        {
            var follower = new Character();
            mockLeadershipGenerator.Setup(g => g.GenerateFollower(9266, "leader alignment")).Returns(follower);

            var result = controller.Follower(9266, "leader alignment") as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.follower, Is.EqualTo(follower));
        }
    }
}
