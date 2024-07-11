using DnDGen.Api.RollGen.Dependencies;
using DnDGen.Api.RollGen.Functions;
using DnDGen.Api.Tests.Integration.Helpers;
using DnDGen.RollGen;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;

namespace DnDGen.Api.RollGen.Tests.Integration.Functions
{
    public class RollFunctionTests : IntegrationTests
    {
        private RollFunction function;

        [SetUp]
        public void Setup()
        {
            var loggerFactory = new LoggerFactory();
            var dependencyFactory = GetService<IDependencyFactory>();
            function = new RollFunction(loggerFactory, dependencyFactory);
        }

        [TestCase(1, 1)]
        [TestCase(1, 2)]
        [TestCase(1, 3)]
        [TestCase(1, 4)]
        [TestCase(1, 6)]
        [TestCase(1, 10)]
        [TestCase(1, 12)]
        [TestCase(1, 20)]
        [TestCase(1, 100)]
        [TestCase(1, 1_000)]
        [TestCase(1, Limits.Die)]
        [TestCase(2, 1)]
        [TestCase(2, 2)]
        [TestCase(2, 3)]
        [TestCase(2, 4)]
        [TestCase(2, 6)]
        [TestCase(2, 10)]
        [TestCase(2, 12)]
        [TestCase(2, 20)]
        [TestCase(2, 100)]
        [TestCase(2, 1_000)]
        [TestCase(2, Limits.Die)]
        [TestCase(10, 1)]
        [TestCase(10, 2)]
        [TestCase(10, 3)]
        [TestCase(10, 4)]
        [TestCase(10, 6)]
        [TestCase(10, 10)]
        [TestCase(10, 12)]
        [TestCase(10, 20)]
        [TestCase(10, 100)]
        [TestCase(10, 1_000)]
        [TestCase(10, Limits.Die)]
        [TestCase(100, 1)]
        [TestCase(100, 2)]
        [TestCase(100, 3)]
        [TestCase(100, 4)]
        [TestCase(100, 6)]
        [TestCase(100, 10)]
        [TestCase(100, 12)]
        [TestCase(100, 20)]
        [TestCase(100, 100)]
        [TestCase(100, 1_000)]
        [TestCase(100, Limits.Die)]
        [TestCase(1_000, 1)]
        [TestCase(1_000, 2)]
        [TestCase(1_000, 3)]
        [TestCase(1_000, 4)]
        [TestCase(1_000, 6)]
        [TestCase(1_000, 10)]
        [TestCase(1_000, 12)]
        [TestCase(1_000, 20)]
        [TestCase(1_000, 100)]
        [TestCase(1_000, 1_000)]
        [TestCase(1_000, Limits.Die)]
        [TestCase(Limits.Quantity, 1)]
        [TestCase(Limits.Quantity, 2)]
        [TestCase(Limits.Quantity, 3)]
        [TestCase(Limits.Quantity, 4)]
        [TestCase(Limits.Quantity, 6)]
        [TestCase(Limits.Quantity, 10)]
        [TestCase(Limits.Quantity, 12)]
        [TestCase(Limits.Quantity, 20)]
        [TestCase(Limits.Quantity, 100)]
        [TestCase(Limits.Quantity, 1_000)]
        [TestCase(Limits.Quantity, Limits.Die)]
        public async Task RollV1_ReturnsRoll(int quantity, int die)
        {
            var url = GetUrlV1($"?quantity={quantity}&die={die}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var roll = StreamHelper.Read<int>(response.Body);
            Assert.That(roll, Is.InRange(quantity, quantity * die));
        }

        private string GetUrlV1(string query = "")
        {
            var url = "https://roll.dndgen.com/api/v1/roll";
            if (query.Any())
                url += "?" + query.TrimStart('?');

            return url;
        }

        private string GetUrlV2(int quantity, int die, string query = "")
        {
            var url = $"https://roll.dndgen.com/api/v2/{quantity}/d/{die}/roll";
            if (query.Any())
                url += "?" + query.TrimStart('?');

            return url;
        }

        [TestCase(0, 0)]
        [TestCase(0, 1)]
        [TestCase(1, 0)]
        [TestCase(Limits.Quantity, Limits.Die + 1)]
        [TestCase(Limits.Quantity + 1, Limits.Die)]
        [TestCase(Limits.Quantity + 1, Limits.Die + 1)]
        public async Task RollV1_ReturnsBadRequest(int quantity, int die)
        {
            var url = GetUrlV1($"?quantity={quantity}&die={die}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }

        [TestCase(1, 1)]
        [TestCase(1, 2)]
        [TestCase(1, 3)]
        [TestCase(1, 4)]
        [TestCase(1, 6)]
        [TestCase(1, 10)]
        [TestCase(1, 12)]
        [TestCase(1, 20)]
        [TestCase(1, 100)]
        [TestCase(1, 1_000)]
        [TestCase(1, Limits.Die)]
        [TestCase(2, 1)]
        [TestCase(2, 2)]
        [TestCase(2, 3)]
        [TestCase(2, 4)]
        [TestCase(2, 6)]
        [TestCase(2, 10)]
        [TestCase(2, 12)]
        [TestCase(2, 20)]
        [TestCase(2, 100)]
        [TestCase(2, 1_000)]
        [TestCase(2, Limits.Die)]
        [TestCase(10, 1)]
        [TestCase(10, 2)]
        [TestCase(10, 3)]
        [TestCase(10, 4)]
        [TestCase(10, 6)]
        [TestCase(10, 10)]
        [TestCase(10, 12)]
        [TestCase(10, 20)]
        [TestCase(10, 100)]
        [TestCase(10, 1_000)]
        [TestCase(10, Limits.Die)]
        [TestCase(100, 1)]
        [TestCase(100, 2)]
        [TestCase(100, 3)]
        [TestCase(100, 4)]
        [TestCase(100, 6)]
        [TestCase(100, 10)]
        [TestCase(100, 12)]
        [TestCase(100, 20)]
        [TestCase(100, 100)]
        [TestCase(100, 1_000)]
        [TestCase(100, Limits.Die)]
        [TestCase(1_000, 1)]
        [TestCase(1_000, 2)]
        [TestCase(1_000, 3)]
        [TestCase(1_000, 4)]
        [TestCase(1_000, 6)]
        [TestCase(1_000, 10)]
        [TestCase(1_000, 12)]
        [TestCase(1_000, 20)]
        [TestCase(1_000, 100)]
        [TestCase(1_000, 1_000)]
        [TestCase(1_000, Limits.Die)]
        [TestCase(Limits.Quantity, 1)]
        [TestCase(Limits.Quantity, 2)]
        [TestCase(Limits.Quantity, 3)]
        [TestCase(Limits.Quantity, 4)]
        [TestCase(Limits.Quantity, 6)]
        [TestCase(Limits.Quantity, 10)]
        [TestCase(Limits.Quantity, 12)]
        [TestCase(Limits.Quantity, 20)]
        [TestCase(Limits.Quantity, 100)]
        [TestCase(Limits.Quantity, 1_000)]
        [TestCase(Limits.Quantity, Limits.Die)]
        public async Task RollV2_ReturnsRoll(int quantity, int die)
        {
            var url = GetUrlV2(quantity, die);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV2(request, quantity, die);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var roll = StreamHelper.Read<int>(response.Body);
            Assert.That(roll, Is.InRange(quantity, quantity * die));
        }

        [TestCase(0, 0)]
        [TestCase(0, 1)]
        [TestCase(1, 0)]
        [TestCase(Limits.Quantity, Limits.Die + 1)]
        [TestCase(Limits.Quantity + 1, Limits.Die)]
        [TestCase(Limits.Quantity + 1, Limits.Die + 1)]
        public async Task RollV2_ReturnsBadRequest(int quantity, int die)
        {
            var url = GetUrlV2(quantity, die);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV2(request, quantity, die);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response.Body, Is.Not.Null);

            var responseBody = StreamHelper.Read(response.Body);
            Assert.That(responseBody, Is.Empty);
        }
    }
}