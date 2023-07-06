namespace DnDGen.Api.RollGen.Tests.Integration
{
    [TestFixture]
    public class EndToEndTests
    {
        protected HttpClient httpClient;
        protected LocalAzureFunctions localFunctions;

        [OneTimeSetUp]
        public async Task EndToEndSetup()
        {
            httpClient = new HttpClient();

            var projectDirectory = GetTargetProjectDirectory("DnDGen.Api.RollGen");
            localFunctions = await LocalAzureFunctions.StartNewAsync(projectDirectory);
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
