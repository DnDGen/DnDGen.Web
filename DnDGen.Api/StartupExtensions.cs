using Azure.Core.Serialization;
using Azure.Monitor.OpenTelemetry.Exporter;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.OpenTelemetry;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace DnDGen.Api
{
    public static class StartupExtensions
    {
        public static void ConfigureDndgenServices(this IServiceCollection services)
        {
            services.AddOpenTelemetry()
                .UseFunctionsWorkerDefaults()
                .UseAzureMonitorExporter();

            services.Configure<WorkerOptions>(workerOptions =>
            {
                var settings = NewtonsoftJsonObjectSerializer.CreateJsonSerializerSettings();
                settings.ContractResolver = new CamelCasePropertyNamesContractResolver
                {
                    NamingStrategy = new CamelCaseNamingStrategy
                    {
                        ProcessDictionaryKeys = false,
                    }
                };
                settings.NullValueHandling = NullValueHandling.Ignore;

                workerOptions.Serializer = new NewtonsoftJsonObjectSerializer(settings);
            });
        }
    }
}
