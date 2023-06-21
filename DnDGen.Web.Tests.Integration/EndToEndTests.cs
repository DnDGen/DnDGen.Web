using Microsoft.AspNetCore.Mvc.Testing;
using NUnit.Framework;
using System.Net.Http;

namespace DnDGen.Web.Tests.Integration
{
    [TestFixture]
    internal class EndToEndTests
    {
        protected HttpClient httpClient;

        [OneTimeSetUp]
        public void EndToEndSetup()
        {
            var webApplicationFactory = new WebApplicationFactory<Program>();
            httpClient = webApplicationFactory.CreateDefaultClient();
        }
    }
}
