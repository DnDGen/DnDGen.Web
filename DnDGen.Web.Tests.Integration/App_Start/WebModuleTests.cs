using DnDGen.Web.App_Start.Factories;
using DnDGen.Web.Controllers;
using DnDGen.Web.Repositories;
using DnDGen.Web.Repositories.Domain;
using NUnit.Framework;
using Octokit;

namespace DnDGen.Web.Tests.Integration.App_Start
{
    [TestFixture]
    public class WebModuleTests : IntegrationTests
    {
        [Test]
        public void HomeControllerIsInjected()
        {
            var controller = GetNewInstanceOf<HomeController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void ErrorControllerIsInjected()
        {
            var controller = GetNewInstanceOf<ErrorController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void EncounterControllerIsInjected()
        {
            var controller = GetNewInstanceOf<EncounterController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void DungeonControllerIsInjected()
        {
            var controller = GetNewInstanceOf<DungeonController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void RollControllerIsInjected()
        {
            var controller = GetNewInstanceOf<RollController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void TreasureControllerIsInjected()
        {
            var controller = GetNewInstanceOf<TreasureController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void ErrorRepositoryIsInjected()
        {
            var repository = GetNewInstanceOf<ErrorRepository>();
            Assert.That(repository, Is.InstanceOf<GitHubErrorRepository>());
        }

        [Test]
        public void GitHubClientIsInjected()
        {
            var client = GetNewInstanceOf<IGitHubClient>();
            Assert.That(client, Is.InstanceOf<GitHubClient>());
        }

        [Test]
        public void CharacterControllerIsInjected()
        {
            var controller = GetNewInstanceOf<CharacterController>();
            Assert.That(controller, Is.Not.Null);
        }

        [Test]
        public void RandomizerRepositoryIsInjected()
        {
            var repository = GetNewInstanceOf<IRandomizerRepository>();
            Assert.That(repository, Is.InstanceOf<RandomizerRepository>());
        }

        [Test]
        public void RuntimeFactoryIsInjected()
        {
            var factory = GetNewInstanceOf<RuntimeFactory>();
            Assert.That(factory, Is.InstanceOf<NinjectRuntimeFactory>());
        }
    }
}