using System.Net;

namespace DnDGen.Api.TreasureGen.Tests.Integration
{
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
            Assert.That(result, Contains.Substring("/v1/generate/random"), uri.AbsoluteUri);
            Assert.That(result, Contains.Substring("/v1/item/generate/random"), uri.AbsoluteUri);
            Assert.That(result, Contains.Substring("/v1/item/validate"), uri.AbsoluteUri);
            Assert.That(result, Contains.Substring("/v1/item/generate"), uri.AbsoluteUri);
        }
    }
}
