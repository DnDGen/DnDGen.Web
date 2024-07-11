using DnDGen.Api.EncounterGen.Dependencies;
using DnDGen.Api.EncounterGen.Functions;
using DnDGen.Api.Tests.Unit.Helpers;
using DnDGen.EncounterGen.Generators;
using DnDGen.EncounterGen.Models;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Moq;
using System.Collections.Specialized;
using System.Net;

namespace DnDGen.Api.EncounterGen.Tests.Unit.Functions
{
    internal class ValidatorFunctionTests
    {
        private ValidateFunction _function;
        private Mock<IEncounterVerifier> mockEncounterVerifier;
        private Mock<ILogger<ValidateFunction>> mockLogger;
        private RequestHelper requestHelper;

        [SetUp]
        public void Setup()
        {
            mockEncounterVerifier = new Mock<IEncounterVerifier>();
            mockLogger = new Mock<ILogger<ValidateFunction>>();

            var mockLoggerFactory = new Mock<ILoggerFactory>();
            mockLogger.Setup(l => l.Log(
                It.IsAny<LogLevel>(),
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception?>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()));

            mockLoggerFactory.Setup(f => f.CreateLogger("DnDGen.Api.EncounterGen.Functions.ValidateFunction")).Returns(mockLogger.Object);

            var mockDependencyFactory = new Mock<IDependencyFactory>();
            mockDependencyFactory.Setup(f => f.Get<IEncounterVerifier>()).Returns(mockEncounterVerifier.Object);

            _function = new ValidateFunction(mockLoggerFactory.Object, mockDependencyFactory.Object);
            requestHelper = new RequestHelper();
        }

        [TestCase(true)]
        [TestCase(false)]
        public async Task Run_ReturnsTheEncounterValidity(bool validity)
        {
            mockEncounterVerifier
                .Setup(v => v.ValidEncounterExists(It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day")))
                .Returns(validity);

            var request = requestHelper.BuildRequest();

            var response = await _function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var body = Convert.ToBoolean(StreamHelper.Read(response.Body));
            Assert.That(body, Is.EqualTo(validity));
        }

        [TestCase(true)]
        [TestCase(false)]
        public async Task Run_ReturnsTheEncounterValidity_AllowAquatic(bool validity)
        {
            var query = new NameValueCollection
            {
                { "allowAquatic", bool.TrueString }
            };
            mockEncounterVerifier
                .Setup(v => v.ValidEncounterExists(It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day, allowing aquatic")))
                .Returns(validity);

            var request = requestHelper.BuildRequest(query);

            var response = await _function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var body = Convert.ToBoolean(StreamHelper.Read(response.Body));
            Assert.That(body, Is.EqualTo(validity));
        }

        [TestCase(true)]
        [TestCase(false)]
        public async Task Run_ReturnsTheEncounterValidity_AllowUnderground(bool validity)
        {
            var query = new NameValueCollection
            {
                { "allowUnderground", bool.TrueString }
            };
            mockEncounterVerifier
                .Setup(v => v.ValidEncounterExists(It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day, allowing underground")))
                .Returns(validity);

            var request = requestHelper.BuildRequest(query);

            var response = await _function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var body = Convert.ToBoolean(StreamHelper.Read(response.Body));
            Assert.That(body, Is.EqualTo(validity));
        }

        [TestCase(true)]
        [TestCase(false)]
        public async Task Run_ReturnsTheEncounterValidity_CreatureTypeFilters(bool validity)
        {
            var query = new NameValueCollection
            {
                { "creatureTypeFilters", CreatureDataConstants.Types.Humanoid }
            };
            mockEncounterVerifier
                .Setup(v => v.ValidEncounterExists(It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day, allowing [Humanoid]")))
                .Returns(validity);

            var request = requestHelper.BuildRequest(query);

            var response = await _function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var body = Convert.ToBoolean(StreamHelper.Read(response.Body));
            Assert.That(body, Is.EqualTo(validity));
        }

        [TestCase(true)]
        [TestCase(false)]
        public async Task Run_ReturnsTheEncounterValidity_MultipleCreatureTypeFilters(bool validity)
        {
            var query = new NameValueCollection
            {
                { "creatureTypeFilters", CreatureDataConstants.Types.Humanoid },
                { "creatureTypeFilters", CreatureDataConstants.Types.Animal },
            };
            mockEncounterVerifier
                .Setup(v => v.ValidEncounterExists(It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day, allowing [Animal, Humanoid]")))
                .Returns(validity);

            var request = requestHelper.BuildRequest(query);

            var response = await _function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var body = Convert.ToBoolean(StreamHelper.Read(response.Body));
            Assert.That(body, Is.EqualTo(validity));
        }

        [TestCase(true)]
        [TestCase(false)]
        public async Task Run_ReturnsTheEncounterValidity_AllParameters(bool validity)
        {
            var query = new NameValueCollection
            {
                { "allowAquatic", bool.TrueString },
                { "allowUnderground", bool.TrueString },
                { "creatureTypeFilters", CreatureDataConstants.Types.Humanoid },
                { "creatureTypeFilters", CreatureDataConstants.Types.Animal },
            };
            mockEncounterVerifier
                .Setup(v => v.ValidEncounterExists(It.Is<EncounterSpecifications>(s =>
                    s.Description == "Level 1 Temperate Plains Day, allowing aquatic, allowing underground, allowing [Animal, Humanoid]")))
                .Returns(validity);

            var request = requestHelper.BuildRequest(query);

            var response = await _function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var body = Convert.ToBoolean(StreamHelper.Read(response.Body));
            Assert.That(body, Is.EqualTo(validity));
        }

        [Test]
        public async Task Run_ReturnsTheEncounterValidity_WhenTemperatureInvalid()
        {
            var request = requestHelper.BuildRequest();

            var response = await _function.Run(request, "invalid", EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var body = Convert.ToBoolean(StreamHelper.Read(response.Body));
            Assert.That(body, Is.False);
        }

        [Test]
        public async Task Run_ReturnsTheEncounterValidity_WhenEnvironmentInvalid()
        {
            var request = requestHelper.BuildRequest();

            var response = await _function.Run(request, EnvironmentConstants.Temperatures.Temperate, "invalid", EnvironmentConstants.TimesOfDay.Day, 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var body = Convert.ToBoolean(StreamHelper.Read(response.Body));
            Assert.That(body, Is.False);
        }

        [Test]
        public async Task Run_ReturnsTheEncounterValidity_WhenTimeOfDayInvalid()
        {
            var request = requestHelper.BuildRequest();

            var response = await _function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, "invalid", 1);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var body = Convert.ToBoolean(StreamHelper.Read(response.Body));
            Assert.That(body, Is.False);
        }

        [TestCase(EncounterSpecifications.MinimumLevel - 1)]
        [TestCase(EncounterSpecifications.MaximumLevel + 1)]
        public async Task Run_ReturnsTheEncounterValidity_WhenLevelInvalid(int badLevel)
        {
            var request = requestHelper.BuildRequest();

            var response = await _function.Run(request, EnvironmentConstants.Temperatures.Temperate, EnvironmentConstants.Plains, EnvironmentConstants.TimesOfDay.Day, badLevel);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var body = Convert.ToBoolean(StreamHelper.Read(response.Body));
            Assert.That(body, Is.False);
        }
    }
}
