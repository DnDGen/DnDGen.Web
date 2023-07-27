using Microsoft.Extensions.Configuration;

namespace DnDGen.Api.TreasureGen.Tests.Integration
{
    [TestFixture]
    [Category("LocalOnly")]
    public class EndToEndTests
    {
        protected HttpClient httpClient;
        protected LocalAzureFunctions localFunctions;
        protected Settings settings;

        [OneTimeSetUp]
        public async Task EndToEndSetup()
        {
            httpClient = new HttpClient();

            var configurationRoot = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .AddEnvironmentVariables()
                .Build();

            settings = new Settings();
            configurationRoot.Bind(settings);

            var projectDirectory = GetTargetProjectDirectory("DnDGen.Api.TreasureGen");
            localFunctions = await LocalAzureFunctions.StartNewAsync(projectDirectory, settings);
        }

        private DirectoryInfo GetTargetProjectDirectory(string targetProject)
        {
            var currentPath = Directory.GetCurrentDirectory();
            var solutionDirectory = new DirectoryInfo(currentPath);

            while (solutionDirectory != null && !solutionDirectory.EnumerateFiles().Any(f => f.Extension == ".sln"))
            {
                solutionDirectory = solutionDirectory.Parent;
            }

            if (solutionDirectory == null)
            {
                throw new Exception($"Could not find a solution file while traversing up the tree from '{currentPath}'");
            }

            var targetDirectory = Path.Combine(solutionDirectory.FullName, targetProject);
            return new DirectoryInfo(targetDirectory);
        }

        [OneTimeTearDown]
        public async Task EndToEndTeardown()
        {
            httpClient.Dispose();
            await localFunctions.DisposeAsync();
        }
    }
}
