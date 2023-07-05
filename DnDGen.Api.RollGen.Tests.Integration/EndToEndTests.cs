namespace DnDGen.Api.RollGen.Tests.Integration
{
    [TestFixture]
    public class EndToEndTests
    {
        protected HttpClient httpClient;
        private LocalAzureFunctions localFunctions;

        [OneTimeSetUp]
        public async Task EndToEndSetup()
        {
            httpClient = new HttpClient();

            var currentPath = Directory.GetCurrentDirectory();
            var projectDirectory = new DirectoryInfo(currentPath).Parent.Parent.Parent;
            localFunctions = await LocalAzureFunctions.StartNewAsync(projectDirectory);
        }

        [OneTimeTearDown]
        public async Task EndToEndTeardown()
        {
            httpClient.Dispose();
            await localFunctions.DisposeAsync();
        }
    }
}
