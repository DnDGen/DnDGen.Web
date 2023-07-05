using Polly;
using Polly.Retry;
using System.Diagnostics;

namespace DnDGen.Api.RollGen.Tests.Integration
{
    //Source: https://www.codit.eu/blog/locally-integration-testing-azure-functions-applications/?country_sel=be
    public class LocalAzureFunctions : IAsyncDisposable
    {
        private readonly Process _application;
        private static readonly HttpClient HttpClient = new HttpClient();

        private LocalAzureFunctions(Process application)
        {
            _application = application;
        }

        public static async Task<LocalAzureFunctions> StartNewAsync(DirectoryInfo projectDirectory)
        {
            int port = 7071;
            Process app = StartApplication(port, projectDirectory);
            await WaitUntilTriggerIsAvailableAsync($"http://localhost:{port}/");

            return new LocalAzureFunctions(app);
        }

        private static Process StartApplication(int port, DirectoryInfo projectDirectory)
        {
            var appInfo = new ProcessStartInfo("func", $"start --port {port} --prefix bin/Release/net6.0")
            {
                UseShellExecute = false,
                CreateNoWindow = true,
                WorkingDirectory = projectDirectory.FullName
            };

            var app = new Process { StartInfo = appInfo };
            app.Start();
            return app;
        }

        private static async Task WaitUntilTriggerIsAvailableAsync(string endpoint)
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
                throw new InvalidOperationException(
                    "The Azure Functions project doesn't seem to be running, "
                    + "please check any build or runtime errors that could occur during startup");
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