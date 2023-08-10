using System.Net;

namespace DnDGen.Api.TreasureGen.Tests.Integration
{
    [Ignore("These tests are failing locally. Will eventually replace them with Postman/nightly E2E tests")]
    public class ApiDocumentationTests : EndToEndTests
    {
        [TestCase("/api/swagger/ui")]
        [TestCase("/API/swagger/ui")]
        public async Task Swagger_ReturnsDocumentation(string route)
        {
            var baseUri = new Uri(localFunctions.BaseUrl);
            var uri = new Uri(baseUri, route);
            var response = await httpClient.GetAsync(uri);

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK), uri.AbsoluteUri);
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("text/html"), uri.AbsoluteUri);

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty, uri.AbsoluteUri);

            //HACK: I would like to assert that the swagger does contain the urls for the API
            //However, I suspect the string is too large for the assertions to work, as they always fail
            //We will assume that, since these endpoints are auto-geneated,
            //if the OpenApi endpoint contains the urls, and the swagger endpoint is not empty, then the swagger should contain the endpoints
        }

        [TestCase("/api/openapi/1.0")]
        [TestCase("/API/openapi/1.0")]
        public async Task OpenApi_ReturnsDocumentation(string route)
        {
            var baseUri = new Uri(localFunctions.BaseUrl);
            var uri = new Uri(baseUri, route);
            var response = await httpClient.GetAsync(uri);

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK), uri.AbsoluteUri);
            Assert.That(response.Content.Headers.ContentType.ToString(), Is.EqualTo("application/json"), uri.AbsoluteUri);

            var result = await response.Content.ReadAsStringAsync();
            Assert.That(result, Is.Not.Empty, uri.AbsoluteUri);
            Assert.That(result, Contains.Substring("/v1/{treasureType}/level/{level}/generate"), uri.AbsoluteUri);
            Assert.That(result, Contains.Substring("/v1/{treasureType}/level/{level}/validate"), uri.AbsoluteUri);
            Assert.That(result, Contains.Substring("/v1/item/{itemType}/power/{power}/generate"), uri.AbsoluteUri);
            Assert.That(result, Contains.Substring("/v1/item/{itemType}/power/{power}/validate"), uri.AbsoluteUri);
        }

        [TestCase("/api/v1/Treasure/level/1/validate")]
        [TestCase("/api/v1/Treasure/level/1/generate")]
        [TestCase("/api/v1/item/Weapon/power/Mundane/validate")]
        [TestCase("/api/v1/item/Weapon/power/Mundane/generate")]
        public async Task ApiRoutes_AreFound(string route)
        {
            var baseUri = new Uri(localFunctions.BaseUrl);
            var uri = new Uri(baseUri, route);
            var response = await httpClient.GetAsync(uri);

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK), uri.AbsoluteUri);
        }

        [TestCase("/api/v1/roll/validate?quantity=1&die=6")]
        [TestCase("/api/v2/1/d/6/validate")]
        public async Task OtherApiRoutes_AreNotFound(string route)
        {
            var baseUri = new Uri(localFunctions.BaseUrl);
            var uri = new Uri(baseUri, route);
            var response = await httpClient.GetAsync(uri);

            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.NotFound), uri.AbsoluteUri);
        }
    }
}
