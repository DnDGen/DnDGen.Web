using DnDGen.Api.EncounterGen.Dependencies;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.DependencyInjection;

namespace DnDGen.Api.EncounterGen
{
    public static class Startup
    {
        public static void ConfigureServices(IServiceCollection services)
        {
            services.AddApplicationInsightsTelemetryWorkerService();
            services.ConfigureFunctionsApplicationInsights();

            services.AddSingleton<IDependencyFactory, NinjectDependencyFactory>();
        }
    }
}
