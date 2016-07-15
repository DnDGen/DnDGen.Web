using CharacterGen;
using CharacterGen.Abilities.Feats;
using CharacterGen.Abilities.Skills;
using DnDGen.Web.Controllers.Characters;
using Moq;
using NUnit.Framework;
using System;
using System.Web.Mvc;

namespace DnDGen.Web.Tests.Unit.Controllers.Characters
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
            var cohort = new Character();
            mockLeadershipGenerator.Setup(g => g.GenerateCohort(9266, 90210, "leader alignment", "leader class")).Returns(cohort);

            var result = controller.Cohort(9266, 90210, "leader alignment", "leader class");
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void CohortJsonResultAllowsGet()
        {
            var cohort = new Character();
            mockLeadershipGenerator.Setup(g => g.GenerateCohort(9266, 90210, "leader alignment", "leader class")).Returns(cohort);

            var result = controller.Cohort(9266, 90210, "leader alignment", "leader class") as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void CohortReturnsCohortFromGenerator()
        {
            var cohort = new Character();
            mockLeadershipGenerator.Setup(g => g.GenerateCohort(9266, 90210, "leader alignment", "leader class")).Returns(cohort);

            var result = controller.Cohort(9266, 90210, "leader alignment", "leader class") as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.cohort, Is.EqualTo(cohort));
        }

        [Test]
        public void CohortSortsCharacterFeats()
        {
            var cohort = new Character();
            mockLeadershipGenerator.Setup(g => g.GenerateCohort(9266, 90210, "leader alignment", "leader class")).Returns(cohort);

            cohort.Ability.Feats = new[]
            {
                new Feat { Name = "zzzz" },
                new Feat { Name = "aaa" },
                new Feat { Name = "kkkk" }
            };

            var result = controller.Cohort(9266, 90210, "leader alignment", "leader class") as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.cohort, Is.EqualTo(cohort));
            Assert.That(cohort.Ability.Feats, Is.Ordered.By("Name"));
        }

        [Test]
        public void CohortSortsCharacterSkills()
        {
            var cohort = new Character();
            mockLeadershipGenerator.Setup(g => g.GenerateCohort(9266, 90210, "leader alignment", "leader class")).Returns(cohort);

            cohort.Ability.Skills["zzzz"] = new Skill { Ranks = 42 };
            cohort.Ability.Skills["aaaa"] = new Skill { Ranks = 600 };
            cohort.Ability.Skills["kkkk"] = new Skill { Ranks = 1337 };

            var result = controller.Cohort(9266, 90210, "leader alignment", "leader class") as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.cohort, Is.EqualTo(cohort));
            Assert.That(cohort.Ability.Skills, Is.Ordered.By("Key"));
            Assert.That(cohort.Ability.Skills["aaaa"].Ranks, Is.EqualTo(600));
            Assert.That(cohort.Ability.Skills["kkkk"].Ranks, Is.EqualTo(1337));
            Assert.That(cohort.Ability.Skills["zzzz"].Ranks, Is.EqualTo(42));
        }

        [Test]
        public void FollowerReturnsJsonResult()
        {
            var follower = new Character();
            mockLeadershipGenerator.Setup(g => g.GenerateFollower(9266, "leader alignment", "leader class")).Returns(follower);

            var result = controller.Follower(9266, "leader alignment", "leader class");
            Assert.That(result, Is.InstanceOf<JsonResult>());
        }

        [Test]
        public void FollowerJsonResultAllowsGet()
        {
            var follower = new Character();
            mockLeadershipGenerator.Setup(g => g.GenerateFollower(9266, "leader alignment", "leader class")).Returns(follower);

            var result = controller.Follower(9266, "leader alignment", "leader class") as JsonResult;
            Assert.That(result.JsonRequestBehavior, Is.EqualTo(JsonRequestBehavior.AllowGet));
        }

        [Test]
        public void FollowerReturnsFollowerFromGenerator()
        {
            var follower = new Character();
            mockLeadershipGenerator.Setup(g => g.GenerateFollower(9266, "leader alignment", "leader class")).Returns(follower);

            var result = controller.Follower(9266, "leader alignment", "leader class") as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.follower, Is.EqualTo(follower));
        }

        [Test]
        public void FollowerSortsCharacterFeats()
        {
            var follower = new Character();
            mockLeadershipGenerator.Setup(g => g.GenerateFollower(9266, "leader alignment", "leader class")).Returns(follower);

            follower.Ability.Feats = new[]
            {
                new Feat { Name = "zzzz" },
                new Feat { Name = "aaa" },
                new Feat { Name = "kkkk" }
            };

            var result = controller.Follower(9266, "leader alignment", "leader class") as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.follower, Is.EqualTo(follower));
            Assert.That(follower.Ability.Feats, Is.Ordered.By("Name"));
        }

        [Test]
        public void FollowerSortsCharacterSkills()
        {
            var follower = new Character();
            mockLeadershipGenerator.Setup(g => g.GenerateFollower(9266, "leader alignment", "leader class")).Returns(follower);

            follower.Ability.Skills["zzzz"] = new Skill { Ranks = 42 };
            follower.Ability.Skills["aaaa"] = new Skill { Ranks = 600 };
            follower.Ability.Skills["kkkk"] = new Skill { Ranks = 1337 };

            var result = controller.Follower(9266, "leader alignment", "leader class") as JsonResult;
            dynamic data = result.Data;
            Assert.That(data.follower, Is.EqualTo(follower));
            Assert.That(follower.Ability.Skills, Is.Ordered.By("Key"));
            Assert.That(follower.Ability.Skills["aaaa"].Ranks, Is.EqualTo(600));
            Assert.That(follower.Ability.Skills["kkkk"].Ranks, Is.EqualTo(1337));
            Assert.That(follower.Ability.Skills["zzzz"].Ranks, Is.EqualTo(42));
        }
    }
}
