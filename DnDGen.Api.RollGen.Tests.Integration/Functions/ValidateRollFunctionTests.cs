using DnDGen.Api.RollGen.Dependencies;
using DnDGen.Api.RollGen.Functions;
using DnDGen.Api.Tests.Integration.Helpers;
using DnDGen.RollGen;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;

namespace DnDGen.Api.RollGen.Tests.Integration.Functions
{
    public class ValidateRollFunctionTests : IntegrationTests
    {
        private ValidateRollFunction function;

        [SetUp]
        public void Setup()
        {
            var loggerFactory = new LoggerFactory();
            var dependencyFactory = GetService<IDependencyFactory>();
            function = new ValidateRollFunction(loggerFactory, dependencyFactory);
        }

        [TestCase(-1, -1, false)]
        [TestCase(-1, 0, false)]
        [TestCase(-1, 1, false)]
        [TestCase(-1, 2, false)]
        [TestCase(-1, 3, false)]
        [TestCase(-1, 4, false)]
        [TestCase(-1, 6, false)]
        [TestCase(-1, 10, false)]
        [TestCase(-1, 12, false)]
        [TestCase(-1, 20, false)]
        [TestCase(-1, 100, false)]
        [TestCase(-1, 1_000, false)]
        [TestCase(-1, Limits.Die, false)]
        [TestCase(-1, Limits.Die + 1, false)]
        [TestCase(0, -1, false)]
        [TestCase(0, 0, false)]
        [TestCase(0, 1, false)]
        [TestCase(0, 2, false)]
        [TestCase(0, 3, false)]
        [TestCase(0, 4, false)]
        [TestCase(0, 6, false)]
        [TestCase(0, 10, false)]
        [TestCase(0, 12, false)]
        [TestCase(0, 20, false)]
        [TestCase(0, 100, false)]
        [TestCase(0, 1_000, false)]
        [TestCase(0, Limits.Die, false)]
        [TestCase(0, Limits.Die + 1, false)]
        [TestCase(1, -1, false)]
        [TestCase(1, 0, false)]
        [TestCase(1, 1, true)]
        [TestCase(1, 2, true)]
        [TestCase(1, 3, true)]
        [TestCase(1, 4, true)]
        [TestCase(1, 6, true)]
        [TestCase(1, 10, true)]
        [TestCase(1, 12, true)]
        [TestCase(1, 20, true)]
        [TestCase(1, 100, true)]
        [TestCase(1, 1_000, true)]
        [TestCase(1, Limits.Die, true)]
        [TestCase(1, Limits.Die + 1, false)]
        [TestCase(2, -1, false)]
        [TestCase(2, 0, false)]
        [TestCase(2, 1, true)]
        [TestCase(2, 2, true)]
        [TestCase(2, 3, true)]
        [TestCase(2, 4, true)]
        [TestCase(2, 6, true)]
        [TestCase(2, 10, true)]
        [TestCase(2, 12, true)]
        [TestCase(2, 20, true)]
        [TestCase(2, 100, true)]
        [TestCase(2, 1_000, true)]
        [TestCase(2, Limits.Die, true)]
        [TestCase(2, Limits.Die + 1, false)]
        [TestCase(10, -1, false)]
        [TestCase(10, 0, false)]
        [TestCase(10, 1, true)]
        [TestCase(10, 2, true)]
        [TestCase(10, 3, true)]
        [TestCase(10, 4, true)]
        [TestCase(10, 6, true)]
        [TestCase(10, 10, true)]
        [TestCase(10, 12, true)]
        [TestCase(10, 20, true)]
        [TestCase(10, 100, true)]
        [TestCase(10, 1_000, true)]
        [TestCase(10, Limits.Die, true)]
        [TestCase(10, Limits.Die + 1, false)]
        [TestCase(100, -1, false)]
        [TestCase(100, 0, false)]
        [TestCase(100, 1, true)]
        [TestCase(100, 2, true)]
        [TestCase(100, 3, true)]
        [TestCase(100, 4, true)]
        [TestCase(100, 6, true)]
        [TestCase(100, 10, true)]
        [TestCase(100, 12, true)]
        [TestCase(100, 20, true)]
        [TestCase(100, 100, true)]
        [TestCase(100, 1_000, true)]
        [TestCase(100, Limits.Die, true)]
        [TestCase(100, Limits.Die + 1, false)]
        [TestCase(1_000, -1, false)]
        [TestCase(1_000, 0, false)]
        [TestCase(1_000, 1, true)]
        [TestCase(1_000, 2, true)]
        [TestCase(1_000, 3, true)]
        [TestCase(1_000, 4, true)]
        [TestCase(1_000, 6, true)]
        [TestCase(1_000, 10, true)]
        [TestCase(1_000, 12, true)]
        [TestCase(1_000, 20, true)]
        [TestCase(1_000, 100, true)]
        [TestCase(1_000, 1_000, true)]
        [TestCase(1_000, Limits.Die, true)]
        [TestCase(1_000, Limits.Die + 1, false)]
        [TestCase(Limits.Quantity, -1, false)]
        [TestCase(Limits.Quantity, 0, false)]
        [TestCase(Limits.Quantity, 1, true)]
        [TestCase(Limits.Quantity, 2, true)]
        [TestCase(Limits.Quantity, 3, true)]
        [TestCase(Limits.Quantity, 4, true)]
        [TestCase(Limits.Quantity, 6, true)]
        [TestCase(Limits.Quantity, 10, true)]
        [TestCase(Limits.Quantity, 12, true)]
        [TestCase(Limits.Quantity, 20, true)]
        [TestCase(Limits.Quantity, 100, true)]
        [TestCase(Limits.Quantity, 1_000, true)]
        [TestCase(Limits.Quantity, Limits.Die, true)]
        [TestCase(Limits.Quantity, Limits.Die + 1, false)]
        [TestCase(Limits.Quantity + 1, -1, false)]
        [TestCase(Limits.Quantity + 1, 0, false)]
        [TestCase(Limits.Quantity + 1, 1, false)]
        [TestCase(Limits.Quantity + 1, 2, false)]
        [TestCase(Limits.Quantity + 1, 3, false)]
        [TestCase(Limits.Quantity + 1, 4, false)]
        [TestCase(Limits.Quantity + 1, 6, false)]
        [TestCase(Limits.Quantity + 1, 10, false)]
        [TestCase(Limits.Quantity + 1, 12, false)]
        [TestCase(Limits.Quantity + 1, 20, false)]
        [TestCase(Limits.Quantity + 1, 100, false)]
        [TestCase(Limits.Quantity + 1, 1_000, false)]
        [TestCase(Limits.Quantity + 1, Limits.Die, false)]
        [TestCase(Limits.Quantity + 1, Limits.Die + 1, false)]
        public async Task ValidateRoll_ReturnsValidity(int quantity, int die, bool valid)
        {
            var url = GetUrlV1($"?quantity={quantity}&die={die}");
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV1(request);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var validity = StreamHelper.Read<bool>(response.Body);
            Assert.That(validity, Is.EqualTo(valid));
        }

        private string GetUrlV1(string query = "")
        {
            var url = "https://roll.dndgen.com/api/v1/roll/validate";
            if (query.Any())
                url += "?" + query.TrimStart('?');

            return url;
        }

        private string GetUrlV2(int quantity, int die, string query = "")
        {
            var url = $"https://roll.dndgen.com/api/v2/{quantity}/d/{die}/validate";
            if (query.Any())
                url += "?" + query.TrimStart('?');

            return url;
        }

        [TestCase(-1, -1, false)]
        [TestCase(-1, 0, false)]
        [TestCase(-1, 1, false)]
        [TestCase(-1, 2, false)]
        [TestCase(-1, 3, false)]
        [TestCase(-1, 4, false)]
        [TestCase(-1, 6, false)]
        [TestCase(-1, 10, false)]
        [TestCase(-1, 12, false)]
        [TestCase(-1, 20, false)]
        [TestCase(-1, 100, false)]
        [TestCase(-1, 1_000, false)]
        [TestCase(-1, Limits.Die, false)]
        [TestCase(-1, Limits.Die + 1, false)]
        [TestCase(0, -1, false)]
        [TestCase(0, 0, false)]
        [TestCase(0, 1, false)]
        [TestCase(0, 2, false)]
        [TestCase(0, 3, false)]
        [TestCase(0, 4, false)]
        [TestCase(0, 6, false)]
        [TestCase(0, 10, false)]
        [TestCase(0, 12, false)]
        [TestCase(0, 20, false)]
        [TestCase(0, 100, false)]
        [TestCase(0, 1_000, false)]
        [TestCase(0, Limits.Die, false)]
        [TestCase(0, Limits.Die + 1, false)]
        [TestCase(1, -1, false)]
        [TestCase(1, 0, false)]
        [TestCase(1, 1, true)]
        [TestCase(1, 2, true)]
        [TestCase(1, 3, true)]
        [TestCase(1, 4, true)]
        [TestCase(1, 6, true)]
        [TestCase(1, 10, true)]
        [TestCase(1, 12, true)]
        [TestCase(1, 20, true)]
        [TestCase(1, 100, true)]
        [TestCase(1, 1_000, true)]
        [TestCase(1, Limits.Die, true)]
        [TestCase(1, Limits.Die + 1, false)]
        [TestCase(2, -1, false)]
        [TestCase(2, 0, false)]
        [TestCase(2, 1, true)]
        [TestCase(2, 2, true)]
        [TestCase(2, 3, true)]
        [TestCase(2, 4, true)]
        [TestCase(2, 6, true)]
        [TestCase(2, 10, true)]
        [TestCase(2, 12, true)]
        [TestCase(2, 20, true)]
        [TestCase(2, 100, true)]
        [TestCase(2, 1_000, true)]
        [TestCase(2, Limits.Die, true)]
        [TestCase(2, Limits.Die + 1, false)]
        [TestCase(10, -1, false)]
        [TestCase(10, 0, false)]
        [TestCase(10, 1, true)]
        [TestCase(10, 2, true)]
        [TestCase(10, 3, true)]
        [TestCase(10, 4, true)]
        [TestCase(10, 6, true)]
        [TestCase(10, 10, true)]
        [TestCase(10, 12, true)]
        [TestCase(10, 20, true)]
        [TestCase(10, 100, true)]
        [TestCase(10, 1_000, true)]
        [TestCase(10, Limits.Die, true)]
        [TestCase(10, Limits.Die + 1, false)]
        [TestCase(100, -1, false)]
        [TestCase(100, 0, false)]
        [TestCase(100, 1, true)]
        [TestCase(100, 2, true)]
        [TestCase(100, 3, true)]
        [TestCase(100, 4, true)]
        [TestCase(100, 6, true)]
        [TestCase(100, 10, true)]
        [TestCase(100, 12, true)]
        [TestCase(100, 20, true)]
        [TestCase(100, 100, true)]
        [TestCase(100, 1_000, true)]
        [TestCase(100, Limits.Die, true)]
        [TestCase(100, Limits.Die + 1, false)]
        [TestCase(1_000, -1, false)]
        [TestCase(1_000, 0, false)]
        [TestCase(1_000, 1, true)]
        [TestCase(1_000, 2, true)]
        [TestCase(1_000, 3, true)]
        [TestCase(1_000, 4, true)]
        [TestCase(1_000, 6, true)]
        [TestCase(1_000, 10, true)]
        [TestCase(1_000, 12, true)]
        [TestCase(1_000, 20, true)]
        [TestCase(1_000, 100, true)]
        [TestCase(1_000, 1_000, true)]
        [TestCase(1_000, Limits.Die, true)]
        [TestCase(1_000, Limits.Die + 1, false)]
        [TestCase(Limits.Quantity, -1, false)]
        [TestCase(Limits.Quantity, 0, false)]
        [TestCase(Limits.Quantity, 1, true)]
        [TestCase(Limits.Quantity, 2, true)]
        [TestCase(Limits.Quantity, 3, true)]
        [TestCase(Limits.Quantity, 4, true)]
        [TestCase(Limits.Quantity, 6, true)]
        [TestCase(Limits.Quantity, 10, true)]
        [TestCase(Limits.Quantity, 12, true)]
        [TestCase(Limits.Quantity, 20, true)]
        [TestCase(Limits.Quantity, 100, true)]
        [TestCase(Limits.Quantity, 1_000, true)]
        [TestCase(Limits.Quantity, Limits.Die, true)]
        [TestCase(Limits.Quantity, Limits.Die + 1, false)]
        [TestCase(Limits.Quantity + 1, -1, false)]
        [TestCase(Limits.Quantity + 1, 0, false)]
        [TestCase(Limits.Quantity + 1, 1, false)]
        [TestCase(Limits.Quantity + 1, 2, false)]
        [TestCase(Limits.Quantity + 1, 3, false)]
        [TestCase(Limits.Quantity + 1, 4, false)]
        [TestCase(Limits.Quantity + 1, 6, false)]
        [TestCase(Limits.Quantity + 1, 10, false)]
        [TestCase(Limits.Quantity + 1, 12, false)]
        [TestCase(Limits.Quantity + 1, 20, false)]
        [TestCase(Limits.Quantity + 1, 100, false)]
        [TestCase(Limits.Quantity + 1, 1_000, false)]
        [TestCase(Limits.Quantity + 1, Limits.Die, false)]
        [TestCase(Limits.Quantity + 1, Limits.Die + 1, false)]
        public async Task ValidateRollV2_ReturnsValidity(int quantity, int die, bool valid)
        {
            var url = GetUrlV2(quantity, die);
            var request = RequestHelper.BuildRequest(url, serviceProvider);
            var response = await function.RunV2(request, quantity, die);
            Assert.That(response, Is.InstanceOf<HttpResponseData>());

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Body, Is.Not.Null);

            var validity = StreamHelper.Read<bool>(response.Body);
            Assert.That(validity, Is.EqualTo(valid));
        }
    }
}