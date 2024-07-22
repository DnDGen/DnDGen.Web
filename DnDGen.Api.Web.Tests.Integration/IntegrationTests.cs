namespace DnDGen.Api.Web.Tests.Integration
{
    [TestFixture]
    public abstract class IntegrationTests
    {
        protected IServiceProvider serviceProvider;

        [OneTimeSetUp]
        public void IntegrationSetup()
        {
            var host = Startup.GetHost();
            serviceProvider = host.Services;
        }
    }
}