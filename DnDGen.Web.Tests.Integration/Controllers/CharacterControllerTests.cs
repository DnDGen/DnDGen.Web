using DnDGen.Web.Controllers;
using DnDGen.Web.Models;
using NUnit.Framework;
using System;

namespace DnDGen.Web.Tests.Integration.Controllers
{
    [TestFixture]
    internal class CharacterControllerTests : IntegrationTests
    {
        private CharacterController controller;

        [SetUp]
        public void Setup()
        {
            controller = GetController<CharacterController>();
        }

        [Test]
        [Ignore("This test does not actually perform the serialization, so it is not valid. However, we will want to create a E2E version of this test when it converts to API")]
        public void BUG_Generate_ReturnsSerializedDerivedProperties()
        {
            var clientId = Guid.NewGuid();
            var characterSpecifications = new CharacterSpecifications();

            var result = controller.Generate(clientId, characterSpecifications);
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Value, Is.Not.Null);

            //TODO: This doesn't perform the serialization, so it can't validate the fix.
            //This stub can be converted into a Postman/E2E test once it is a proper API
        }
    }
}
