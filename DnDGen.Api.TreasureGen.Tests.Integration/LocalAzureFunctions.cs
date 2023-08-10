using Polly;
using Polly.Retry;
using System.Diagnostics;

namespace DnDGen.Api.TreasureGen.Tests.Integration
{
    //Source: https://www.codit.eu/blog/locally-integration-testing-azure-functions-applications/?country_sel=be
    //Source: https://blog.kloud.com.au/2018/11/08/integration-testing-precompiled-v2-azure-functions/
    public class LocalAzureFunctions : IAsyncDisposable
    {
        public string BaseUrl { get; set; }

        private static readonly HttpClient HttpClient = new HttpClient();

        private readonly Process _application;

        private LocalAzureFunctions(Process application)
        {
            _application = application;
        }

        public static async Task<LocalAzureFunctions> StartNewAsync(DirectoryInfo projectDirectory, Settings settings)
        {
            var port = 7002;
            var app = StartApplication(projectDirectory, settings, port);

            var baseUrl = $"http://localhost:{port}/";
            await WaitUntilTriggerIsAvailableAsync(baseUrl, projectDirectory.FullName);

            var localFunctions = new LocalAzureFunctions(app);
            localFunctions.BaseUrl = baseUrl;

            return localFunctions;
        }

        private static Process StartApplication(DirectoryInfo projectDirectory, Settings settings, int port)
        {
            var dotnetExePath = Environment.ExpandEnvironmentVariables(settings.DotnetExecutablePath);
            var functionHostPath = Environment.ExpandEnvironmentVariables(settings.FunctionHostPath);

            var appInfo = new ProcessStartInfo(dotnetExePath, $"\"{functionHostPath}\" start -p {port}")
            {
                UseShellExecute = false,
                CreateNoWindow = true,
                WorkingDirectory = projectDirectory.FullName
            };

            var app = new Process { StartInfo = appInfo };
            app.Start();
            return app;
        }

        private static async Task WaitUntilTriggerIsAvailableAsync(string endpoint, string projectDirectoryPath)
        {
            AsyncRetryPolicy retryPolicy =
                    Policy.Handle<Exception>()
                          .WaitAndRetryForeverAsync(index => TimeSpan.FromMilliseconds(500));

            PolicyResult<HttpResponseMessage> result =
                await Policy.TimeoutAsync(TimeSpan.FromSeconds(30))
                            .WrapAsync(retryPolicy)
                            .ExecuteAndCaptureAsync(() => HttpClient.GetAsync(endpoint));

            if (result.Outcome == OutcomeType.Failure)
            {
                var message = $"The Azure Functions project at '{projectDirectoryPath}' doesn't seem to be running. " +
                    "Please check any build or runtime errors that could occur during startup";
                throw new InvalidOperationException(message);
            }
        }

        public ValueTask DisposeAsync()
        {
            if (!_application.HasExited)
            {
                _application.Kill(entireProcessTree: true);
            }

            _application.Dispose();

            return ValueTask.CompletedTask;
        }
    }
}